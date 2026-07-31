#!/usr/bin/env node
// Owner tool: grant (or extend) a product entitlement — used for the
// grandfathered allowlist user, support reconciliation, and manual fixes.
// Writes users/{uid}.entitlements.<product> via the Admin SDK (bypasses rules).
//
// Setup (one-off):  npm install firebase-admin        (node_modules is gitignored)
// Auth:             GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json
// Usage:
//   node norcetprep/scripts/grant-entitlement.mjs --email someone@example.com \
//        --months 12 [--product norcet] [--source grant] [--order manual-2026-08-01]
import admin from 'firebase-admin';

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const email = arg('email');
const months = parseInt(arg('months', ''), 10);
const product = arg('product', 'norcet');
const source = arg('source', 'grant');
const orderId = arg('order', 'manual-' + new Date().toISOString().slice(0, 10));
const markRefunded = process.argv.includes('--mark-refunded');
const revoke = months === 0;

if (!email || (!markRefunded && (!Number.isInteger(months) || months < 0))) {
  console.error('Usage: node grant-entitlement.mjs --email <email> --months <n> [--product norcet] [--source grant] [--order <id>]');
  console.error('       --months 0        revoke access now (webhook does this automatically on a gateway refund)');
  console.error('       --mark-refunded   set the one-refund-per-account marker (refund runbook, step 5)');
  process.exit(1);
}

admin.initializeApp();
const db = admin.firestore();

const user = await admin.auth().getUserByEmail(email).catch((e) => {
  console.error(`No auth user for ${email}: ${e.message}`);
  process.exit(1);
});

// The one-per-account refund marker. Set after a refund is processed so the
// account page stops offering another one (T06: one refund per account).
if (markRefunded) {
  await db.collection('users').doc(user.uid).set({
    refund: { used: true, at: admin.firestore.FieldValue.serverTimestamp(), orderId }
  }, { merge: true });
  console.log(`Marked ${email} as having used their one refund [${orderId}]`);
  if (!Number.isInteger(months)) process.exit(0);
}

if (revoke) {
  await db.collection('users').doc(user.uid).set({
    entitlements: {
      [product]: {
        paid_until: admin.firestore.Timestamp.fromDate(new Date()),
        revokedAt: admin.firestore.FieldValue.serverTimestamp(),
        revokedBy: 'manual:' + orderId
      }
    }
  }, { merge: true });
  console.log(`Revoked ${product} for ${email} (${user.uid}) [${orderId}]`);
  process.exit(0);
}

const ref = db.collection('users').doc(user.uid);
const snap = await ref.get();
const existing = snap.exists ? snap.get(`entitlements.${product}.paid_until`) : null;
// Extend from the current expiry if it's still in the future, else from now.
const base = existing && existing.toDate() > new Date() ? existing.toDate() : new Date();
const until = new Date(base);
until.setMonth(until.getMonth() + months);

await ref.set({
  email,
  entitlements: {
    [product]: {
      paid_until: admin.firestore.Timestamp.fromDate(until),
      source,
      orderId,
      plan: `${months}m`,
      grantedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  }
}, { merge: true });

await db.collection('payments').doc(orderId).set({
  uid: user.uid, email, product, source, months,
  paid_until: admin.firestore.Timestamp.fromDate(until),
  recordedAt: admin.firestore.FieldValue.serverTimestamp()
});

console.log(`Granted ${product} to ${email} (${user.uid}) until ${until.toDateString()} [${source}/${orderId}]`);
