const webpush = require("web-push");
const db = require('./db.js');

//
const vapidKeys = {
	publicKey: process.env.VAPID_PUBLIC,
	privateKey: process.env.VAPID_PRIVATE
}
webpush.setVapidDetails('mailto:example@yourdomain.org', vapidKeys.publicKey, vapidKeys.privateKey);
//

// HELPERS
const sendNotification = (pushSubscription, message) => {
	const {
		title = '',
		text = '',
		image = '',
		url = ''
	} = message;

  	return webpush.sendNotification(
		pushSubscription,
		JSON.stringify({
			title,
			text,
			image,
			url
		})
  	)
}
//

//
function handlePushNotificationSubscription(req, res) {
	const { topic } = req.params;
	const subscriptionRequest = req.body;

	const id = db.save(topic, subscriptionRequest);
	res.status(201).json({ id });
}

function sendPushNotification(req, res) {
	const { topic } = req.params;
	const message = req.body;
	const subscriptions = db.getTopic(topic);
	const promises = [];

	subscriptions.forEach((sub) => {
		// console.log('Hello sub', sub, subscriptions) // test
		const promise = sendNotification(sub, message);
		promises.push(promise)
	});
	Promise.all(promises)
	.then(() => {
		res.status(202).json({})
	})
	.catch(error => {
		console.error(error);
		const { statusCode } = error;
		res.status(statusCode || 500).json({});
	});
}

module.exports = { handlePushNotificationSubscription, sendPushNotification };
