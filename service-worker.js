const CACHE_VERSION = 'v4';
const CACHE_NAME = `game-cache-${CACHE_VERSION}`;

const ASSETS = [
  '/',
  '/index.html',
  '/phaser.min.js',
  '/js/game.js',
  '/js/index.js',
  '/js/start.js',
  '/manifest.json',
  '/assets/img/background.png',
  '/assets/img/edge.png',
  '/assets/img/wall.png',
  '/assets/img/star.png',
  '/assets/img/home.svg',
  '/assets/img/scoreBoard.png',
  '/assets/img/wickedstone13z.jpg',
  '/assets/hero/ninja1.png',
  '/assets/hero/ninja2.png',
  '/assets/hero/ninja3.png',
  '/assets/hero/ninja4.png',
  '/assets/hero/ninja5.png',
  '/assets/hero/ninja6.png',
  '/assets/hero/ninja7.png',
  '/assets/hero/ninja8.png',
  '/assets/hero/ninja9.png',
  '/assets/img/NINJA1.png',
];

// 📦 INSTALL — Cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching essential game assets...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // ⚡ Activate immediately
});

// 🧹 ACTIVATE — Remove old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating new service worker...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key.startsWith('game-cache-') && key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim(); // Take control of all pages immediately
});

// ⚡ FETCH — Serve from cache first, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request)
        .then((response) => {
          // Optional: cache new responses dynamically
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // Optional: fallback if offline (add your own offline image/page)
        });
    })
  );
});
