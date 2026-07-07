/* Strings of Hope — service worker.
   Strategy: navigations network-first (so testers get fresh builds),
   other same-origin GETs stale-while-revalidate, offline app-shell fallback.
   Bump CACHE on meaningful releases to retire old caches. */
const CACHE = 'soh-v2026.07.08-1';
const SHELL = [
  './', './index.html', './styles.css',
  './tuning.js', './audio.js', './data.js', './jewish.js',
  './theory.js', './jacob.js', './shamayim.js', './chen.js', './app.js',
  './vendor/vexflow.js', './vendor/osmd.js', './vendor/pitchy.js', './vendor/fft.js',
  './fonts/ShlomoStam.ttf',
  './img/lyre.png', './img/icon-192.png', './img/icon-512.png', './manifest.webmanifest'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Page navigations → network first, fall back to cached shell (offline).
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => { caches.open(CACHE).then(c => c.put('./index.html', res.clone())); return res; })
                .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }
  if (!sameOrigin) return; // let cross-origin (e.g. Google Fonts) hit the network

  // Same-origin assets → serve cache immediately, refresh in background.
  e.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(res => {
        if (res && res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
