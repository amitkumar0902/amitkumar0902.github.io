// NurseDrill — the ONE Cloud Function (T07): Razorpay webhook → entitlement.
//
//   payment.captured  → verify signature → notes.uid → extend
//                       users/{uid}.entitlements.norcet.paid_until, and write
//                       a server-only payments/{paymentId} audit doc.
//   refund.processed  → revoke the entitlement (7-day no-questions refund,
//                       T06) and mark the audit doc refunded.
//
// Deploy:  firebase deploy --only functions        (see norcetprep/DEPLOY.md)
// Secret:  firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET
//
// Unmatched payments (missing/unknown uid — e.g. someone edited the payment
// page URL) are audited with status 'unmatched' and reconciled by hand
// against the Razorpay dashboard (T07's support path); the webhook still
// returns 200 so Razorpay stops retrying.

const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const crypto = require('node:crypto');
const admin = require('firebase-admin');

admin.initializeApp();
const WEBHOOK_SECRET = defineSecret('RAZORPAY_WEBHOOK_SECRET');

const PLAN_MONTHS = { '3m': 3, '6m': 6, '12m': 12 };
// Fallback when notes.plan is absent: launch and list amounts, in paise.
const AMOUNT_MONTHS = {
  24900: 3, 29900: 3,
  44900: 6, 59900: 6,
  69900: 12, 99900: 12
};

function verifySignature(rawBody, signature, secret) {
  if (!signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function extendedUntil(currentTs, months, now) {
  const base = currentTs && currentTs.toDate && currentTs.toDate() > now ? currentTs.toDate() : now;
  const d = new Date(base);
  d.setMonth(d.getMonth() + months);
  return d;
}

exports.razorpayWebhook = onRequest(
  { region: 'asia-south1', secrets: [WEBHOOK_SECRET], maxInstances: 3 },
  async (req, res) => {
    if (req.method !== 'POST') return res.status(405).send('POST only');
    if (!verifySignature(req.rawBody, req.get('x-razorpay-signature'), WEBHOOK_SECRET.value())) {
      return res.status(400).send('bad signature');
    }

    const db = admin.firestore();
    const now = new Date();
    const event = req.body && req.body.event;

    try {
      if (event === 'payment.captured') {
        const p = req.body.payload.payment.entity;
        const auditRef = db.collection('payments').doc(p.id);
        if ((await auditRef.get()).exists) return res.status(200).send('duplicate'); // idempotent

        const uid = (p.notes && p.notes.uid) || null;
        const plan = (p.notes && p.notes.plan) || null;
        const months = PLAN_MONTHS[plan] || AMOUNT_MONTHS[p.amount] || null;

        const audit = {
          event,
          paymentId: p.id,
          orderId: p.order_id || null,
          amount: p.amount,
          currency: p.currency,
          email: p.email || null,
          contact: p.contact || null,
          method: p.method || null,
          notes: p.notes || {},
          uid,
          plan,
          months,
          receivedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        if (!uid || !months) {
          await auditRef.set({ ...audit, status: 'unmatched' });
          return res.status(200).send('unmatched — audited for manual reconciliation');
        }

        const userRef = db.collection('users').doc(uid);
        const userSnap = await userRef.get();
        const current = userSnap.exists &&
          userSnap.data().entitlements && userSnap.data().entitlements.norcet &&
          userSnap.data().entitlements.norcet.paid_until;
        const until = extendedUntil(current, months, now);

        // merge-set: works even if the user doc doesn't exist yet (paid
        // before the first progress sync) — entitlements are client-unwritable
        // by rules; Admin SDK bypasses them by design.
        await userRef.set({
          entitlements: {
            norcet: {
              paid_until: admin.firestore.Timestamp.fromDate(until),
              source: 'razorpay',
              orderId: p.order_id || p.id,
              plan: plan || (months + 'm'),
              grantedAt: admin.firestore.FieldValue.serverTimestamp()
            }
          }
        }, { merge: true });

        await auditRef.set({ ...audit, status: 'granted', paidUntil: admin.firestore.Timestamp.fromDate(until) });
        return res.status(200).send('granted');
      }

      if (event === 'refund.processed') {
        const refund = req.body.payload.refund.entity;
        const paymentId = refund.payment_id;
        const auditRef = db.collection('payments').doc(paymentId);
        const auditSnap = await auditRef.get();

        if (!auditSnap.exists || !auditSnap.data().uid) {
          await db.collection('payments').doc('refund-' + refund.id).set({
            event, refundId: refund.id, paymentId, amount: refund.amount,
            status: 'unmatched-refund',
            receivedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          return res.status(200).send('refund unmatched — audited');
        }
        if (auditSnap.data().status === 'refunded') return res.status(200).send('duplicate');

        await db.collection('users').doc(auditSnap.data().uid).set({
          entitlements: {
            norcet: {
              paid_until: admin.firestore.Timestamp.fromDate(now),
              revokedAt: admin.firestore.FieldValue.serverTimestamp(),
              revokedBy: 'refund:' + refund.id
            }
          }
        }, { merge: true });
        await auditRef.set({
          status: 'refunded',
          refund: { id: refund.id, amount: refund.amount, at: admin.firestore.FieldValue.serverTimestamp() }
        }, { merge: true });
        return res.status(200).send('revoked');
      }

      return res.status(200).send('ignored: ' + event);
    } catch (e) {
      console.error('webhook error', event, e);
      // 500 → Razorpay retries with backoff; safe because grants are idempotent.
      return res.status(500).send('error');
    }
  }
);

// The Telegram feeder lives in its own module; re-exported so a single
// `firebase deploy --only functions` ships both.
Object.assign(exports, require('./daily-post'));
