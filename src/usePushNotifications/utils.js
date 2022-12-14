/**
 * checks if Push notification and service workers are supported by your browser
 */
export function isPushNotificationSupported() {
    return "serviceWorker" in navigator && "PushManager" in window;
}

/**
 * asks user consent to receive push notifications and returns the response of the user, one of granted, default, denied
 */
export async function askUserPermission() {
    return await Notification.requestPermission();
}

/**
 * shows a notification
 */
export function sendNotification() {
    const img = "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg";
    const text = "Take a look at this brand new t-shirt!";
    const title = "New Product Available";
    const options = {
        body: text,
        icon: "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg",
        vibrate: [200, 100, 200],
        tag: "new-product",
        image: img,
        badge: "https://spyna.it/icons/android-icon-192x192.png",
        actions: [{ action: "Detail", title: "View", icon: "https://via.placeholder.com/128/ff0000" }]
    };
    navigator.serviceWorker.ready.then(function(serviceWorker) {
        serviceWorker.showNotification(title, options);
    });
}

/**
 *
 */
export function registerServiceWorker() {
    return navigator.serviceWorker.register("/sw-notifications.js");
}