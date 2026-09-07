const CACHE_NAME = 'undec-dw-v5';
const ASSETS = [
  './',
  './index.html',
  './css/base.css',
  './css/login-menu.css',
  './css/mapa.css',
  './css/horarios.css',
  './css/responsive.css',
  './js/utils.js',
  './js/data.js',
  './js/storage.js',
  './js/mapa.js',
  './js/horarios.js',
  './js/main.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
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