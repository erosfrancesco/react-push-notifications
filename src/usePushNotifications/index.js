import { useState, useEffect } from "react";
import { subscribeTo, sendNotificationTo } from "./notifications.api"; 

import {
	isPushNotificationSupported,
	askUserPermission,
	registerServiceWorker
} from "./utils";

import {
	createNotificationSubscription, 
	getNotificationSubscription, 
	unsubscribeNotification
} from './subscription';


//first thing to do: check if the push notifications are supported by the browser
const pushNotificationSupported = isPushNotificationSupported();

export default function usePushNotifications() {

	// Notification.permission return the current state of the permission
	const [userConsent, setSuserConsent] = useState(Notification.permission);
	const [userSubscription, setUserSubscription] = useState(null);
	const [pushServerSubscriptionId, setPushServerSubscriptionId] = useState();
	
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	
	//topic
	const [topic] = useState('testTopic');

  	useEffect(() => {
		if (!pushNotificationSupported) {
			return
		}

		if (loading) {
			return;
		}

		setLoading(true);
		setError(false);

		const initSubscription = async () => {
			await registerServiceWorker(); // registers the service worker
			const sub = await getNotificationSubscription(); // retrieve, if there's any, the subscription

			setUserSubscription(sub);
			setLoading(false);
		};

		initSubscription();

	// eslint-disable-next-line
	}, []);

	// this use effect runs only in the first render

	/**
	 * define a click handler that asks the user permission,
	 * it uses the setSuserConsent state, to set the consent of the user
	 * If the user denies the consent, an error is created with the setError hook
	 */
	const onClickAskUserPermission = () => {
		setLoading(true);
		setError(false);

		askUserPermission()
		.then(consent => {
			setLoading(false);
			setSuserConsent(consent);

			if (consent !== "granted") {
				setError({
					name: "Consent denied",
					message: "You denied the consent to receive notifications",
					code: 0
				});
			}
		});
	};
	//

	/**
	 * define a click handler that creates a push notification subscription.
	 * Once the subscription is created, it uses the setUserSubscription hook
	 */
	const onClickSubscribeToPushNotification = () => {
		setLoading(true);
		setError(false);
		createNotificationSubscription()
		.then(subscrition => {
			setUserSubscription(subscrition);
			setLoading(false);
		})
		.catch(err => {
			console.error("Couldn't create the notification subscription", 
				err, 
				"name:", err.name, 
				"message:", err.message, 
				"code:", err.code
			);

			setError(err);
			setLoading(false);
		});
	};

	/**
	 * define a click handler that sends the push susbcribtion to the push server.
	 * Once the subscription ics created on the server, it saves the id using the hook setPushServerSubscriptionId
	 */
	const onClickSendSubscriptionToPushServer = () => {
		setLoading(true);
		setError(false);

		subscribeTo(userSubscription, topic)
		.then(response => {
			setPushServerSubscriptionId(response.id);
			setLoading(false);
		})
		.catch(err => {
			setLoading(false);
			setError(err);
		});
	};

	/**
	 * define a click handler that request the push server to send a notification, passing the id of the saved subscription
	 */
	const onClickSendNotification = async () => {
		setLoading(true);
		setError(false);

		// notification content
		const content = {
			title: 'Test push', 
			text: 'This is a dummy notification push.' 
		};
		//

		sendNotificationTo(topic, content)
			.then(() => setLoading(false))
			.catch(err => {
				console.error('Error sending notification: ', err);
				setLoading(false);
				setError(err);
			});
	};

	/**
	 * 
	 */
	const onClickUnsubscribe = async () => {
		setLoading(true);
		setError(false);

		return unsubscribeNotification()
			.then(() => {
				setUserSubscription(null);
				setPushServerSubscriptionId(null);
			})
			.catch(setError)
			.finally(() => setLoading(false));
	}

	/**
	 * returns all the stuff needed by a Component
	 */
	return {
		// hooks
		onClickAskUserPermission,
		onClickSubscribeToPushNotification,
		onClickSendSubscriptionToPushServer,
		onClickSendNotification,
		onClickUnsubscribe,
		//

		// state
		userConsent,
		pushNotificationSupported,
		userSubscription,
		pushServerSubscriptionId,
		topic,
		error,
		loading
	};
}