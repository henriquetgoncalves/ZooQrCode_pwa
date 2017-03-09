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
    './animal-detail.html',
    './qrcode-scanner.html',
    './map.html',
    './decoder.min.js',
    './JSONdata/default.json',
    './JSONdata/leao.json',    
    './JSONdata/chimpanze.json',    
    './scripts/app.js',
    './scripts/dialog-polyFill.js',
    './scripts/main.js',
    './scripts/menu.js',
    './scripts/parallax.js',
    './scripts/snackbar.js',    
    './scripts/material.min.js',
    './scripts/vendor/qrscan.js',
    './scripts/vendor/animaldata.js',
    './styles/dialog-polyFill.css',
    './styles/inline.css',    
    './styles/qrcode.css',
    './styles/dashboard.css',
    './styles/material.indigo-pink.min.css',
    './favicon.ico',
    './images/icons/icon-32x32.png',
    './images/icons/icon-64x64.png',
    './images/icons/icon-128x128.png',
    './images/icons/icon-144x144.png',
    './images/icons/icon-152x152.png',
    './images/icons/icon-192x192.png',
    './images/icons/icon-256x256.png',
    './images/icons/ic_repteis-128x128.png',
    './images/icons/ic_avatar-32x32.png',
    './images/icons/ic_avatar-64x64.png',
    './images/icons/ic_avatar-128x128.png',
    './images/animals/minimalist_background4.png',
    './images/animals/minimalist_background5.png',
    './images/animals/header.jpg',
    './images/animals/mapa_zoologico.gif',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
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