let cacheStorageKey = 'minimal-pwa-8'

let cacheList = [];
const { assets } = global.serviceWorkerOption;

let assetsToCache = [...assets, './'];
cacheList = assetsToCache.map(path => {
  return new URL(path, global.location).toString()
})
console.log('==================sw index.js cacheList:',cacheList)

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] install event!')
  e.waitUntil(
    caches.open(cacheStorageKey).then(function(cache) {
      console.log('[ServiceWorker] Adding to Cache:', cacheList)
      return cache.addAll(cacheList)
    }).catch(error => {
      console.error(error)
      throw error
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
    Promise.all([
      self.clients.claim(),
      caches.keys().then(function(keyList) {
        return Promise.all(
          keyList.map(function(key){
            if (key !== cacheStorageKey) {
              console.log('[ServiceWorker] Removing old cache', key);
              return caches.delete(key);
            }
          })
        );
      })
    ])
  );
  // return self.clients.claim();
})


self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch:', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      // 如果 Service Worker 有自己的返回，就直接返回，减少一次 http 请求
      if (response) {
        return response;
      }
      // 如果 service worker 没有返回，那就得直接请求真实远程服务
      var request = e.request.clone(); // 把原始请求拷过来
      return fetch(request).then(function (httpRes) {
        // http请求的返回已被抓到，可以处置了。

        // 请求失败了，直接返回失败的结果就好了。。
        if (!httpRes || httpRes.status !== 200) {
          return httpRes;
        }

        // 请求成功的话，将请求缓存起来。
        var responseClone = httpRes.clone();
        caches.open(cacheStorageKey).then(function (cache) {
            cache.put(e.request, responseClone);
        });
        console.log("[Service Worker] Fetch 请求成功 新增:", e.request)
        return httpRes;
      })
    })
  );
});