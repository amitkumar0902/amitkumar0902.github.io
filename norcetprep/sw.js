// NurseDrill service worker — network-first for HTML, stale-while-revalidate for JSON/CSS/JS.
// Phase 3: the precache holds ONLY the app shell + free content. Premium data
// lives in Firestore behind entitlement rules and rides Firestore's own
// offline persistence (see js/content.js) — it must never be precached here.
const CACHE = 'nursedrill-v15-free-shell';
const PRECACHE = [
  './',
  './index.html',
  './login.html',
  './signup.html',
  './account.html',
  './pricing.html',
  './norcet-free-mock-test.html',
  './css/mains-theme.css',
  './css/hella.css',
  './js/core.js',
  './js/allowlist.js',
  './js/paywall.js',
  './js/content.js',
  './js/analytics.js',
  './js/auth.js',
  './js/sync.js',
  './js/report.js',
  './js/mock-test.js',
  './js/practice.js',
  './js/bank.js',
  './js/flashcards.js',
  './js/hella.js',
  './img/hella-waiting.svg',
  './img/hella-correct.svg',
  './img/hella-wrong.svg',
  './manifest.webmanifest',
  // Free data only — the acquisition funnel and merchandising metadata.
  './data/mains/stats.json',
  './data/mains/syllabus.json',
  './data/mains/videos.json',
  './data/mains/mocks/index.json',
  './data/mains/notes/foundation.json',
  // Free page shells (render their own locked states offline).
  './mains-plan/index.html',
  './mains-plan/mocks/index.html',
  './mains-plan/notes/index.html',
  './mains-plan/syllabus.html',
  './mains-plan/watch.html',
  './mains-plan/settings.html'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.allSettled(PRECACHE.map(u => c.add(new Request(u, { cache: 'reload' }))));
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Premium data never enters SW caches — Firestore persistence is its offline
// story. Everything under data/mains/ except the explicit free files.
const FREE_DATA = /\/data\/mains\/(stats|syllabus|videos)\.json$|\/data\/mains\/mocks\/index\.json$|\/data\/mains\/notes\/foundation\.json$/;
function isPremiumData(url) {
  return url.pathname.includes('/data/mains/') && !FREE_DATA.test(url.pathname);
}

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  if (isPremiumData(url)) return; // straight to network, never cached

  const accept = e.request.headers.get('accept') || '';
  if (accept.includes('text/html')) {
    e.respondWith(networkFirst(e.request));
  } else {
    e.respondWith(staleWhileRevalidate(e.request));
  }
});

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    const cache = await caches.open(CACHE);
    cache.put(req, res.clone());
    return res;
  } catch (e) {
    const cached = await caches.match(req);
    if (cached) return cached;
    return caches.match('./index.html');
  }
}
async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  const netFetch = fetch(req).then(res => { cache.put(req, res.clone()); return res; }).catch(() => cached);
  return cached || netFetch;
}
