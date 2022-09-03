import React from "react";
import usePushNotifications from "../usePushNotifications";
import './PushNotification.css';

const Loading = ({ loading }) => (
    loading 
        ? <div className="app-loader">loading...</div> 
        : null
);
const Error = ({ error }) => (
    error ? (
        <section className="app-error">
            <h2>{error.name}</h2>
            <p>Error message : {error.message}</p>
            <p>Error code : {error.code}</p>
        </section>
    ) : null
);

export default function PushNotification() {
    const {
        userConsent,
        pushNotificationSupported,
        userSubscription,
        pushServerSubscriptionId,
        error,
        loading,

        onClickAskUserPermission,
        onClickSubscribeToPushNotification,
        onClickSendSubscriptionToPushServer,
        onClickSendNotification
    } = usePushNotifications();

    const isConsentGranted = userConsent === "granted";
    const arePermissionsAsked = !pushNotificationSupported || isConsentGranted
    const isUserSubscribed = !pushNotificationSupported || !isConsentGranted || userSubscription

    const consentLabel = isConsentGranted ? 'Consent granted' : 'Ask user permission';
    const subscriptionLabel = userSubscription ? 'Push subscription created' : 'Create Notification subscription';
    const approveLabel = pushServerSubscriptionId ? 'Subscription sent to the server' : 'Send subscription to push server'

    return (
        <main>
            <Loading loading={loading} />

            {/** Actions */}
            <section>
                <div className="actions">
                    <button disabled={arePermissionsAsked} 
                            onClick={onClickAskUserPermission}>
                        {consentLabel}
                    </button>

                    <button disabled={isUserSubscribed} 
                            onClick={onClickSubscribeToPushNotification}>
                        {subscriptionLabel}
                    </button>

                    <button disabled={!userSubscription || pushServerSubscriptionId} 
                            onClick={onClickSendSubscriptionToPushServer}>
                        {approveLabel}
                    </button>

                    <button disabled={!pushServerSubscriptionId} 
                            onClick={onClickSendNotification}>
                        Send a notification
                    </button>
                </div>
            </section>

            {/** Info */}
            <section>
                <div className="info">
                    <p>Push notification are {!pushNotificationSupported && "NOT"} supported by your device.</p>
                    <p>User consent to receive push notifications is <strong>{userConsent}</strong>.</p>
                    {pushServerSubscriptionId && <p>The server accepted the push subscrption!</p>}
                    <Error error={error} />
                </div>
            </section>
            
            {/** Notification info 
            <section>
                <div className="info">
                    <p>Your notification subscription details</p>
                    <pre>
                        <code>
                            {
                                JSON.stringify(userSubscription, null, " ")
                            }
                        </code>
                    </pre>
                </div>
            </section>
            {/** */}
        </main>
    );
}