// A DOM shim just wide enough to load the site's front-end modules in Node.
//
// These scripts are plain IIFEs that attach to window; they touch location,
// storage, a little DOM and fetch. Rather than pull in a browser engine, this
// provides the narrow surface they actually use, so the behaviour tests stay
// fast and dependency-free.

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');

function makeStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
    clear: () => map.clear(),
    get length() { return map.size; },
    _dump: () => Object.fromEntries(map)
  };
}

function makeElement(tag) {
  const el = {
    tagName: String(tag).toUpperCase(),
    children: [],
    style: {},
    dataset: {},
    attributes: {},
    innerHTML: '',
    textContent: '',
    className: '',
    id: '',
    hidden: false,
    setAttribute(k, v) { this.attributes[k] = String(v); },
    getAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attributes, k) ? this.attributes[k] : null; },
    removeAttribute(k) { delete this.attributes[k]; },
    appendChild(c) { this.children.push(c); return c; },
    insertBefore(c) { this.children.unshift(c); return c; },
    removeChild(c) { this.children = this.children.filter((x) => x !== c); },
    remove() {},
    addEventListener() {},
    removeEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    closest() { return null; },
    classList: { add() {}, remove() {}, contains() { return false; } }
  };
  return el;
}

/**
 * Loads one or more site scripts into a fresh sandbox.
 *   href      — the page URL the scripts should believe they are on
 *   referrer  — document.referrer (app-mode detection reads it)
 *   fetchImpl — async (url) => ({ ok, json() })
 */
function loadScripts(files, { href = 'https://nursedrill.com/index.html', referrer = '', fetchImpl } = {}) {
  const url = new URL(href);
  const documentElement = makeElement('html');
  const body = makeElement('body');
  const head = makeElement('head');
  const byId = new Map();

  const document = {
    documentElement,
    body,
    head,
    readyState: 'complete',
    referrer,
    createElement: makeElement,
    getElementById: (id) => byId.get(id) || null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {}
  };

  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    setInterval: () => 0,
    clearInterval: () => {},
    Promise,
    JSON,
    Math,
    Date,
    Object,
    Array,
    String,
    Number,
    Boolean,
    RegExp,
    Error,
    encodeURIComponent,
    decodeURIComponent,
    document,
    navigator: { userAgent: 'node-test', serviceWorker: undefined },
    localStorage: makeStorage(),
    sessionStorage: makeStorage(),
    location: {
      href,
      pathname: url.pathname,
      search: url.search,
      origin: url.origin,
      replace() {}
    },
    matchMedia: () => ({ matches: false }),
    fetch: fetchImpl || (async () => ({ ok: false, json: async () => ({}) })),
    _byId: byId
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;

  vm.createContext(sandbox);
  for (const f of files) {
    const code = fs.readFileSync(path.join(ROOT, f), 'utf8');
    vm.runInContext(code, sandbox, { filename: f });
  }
  return sandbox;
}

// Serves the repo's real JSON files to code under test — the point is to run
// against the actual question bank, not a fixture that can drift from it.
function repoFetch() {
  return async (url) => {
    const rel = String(url).replace(/^.*?(data\/)/, '$1');
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) return { ok: false, status: 404, json: async () => ({}) };
    const text = fs.readFileSync(file, 'utf8');
    return { ok: true, status: 200, json: async () => JSON.parse(text) };
  };
}

module.exports = { loadScripts, repoFetch, makeStorage, ROOT };
