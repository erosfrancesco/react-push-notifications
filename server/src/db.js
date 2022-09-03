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
    const { endpoint, keys } = JSON.parse(Object.keys(subscriptionRequest)[0]);
    /**
        {
            "endpoint":"...",
            "expirationTime":null,
            "keys":{
                "p256dh":"...",
                "auth":"..."
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