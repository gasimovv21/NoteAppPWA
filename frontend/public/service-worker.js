self.addEventListener('install', event => {
    event.waitUntil(
        // Загрузка asset-manifest.json для динамического кэширования файлов
        fetch('/asset-manifest.json').then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to fetch asset-manifest.json');
        }).then(assets => {
            const urlsToCache = [
                './',
                './index.html',
                assets['files']['main.js'],        // Основной JS-файл
                assets['files']['main.css'],       // Основной CSS-файл
                '/static/media/logo192.png',       // Исправленный путь к иконке
                '/static/media/logo512.png'        // Исправленный путь к иконке
            ];
            return caches.open('static-cache').then(cache => {
                return cache.addAll(urlsToCache);
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

// Обработка push-событий
self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "Новое уведомление";
    const options = {
        body: data.message || "У вас новое уведомление!",
        icon: '/static/media/logo192.png',  // Исправленный путь к иконке для уведомления
        badge: '/static/media/logo512.png',  // Используем логотип для значка уведомления
        data: { url: data.url || '/' }       // URL для перехода при клике
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
