self.addEventListener('install', event => {
    event.waitUntil(
        fetch('/asset-manifest.json').then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to fetch asset-manifest.json');
        }).then(assets => {
            const urlsToCache = [
                './',
                './index.html',
                assets['files']['main.js'],
                assets['files']['main.css'],
                '/static/media/logo192.png',
                '/static/media/logo512.png'
            ];
            return caches.open('static-cache').then(cache => {
                return cache.addAll(urlsToCache).catch(error => {
                    console.error('Failed to cache assets:', error);
                });
            });
        }).catch(error => {
            console.error('Failed to cache assets:', error);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});