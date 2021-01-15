// self.importScripts('data/games.js');

// Files to cache
const cacheName = ["pwaPlayground-v12"];
const appShellFiles = ["index.html", "assets/main.js", "assets/style.css"];
// const gamesImages = [];
// for (let i = 0; i < games.length; i++) {
//   gamesImages.push(`data/img/${games[i].slug}.jpg`);
// }
// const contentToCache = appShellFiles.concat(gamesImages);
const contentToCache = appShellFiles;

// Installing Service Worker
// self.addEventListener("install", (e) => {
//     console.log("[Service Worker] Install");
//     e.waitUntil(
//         (async () => {
//             const cache = await caches.open(cacheName);
//             console.log("[Service Worker] Caching all: app shell and content");
//             await cache.addAll(contentToCache);
//         })()
//     );
// });

// Fetching content using Service Worker
// self.addEventListener("fetch", (e) => {
//     e.respondWith(
//         (async () => {
//             const r = await caches.match(e.request);
//             console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
//             if (r) return r;
//             const response = await fetch(e.request);
//             const cache = await caches.open(cacheName);
//             console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
//             cache.put(e.request, response.clone());
//             return response;
//         })()
//     );
// });

// contentToCache.push("/pwa-playground/style.css");

// self.addEventListener("install", (e) => {
//     e.waitUntil(
//         caches.open("pwaPlayground-v2").then((cache) => {
//             return cache.addAll(contentToCache);
//         })
//     );
// });

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
