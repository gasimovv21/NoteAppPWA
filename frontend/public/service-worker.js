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

self.addEventListener('push', function(event) {
    console.log("Push event received:", event);  // Отладочный вывод
    const data = event.data ? event.data.json() : {};
    const title = data.title || "Новое уведомление";
    const options = {
        body: data.message || "У вас новое уведомление!",
        icon: '/static/media/logo192.png',  
        badge: '/static/media/logo512.png',  
        data: { url: data.url || '/' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
});



// Обработка клика по уведомлению
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const urlToOpen = event.notification.data.url;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            for (const client of windowClients) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
