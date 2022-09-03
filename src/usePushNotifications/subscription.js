const pushServerPublicKey = process.env.REACT_APP_NOTIFICATIONS_KEY;

/**
 * using the registered service worker 
 * creates a push notification subscription and returns it
 */
export async function createNotificationSubscription() {
    // wait for service worker installation to be ready
    const serviceWorker = await navigator.serviceWorker.ready;

    return await serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: pushServerPublicKey
    });
}

/**
 * returns the subscription if present or nothing
 */
export async function getNotificationSubscription() {
    const serviceWorker = await navigator.serviceWorker.ready;
    return serviceWorker.pushManager.getSubscription()
}

/**
 * Unsubscribe.
 * It could happen (but it shouldn't) that a previous subscription saved in the browser has outdated keys
 * In that case, simply unsubscribe, then retry to get the subscription
 */
export async function unsubscribeNotification() { 
    try {
        const sub = await getNotificationSubscription();

        return await sub.unsubscribe(); // return true | false
    } catch (err) {
        console.error('Error while unsubscribing', err);
        throw err;
    }
}
