// Per aggiornare il sw ricordati di cambiare la versione del cacheName

// Files to cache
const cacheName = ["pwaPlayground-v13"];
const appShellFiles = ["index.html", "assets/main.js", "assets/style.css"];
// const gamesImages = [];
// for (let i = 0; i < games.length; i++) {
//   gamesImages.push(`data/img/${games[i].slug}.jpg`);
// }
// const contentToCache = appShellFiles.concat(gamesImages);
const contentToCache = appShellFiles;

self.addEventListener("install", (e) => {
    console.log("[Service Worker] Installed");
    e.waitUntil(
        caches
            .open(cacheName)
            .then((cache) => {
                console.log("[Service Worker] Caching contentToCache");
                return cache.addAll(contentToCache);
            })
            .catch((err) => console.error(`[Service Worker] Caching contentToCache: ${err}`))
    );
});

self.addEventListener("activate", (e) => {
    console.log("[Service Worker] Activated");
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((thisCacheName) => {
                    if (!cacheName.includes(thisCacheName)) {
                        console.log(`[Service Worker] Removing Cached Files from Cache-${thisCacheName}`);
                        return caches.delete(thisCacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", (e) => {
    console.log(`[Service Worker] Fetching ${e.request.url}`);
    e.respondWith(
        caches.match(e.request).then((response) => {
            if (response) {
                console.log(`[Service Worker] Found in cache ${e.request.url}${response}`);
                return response;
            }

            const requestClone = e.request.clone();
            return fetch(requestClone)
                .then((response) => {
                    if (!response) {
                        console.log("[ServiceWorker] No response from fetch ");
                        return response;
                    }
                    const responseClone = response.clone();
                    caches.open(cacheName).then((cache) => {
                        cache.put(e.request, responseClone);
                        console.log("[ServiceWorker] New Data Cached", e.request.url);
                        return response;
                    });
                })
                .catch((err) => console.log("[ServiceWorker] Error Fetching & Caching New Data", err));
        })
    );
});
