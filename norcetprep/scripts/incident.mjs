#!/usr/bin/env node
/**
 * Raise or clear the site-wide incident banner.
 *
 *   node norcetprep/scripts/incident.mjs status
 *   node norcetprep/scripts/incident.mjs raise "Checkout is failing for UPI. We're on it — nothing is charged twice."
 *   node norcetprep/scripts/incident.mjs clear
 *
 * Needs GOOGLE_APPLICATION_CREDENTIALS pointing at a service-account key and
 * `npm install firebase-admin` (gitignored), same as the grant script.
 *
 * The banner is read by js/site-chrome.js on every page family, including
 * app-mode, and is readable by signed-out visitors — an incident notice nobody
 * can see is not a notice. Firestore rules make it server-write-only.
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const [, , cmd, ...rest] = process.argv;
const message = rest.join(' ').trim();

if (!cmd || !['status', 'raise', 'clear'].includes(cmd)) {
  console.error('usage: incident.mjs status | raise "<message>" | clear');
  process.exit(2);
}
if (cmd === 'raise' && !message) {
  console.error('A banner with no message helps nobody. Pass the message.');
  process.exit(2);
}
if (message.length > 300) {
  console.error('Keep it under 300 characters — it is a banner, not a post.');
  process.exit(2);
}

let admin;
try {
  admin = require('firebase-admin');
} catch (e) {
  console.error('firebase-admin is not installed here. Run: npm install firebase-admin');
  process.exit(1);
}

admin.initializeApp();
const db = admin.firestore();
const ref = db.collection('config').doc('site');

const snap = await ref.get();
const current = (snap.exists && snap.data().incident) || { active: false };

if (cmd === 'status') {
  console.log(current.active ? `ACTIVE since ${current.since || '?'}: ${current.message}` : 'no active incident');
  process.exit(0);
}

if (cmd === 'clear') {
  await ref.set({ incident: { active: false, clearedAt: admin.firestore.FieldValue.serverTimestamp() } }, { merge: true });
  console.log('banner cleared — visitors stop seeing it on their next page load');
  process.exit(0);
}

await ref.set({
  incident: {
    active: true,
    message,
    since: new Date().toISOString().slice(0, 16).replace('T', ' ') + ' IST',
    raisedAt: admin.firestore.FieldValue.serverTimestamp()
  }
}, { merge: true });
console.log('banner raised:', message);
console.log('Remember the other half of the drill: pin the same note in the Telegram channel.');
