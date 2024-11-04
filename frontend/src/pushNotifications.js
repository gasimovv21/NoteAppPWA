// Замените VAPID_PUBLIC_KEY на ваш новый ключ
const VAPID_PUBLIC_KEY = "BEjZrzG9pAo8KI1mt1fl0fZUYkL6cezhYhulAgisHa-zfrt1qNqYvSfqtHAWYGGY9wiT8ZUwhkIIHImstVuOmY4";

export function subscribeUser() {
    if ('Notification' in window && navigator.serviceWorker) {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    subscribe();
                } else {
                    alert('Уведомления отклонены. Разрешите уведомления в настройках, чтобы получать их.');
                }
            });
        } else if (Notification.permission === 'granted') {
            subscribe();
        } else if (Notification.permission === 'denied') {
            alert('Уведомления заблокированы. Измените настройки сайта, чтобы разрешить их.');
        }
    }
}

function subscribe() {
    navigator.serviceWorker.ready.then(function(registration) {
        const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
        registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        }).then(function(subscription) {
            console.log('User is subscribed:', subscription);
            // Отправка подписки на сервер
        }).catch(function(err) {
            console.error('Failed to subscribe the user: ', err);
        });
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default subscribeUser;
