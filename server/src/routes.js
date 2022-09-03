const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const cors = require("cors");
const controller = require('./controller')

const app = express();

app.use(cors())
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/subscribe/:topic", controller.handlePushNotificationSubscription);
app.post("/send/:topic", controller.sendPushNotification);

module.exports = app;
