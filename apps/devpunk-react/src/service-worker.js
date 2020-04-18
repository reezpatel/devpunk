const CACHE = 'devpunk-c1.1';
const API_URL = 'https://api.devpunk.xyz/v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('fetch', async event => {
  event.respondWith(
    (async () => {
      if (event.request.url.indexOf(API_URL) !== -1) {
        return fetch(event.request.url);
      }

      const store = await caches.open(CACHE);
      const response = await store.match(event.request);

      if (response) {
        return response;
      }

      const _response = await fetch(event.request.url);
      store.put(event.request, _response.clone());
      return _response;
    })()
  );
});
