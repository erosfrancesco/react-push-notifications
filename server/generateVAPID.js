// Script to generate VAPID Keys using web-push package
const webPush = require('web-push');

console.log(webPush.generateVAPIDKeys());