# React Push Notification

Provide hooks to manage [PushSubscription](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)

A small [server](/server) provides endpoints to subscribe and push notifications

## Set up working demo
1: npm install on both base directory and server directory
2: generate VAPID keys. You can use "generateKeys" npm script on server directory
3: set .env files on both directories with the VAPID keys generated. See [env.example](/env.example) for an example

After setting up the demo, you can run "start" npm script on both directory
