// Test harness for the Razorpay webhook.
//
// The function under test is a Cloud Function: requiring it pulls in
// firebase-admin and firebase-functions, neither of which we want (or need)
// installed to assert behaviour. Module._load is patched to hand back stubs,
// so `node --test` runs with zero dependencies and no network.
//
// The stubs model only what the webhook observes: an in-memory Firestore with
// merge-set semantics, server timestamps, and Timestamp.toDate().

const Module = require('node:module');
const path = require('node:path');
const crypto = require('node:crypto');

const SECRET = 'test-webhook-secret';

// ---- In-memory Firestore ----------------------------------------------------

const SERVER_TS = Symbol('serverTimestamp');

function makeTimestamp(date) {
  return { _ts: true, toDate: () => new Date(date.getTime()) };
}

// Deep merge for set(..., {merge:true}); plain objects merge, everything else
// replaces — same shape of behaviour Firestore gives for nested maps.
function mergeInto(target, patch, now) {
  for (const [k, v] of Object.entries(patch)) {
    if (v === SERVER_TS) {
      target[k] = makeTimestamp(now);
    } else if (v && typeof v === 'object' && !Array.isArray(v) && !v._ts && typeof v.toDate !== 'function') {
      if (!target[k] || typeof target[k] !== 'object' || Array.isArray(target[k])) target[k] = {};
      mergeInto(target[k], v, now);
    } else {
      target[k] = v;
    }
  }
  return target;
}

function resolveAll(value, now) {
  if (value === SERVER_TS) return makeTimestamp(now);
  if (value && typeof value === 'object' && !Array.isArray(value) && !value._ts && typeof value.toDate !== 'function') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = resolveAll(v, now);
    return out;
  }
  return value;
}

function clone(value) {
  if (value && typeof value.toDate === 'function') return value;
  if (Array.isArray(value)) return value.map(clone);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = clone(v);
    return out;
  }
  return value;
}

class FakeFirestore {
  constructor() {
    this.data = new Map(); // 'collection/doc' -> object
    this.now = new Date();
    this.failOn = null;    // set to a doc path to simulate an internal error
    this.writes = 0;
  }

  _key(col, id) { return col + '/' + id; }

  collection(col) {
    const db = this;
    return {
      doc(id) {
        const key = db._key(col, id);
        return {
          path: key,
          async get() {
            if (db.failOn === key) throw new Error('simulated Firestore failure');
            const raw = db.data.get(key);
            return {
              exists: raw !== undefined,
              data: () => (raw === undefined ? undefined : clone(raw))
            };
          },
          async set(value, opts) {
            if (db.failOn === key) throw new Error('simulated Firestore failure');
            db.writes++;
            if (opts && opts.merge) {
              const current = db.data.get(key) || {};
              db.data.set(key, mergeInto(current, value, db.now));
            } else {
              db.data.set(key, resolveAll(value, db.now));
            }
          }
        };
      }
    };
  }

  // Test-side reads
  get(pathStr) { const v = this.data.get(pathStr); return v === undefined ? undefined : clone(v); }
  has(pathStr) { return this.data.has(pathStr); }
  keys() { return [...this.data.keys()]; }
}

// ---- Module stubs -----------------------------------------------------------

let db = new FakeFirestore();

const adminStub = {
  initializeApp() {},
  firestore: Object.assign(() => db, {
    FieldValue: { serverTimestamp: () => SERVER_TS },
    Timestamp: { fromDate: (d) => makeTimestamp(d) }
  })
};

let registeredHandler = null;
const httpsStub = {
  onRequest(_opts, handler) { registeredHandler = handler; return handler; }
};
const paramsStub = {
  defineSecret: (name) => ({ name, value: () => SECRET })
};

const STUBS = {
  'firebase-admin': adminStub,
  'firebase-functions/v2/https': httpsStub,
  'firebase-functions/params': paramsStub
};

const realLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (Object.prototype.hasOwnProperty.call(STUBS, request)) return STUBS[request];
  return realLoad.call(this, request, parent, isMain);
};

const fn = require(path.join(__dirname, '..', 'index.js'));
const handler = registeredHandler || fn.razorpayWebhook;

// ---- Request / response doubles --------------------------------------------

function sign(rawBody, secret = SECRET) {
  return crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
}

// Calls the webhook the way the gateway would. `signature` overrides the
// computed one (null = header absent) so signature failures are testable.
async function post(body, opts = {}) {
  const rawBody = Buffer.from(JSON.stringify(body), 'utf8');
  const signature = opts.signature === undefined ? sign(rawBody, opts.secret) : opts.signature;
  const res = {
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this; },
    send(payload) { this.body = payload; return this; }
  };
  const req = {
    method: opts.method || 'POST',
    rawBody,
    body,
    get(header) {
      if (String(header).toLowerCase() === 'x-razorpay-signature') return signature === null ? undefined : signature;
      return undefined;
    }
  };
  await handler(req, res);
  return res;
}

function reset() { db = new FakeFirestore(); return db; }
function store() { return db; }

// ---- Event fixtures ---------------------------------------------------------

function captured({ id = 'pay_TEST1', amount = 24900, notes = { uid: 'user-1', plan: '3m' }, orderId = 'order_TEST1', email = 'buyer@example.com' } = {}) {
  return {
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id, amount, currency: 'INR', order_id: orderId,
          email, contact: '+919999999999', method: 'upi', notes
        }
      }
    }
  };
}

function refunded({ id = 'rfnd_TEST1', paymentId = 'pay_TEST1', amount = 24900 } = {}) {
  return {
    event: 'refund.processed',
    payload: { refund: { entity: { id, payment_id: paymentId, amount } } }
  };
}

module.exports = { post, reset, store, sign, captured, refunded, SECRET };
