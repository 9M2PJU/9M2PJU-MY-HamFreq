const CACHE_NAME = 'my-hamfreq-v10';
const STATIC_ASSETS = [
  './',
  './index.html',
  './faq.html',
  './about.html',
  './chirp-guide.html',
  './pmr446-guide.html',
  './bands-guide.html',
  './manifest.json',
  './favicon.ico',
  './favicon-16.png',
  './favicon-32.png',
  './icon-192x192.png',
  './icon-512x512.png',
  './assets/styles.css',
  './assets/theme.css',
  './assets/papaparse.min.js',
  './donate_qr_user.jpg'
];

// Install: cache static shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch:
// - HTML navigations: network-first, fallback to cache (offline page)
// - static assets: cache-first
// - CSV data: stale-while-revalidate
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => caches.match('./index.html').then((c) => c || caches.match(request)))
    );
    return;
  }

  // CSV data: stale-while-revalidate so offline works but updates still propagate
  if (url.pathname.includes('9M2PJU.csv') || url.pathname.includes('TIDRADIO.csv')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        }).catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }

  // Static assets: cache-first (ignore ?v= cache-busting query)
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      if (cached) {
        // revalidate in background
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});

// Notify clients when a new SW takes over (used for update toast)
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
