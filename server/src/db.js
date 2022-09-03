const crypto = require("crypto");

// DB MOCK
const topics = {};

// HELPERS
function createHash(input) {
	const md5sum = crypto.createHash("md5");
	md5sum.update(Buffer.from(input));
	return md5sum.digest("hex");
}

//
const save = (topic, subscriptionRequest) => {
    console.log('Subscribing', Object.keys(subscriptionRequest)[0]);

    const { endpoint, keys } = JSON.parse(Object.keys(subscriptionRequest)[0]);
    /**
        {
            "endpoint":"https://fcm.googleapis.com/fcm/send/cFNrQHor9p8:APA91bFrSd6qZY8eJ7wkBcQ2uPx379aeLynKWZGQFfF6LHbgvWHH6lLcpPt6dOWn6td7QVYLf12OK_UggQ4LiGNVwo0UpGBBMoHh2nb_LE2DmlNtH7TrCqmjjlbkNzUJIuE8VZgJfOyl",
            "expirationTime":null,
            "keys":{
                "p256dh":"BBWA_7hpfs4adTADA-1RSKBUWpOLnaNmBcRbX2t6BAeqaMcgLtGYBolWxg4cTU4IgAVeF8Xlmsny8i949tMs3RM",
                "auth":"ercAzTPOgQjOXRVlaeqZIA"
            }
        }
     */
	const id = createHash(JSON.stringify({ endpoint, keys }));
	topics[topic] = topics[topic] || {}
	topics[topic][id] = { endpoint, keys };

    return id;
}

const getTopic = (topic) => {
	return Object.values(topics[topic] || {});
}

module.exports = { save, getTopic };