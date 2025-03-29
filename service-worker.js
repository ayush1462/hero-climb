self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("game-cache").then((cache) => {
      console.log("[SW] caching game files ....");
      return cache.addAll([
        "/",
        "/phaser.min.js",
        "/index.html",
        "/js/game.js",
        "js/index.js",
        "/js/start.js",
        "/manifest.json",
        "/assets/img/bg.png",
        "/assets/img/edge.png",
        "/assets/img/wall.png",
        "/assets/img/wickedstone13z.jpg",
        "/assets/hero/ninja1.png",
        "/assets/hero/ninja2.png",
        "/assets/hero/ninja3.png",
        "/assets/hero/ninja4.png",
        "/assets/hero/ninja5.png",
        "/assets/hero/ninja6.png",
        "/assets/hero/ninja7.png",
        "/assets/hero/ninja8.png",
        "/assets/hero/ninja9.png",
        "/assets/img/NINJA1.png",
      ]);
    })
  );
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  console.log("[SW] Service Worker Activated");
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (event) => {
  console.log("[SW] Fetching:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("[SW] Serving from cache:", event.request.url);
        return cachedResponse;
      }
      console.log("[SW] Fetching from network:", event.request.url);
      return fetch(event.request);
    })
  );
});
