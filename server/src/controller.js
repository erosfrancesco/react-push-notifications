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
  	).catch(err => {
		console.error(err);
	});
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
		const promise = sendNotification(sub, message);
		promises.push(promise)
	});
	Promise.all(promises).catch(console.error); // error managements

  	res.status(202).json({});
}

module.exports = { handlePushNotificationSubscription, sendPushNotification };
