// Market Clock service worker — runtime caching (no build-time precache list,
// since Next.js hashes asset filenames every build and a hand-maintained
// precache manifest would silently go stale).
//
// Strategy:
//  - Navigations (HTML pages): network-first, falling back to whatever was
//    last cached for that URL, falling back to /offline.html.
//  - Same-origin static assets (JS/CSS/fonts/images): cache-first, filled
//    in lazily as they're requested, with a network fallback.
//  - Everything cross-origin, or non-GET, is left alone (not intercepted).
//
// Bump CACHE_VERSION whenever you want to force clients to drop old caches.
const CACHE_VERSION = "v1";
const CACHE_NAME = `market-clock-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Page navigations: network-first, cache the successful response, fall
  // back to the cached copy of that page, then to the offline shell.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(
          async () =>
            (await caches.match(request)) ||
            (await caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // Static assets: cache-first, populate cache on first successful fetch.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
