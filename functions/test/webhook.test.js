// Behaviour tests for the Razorpay webhook (the one Cloud Function).
//
// Run:  cd functions && npm test          (no install, no live Firebase)
//
// Every assertion is about what the gateway and the database can observe:
// the HTTP status returned, and the documents that exist afterwards. Nothing
// here reaches into the function's internals.

const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { post, reset, store, captured, refunded } = require('./harness');

const USER = 'users/user-1';
const AUDIT = 'payments/pay_TEST1';

function paidUntil(uid = 'user-1') {
  const doc = store().get('users/' + uid);
  return doc.entitlements.norcet.paid_until.toDate();
}

function monthsFromNow(n, from = new Date()) {
  const d = new Date(from);
  d.setMonth(d.getMonth() + n);
  return d;
}

beforeEach(() => reset());

// ---- Authenticity -----------------------------------------------------------

test('missing signature is rejected and writes nothing', async () => {
  const res = await post(captured(), { signature: null });
  assert.equal(res.statusCode, 400);
  assert.deepEqual(store().keys(), []);
});

test('wrong signature is rejected and writes nothing', async () => {
  const res = await post(captured(), { signature: 'deadbeef'.repeat(8) });
  assert.equal(res.statusCode, 400);
  assert.deepEqual(store().keys(), []);
});

test('signature computed over a different body is rejected', async () => {
  // A valid signature for *some* payload must not authenticate another one.
  const other = await post(captured({ id: 'pay_OTHER' }));
  assert.equal(other.statusCode, 200);
  reset();

  const crypto = require('node:crypto');
  const foreign = crypto.createHmac('sha256', 'test-webhook-secret')
    .update(Buffer.from(JSON.stringify(captured({ id: 'pay_OTHER' })), 'utf8'))
    .digest('hex');
  const res = await post(captured({ id: 'pay_TAMPERED' }), { signature: foreign });
  assert.equal(res.statusCode, 400);
  assert.deepEqual(store().keys(), []);
});

test('signature from the wrong secret is rejected', async () => {
  const res = await post(captured(), { secret: 'not-the-secret' });
  assert.equal(res.statusCode, 400);
  assert.deepEqual(store().keys(), []);
});

// ---- Method and event routing ----------------------------------------------

test('non-POST is rejected with 405', async () => {
  const res = await post(captured(), { method: 'GET' });
  assert.equal(res.statusCode, 405);
  assert.deepEqual(store().keys(), []);
});

test('unknown event is acknowledged and writes nothing', async () => {
  const res = await post({ event: 'payment.authorized', payload: {} });
  assert.equal(res.statusCode, 200);
  assert.match(String(res.body), /ignored/);
  assert.deepEqual(store().keys(), []);
});

// ---- Grant ------------------------------------------------------------------

test('captured payment grants the entitlement and audits it', async () => {
  const before = new Date();
  const res = await post(captured({ notes: { uid: 'user-1', plan: '3m' } }));
  assert.equal(res.statusCode, 200);

  const until = paidUntil();
  const expected = monthsFromNow(3, before);
  assert.ok(Math.abs(until - expected) < 60_000, `paid_until ${until} ≈ ${expected}`);

  const ent = store().get(USER).entitlements.norcet;
  assert.equal(ent.source, 'razorpay');
  assert.equal(ent.plan, '3m');
  assert.equal(ent.orderId, 'order_TEST1');

  const audit = store().get(AUDIT);
  assert.equal(audit.status, 'granted');
  assert.equal(audit.uid, 'user-1');
  assert.equal(audit.months, 3);
  assert.equal(audit.amount, 24900);
  assert.equal(audit.email, 'buyer@example.com');
});

test('grant works when the user document does not exist yet', async () => {
  await post(captured({ notes: { uid: 'brand-new', plan: '12m' } }));
  const doc = store().get('users/brand-new');
  assert.ok(doc, 'user doc created by the grant');
  assert.ok(doc.entitlements.norcet.paid_until.toDate() > new Date());
});

test('grant preserves unrelated fields on an existing user document', async () => {
  store().data.set('users/user-1', { progress: { mocks: 3 }, displayName: 'Asha' });
  await post(captured());
  const doc = store().get(USER);
  assert.deepEqual(doc.progress, { mocks: 3 });
  assert.equal(doc.displayName, 'Asha');
  assert.ok(doc.entitlements.norcet.paid_until);
});

// ---- Idempotency ------------------------------------------------------------

test('duplicate delivery of the same payment id does not write twice', async () => {
  await post(captured());
  const firstUntil = paidUntil();
  const writesAfterFirst = store().writes;

  const res = await post(captured()); // gateway retry, same payment id
  assert.equal(res.statusCode, 200);
  assert.match(String(res.body), /duplicate/);
  assert.equal(store().writes, writesAfterFirst, 'no further writes');
  assert.equal(paidUntil().getTime(), firstUntil.getTime(), 'entitlement untouched');
});

// ---- Validity stacking ------------------------------------------------------

test('buying while a plan is active extends from the existing expiry', async () => {
  const futureExpiry = new Date(Date.now() + 40 * 24 * 3600 * 1000); // 40 days out
  store().data.set('users/user-1', {
    entitlements: { norcet: { paid_until: { _ts: true, toDate: () => futureExpiry } } }
  });

  await post(captured({ id: 'pay_STACK', notes: { uid: 'user-1', plan: '6m' } }));

  const until = paidUntil();
  const expected = monthsFromNow(6, futureExpiry);
  assert.ok(Math.abs(until - expected) < 60_000, 'stacked on top of remaining days');
  assert.ok(until - Date.now() > 200 * 24 * 3600 * 1000, 'remaining days were not discarded');
});

test('buying after a lapsed plan starts from today, not from the old expiry', async () => {
  const pastExpiry = new Date(Date.now() - 90 * 24 * 3600 * 1000);
  store().data.set('users/user-1', {
    entitlements: { norcet: { paid_until: { _ts: true, toDate: () => pastExpiry } } }
  });

  const before = new Date();
  await post(captured({ id: 'pay_LAPSED', notes: { uid: 'user-1', plan: '3m' } }));

  const until = paidUntil();
  assert.ok(Math.abs(until - monthsFromNow(3, before)) < 60_000);
});

// ---- Plan resolution --------------------------------------------------------

test('missing plan note falls back to the launch amount map', async () => {
  await post(captured({ id: 'pay_AMT_LAUNCH', amount: 44900, notes: { uid: 'user-1' } }));
  assert.equal(store().get('payments/pay_AMT_LAUNCH').months, 6);
});

test('missing plan note falls back to the list amount map', async () => {
  await post(captured({ id: 'pay_AMT_LIST', amount: 99900, notes: { uid: 'user-1' } }));
  assert.equal(store().get('payments/pay_AMT_LIST').months, 12);
});

test('unknown amount with no plan note is audited as unmatched', async () => {
  const res = await post(captured({ id: 'pay_ODD', amount: 12300, notes: { uid: 'user-1' } }));
  assert.equal(res.statusCode, 200);
  assert.equal(store().get('payments/pay_ODD').status, 'unmatched');
  assert.equal(store().has(USER), false, 'no entitlement written');
});

// ---- Unmatched payments -----------------------------------------------------

test('payment with no uid is audited for reconciliation, never dropped', async () => {
  const res = await post(captured({ id: 'pay_NOUID', notes: { plan: '3m' } }));
  assert.equal(res.statusCode, 200); // 200 so the gateway stops retrying
  const audit = store().get('payments/pay_NOUID');
  assert.equal(audit.status, 'unmatched');
  assert.equal(audit.amount, 24900);
  assert.equal(audit.email, 'buyer@example.com', 'contact details kept for manual matching');
  assert.equal(store().keys().length, 1, 'audit only — no user write');
});

test('payment with empty notes is audited as unmatched', async () => {
  const res = await post(captured({ id: 'pay_NONOTES', notes: {} }));
  assert.equal(res.statusCode, 200);
  assert.equal(store().get('payments/pay_NONOTES').status, 'unmatched');
});

// ---- Refunds ----------------------------------------------------------------

test('refund revokes access and marks the audit refunded', async () => {
  await post(captured());
  assert.ok(paidUntil() > new Date(), 'premium before the refund');

  const res = await post(refunded());
  assert.equal(res.statusCode, 200);

  assert.ok(paidUntil() <= new Date(), 'entitlement revoked');
  const ent = store().get(USER).entitlements.norcet;
  assert.equal(ent.revokedBy, 'refund:rfnd_TEST1');

  const audit = store().get(AUDIT);
  assert.equal(audit.status, 'refunded');
  assert.equal(audit.refund.id, 'rfnd_TEST1');
});

test('duplicate refund delivery is a no-op', async () => {
  await post(captured());
  await post(refunded());
  const writesAfterFirst = store().writes;

  const res = await post(refunded());
  assert.equal(res.statusCode, 200);
  assert.match(String(res.body), /duplicate/);
  assert.equal(store().writes, writesAfterFirst);
});

test('refund for an unknown payment is audited, not dropped', async () => {
  const res = await post(refunded({ id: 'rfnd_GHOST', paymentId: 'pay_UNSEEN' }));
  assert.equal(res.statusCode, 200);
  const audit = store().get('payments/refund-rfnd_GHOST');
  assert.equal(audit.status, 'unmatched-refund');
  assert.equal(audit.paymentId, 'pay_UNSEEN');
});

test('refund of an unmatched payment does not try to revoke anybody', async () => {
  await post(captured({ id: 'pay_NOUID2', notes: {} }));
  const res = await post(refunded({ id: 'rfnd_X', paymentId: 'pay_NOUID2' }));
  assert.equal(res.statusCode, 200);
  assert.equal(store().get('payments/refund-rfnd_X').status, 'unmatched-refund');
  assert.equal(store().has(USER), false);
});

// ---- Failure mode -----------------------------------------------------------

test('an internal failure returns 500 so the gateway retries', async () => {
  store().failOn = 'payments/pay_TEST1';
  const res = await post(captured());
  assert.equal(res.statusCode, 500);
});

test('a retry after a failed grant still grants exactly once', async () => {
  // The write path failed mid-way; Razorpay retries; the result must be one
  // grant with one audit record — this is why 500 is safe.
  store().failOn = 'payments/pay_TEST1';
  assert.equal((await post(captured())).statusCode, 500);

  store().failOn = null;
  assert.equal((await post(captured())).statusCode, 200);
  assert.equal((await post(captured())).statusCode, 200);

  assert.equal(store().get(AUDIT).status, 'granted');
  const until = paidUntil();
  assert.ok(Math.abs(until - monthsFromNow(3)) < 60_000, 'granted once, not twice');
});
