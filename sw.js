const CACHE_NAME = 'undec-dw-v3';
const ASSETS = [
  './',
  './index.html',
  './css/estilos.css',
  './js/app.js',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Forzar a que el nuevo Service Worker se active de inmediato
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  // Limpia cachés viejas para que no ocupen espacio ni interfieran
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});