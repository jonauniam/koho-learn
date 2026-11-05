const CACHE_NAME = 'kho-learn-cefr-v8';
const ASSETS = ['./', './index.html', './manifest.json', './kho-icon-180.png'];
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).then(res => {
    const copy = res.clone();
    caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
    return res;
  }).catch(() => caches.match(e.request)));
});
