var dataCacheName = 'ZooQrCode_PWA-v1_local';
var cacheName = 'ZooQrCode_PWA_local';
var filesToCache = [];


self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                console.log('[ServiceWorker] Removing old cache', key);
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
});
var filesToCache = [
    './',
    './index.html',
    './about.html',
    './JSONdata/',
    './qrcode-scanner.html',
    './scripts/',
    './scripts/app.js',
    './scripts/dialog-polyFill.js',
    './scripts/main.js',
    './scripts/menu.js',
    './scripts/snackbar.js',
    './scripts/vendor/',
    './scripts/vendor/qrscan.js',
    './styles/',
    './styles/inline.css',
    './styles/dialog-polyFill.css',
    './styles/qrcode.css',
    './favicon.ico',
    './images/icons/'
];

self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    var dataUrl = 'https://henriquetgoncalves.github.io/';
    if (e.request.url.indexOf(dataUrl) === 0) {
        e.respondWith(
            fetch(e.request)
            .then(function (response) {
                return caches.open(dataCacheName).then(function (cache) {
                    cache.put(e.request.url, response.clone());
                    console.log('[ServiceWorker] Fetched&Cached Data');
                    return response;
                });
            })
        );
    } else {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                return response || fetch(e.request);
            })
        );
    }
});