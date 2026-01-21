const CACHE_NAME = 'healconnect-cache-v1';
const urlsToCache = [
  '/', // Root path
  '/logo.png', // Replace with actual filename if different
  '/dashboard.svg' // Replace with actual filename if different
];

// Install event: cache essential assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('📦 Caching essential assets');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request)
    )
  );
});