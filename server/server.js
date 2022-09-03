require('dotenv').config()
const app = require("./src/routes");

const port = process.env.PORT || 8080;
const host = process.env.HOSTNAME || "0.0.0.0";

// Launch Node.js server
app.listen(port, () => {
    console.log(`Server is listening on http://${host}:${port}/`);
});

// Exit
function handleExit(err) {
	if (err) {
		console.error(err);
	}

	process.exit();
}

process.on("exit", handleExit.bind(null));
process.on("SIGINT", handleExit.bind(null));
process.on("SIGTERM", handleExit.bind(null));
process.on("uncaughtException", handleExit.bind(null));
