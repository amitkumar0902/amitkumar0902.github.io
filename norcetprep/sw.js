// NORCET Mains service worker — network-first for HTML, stale-while-revalidate for JSON/CSS/JS
const CACHE = 'norcet-mains-v1';
const PRECACHE = [
  './',
  './index.html',
  './css/mains-theme.css',
  './js/core.js',
  './js/mock-test.js',
  './js/practice.js',
  './js/bank.js',
  './js/flashcards.js',
  './manifest.webmanifest',
  './data/mains/question-bank.json',
  './data/mains/drill-drug-calc.json',
  './data/mains/stats.json',
  './data/mains/mocks/index.json',
  './mains-plan/index.html',
  './mains-plan/bank.html',
  './mains-plan/dashboard.html',
  './mains-plan/review.html',
  './mains-plan/settings.html',
  './mains-plan/pyqs.html'
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

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

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
