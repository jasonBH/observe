console.log('==================service-worker.js Script loaded!')
var cacheStorageKey = 'minimal-pwa-8'

var cacheList = [
  '/',
  "/index.html",
  "/css/index.css",
  "/index.js",
  "/vendor.js",
  //images
  "/images/fog.png",
  "/images/ic_refresh_white_24px.svg",
  "/images/ic_add_white_24px.svg",
]

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] install event!')
  e.waitUntil(
    caches.open(cacheStorageKey).then(function(cache) {
      console.log('[ServiceWorker] Adding to Cache:', cacheList)
      return cache.addAll(cacheList)
    })
    /* .then(function() {
      console.log('[ServiceWorker] Skip waiting!')
      return self.skipWaiting()
    }) */
  )
})

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate event', Promise.all)
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheStorageKey) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
})
/* self.addEventListener('activate', (e)=>{
  console.log('new [ServiceWorker] Activate event')
}) */

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      console.log("[Service Worker] Fetch request:", e.request.url)
      return response || fetch(e.request);
    })
  );
});