const fs = require("fs/promises");
const path = require("path");

async function loggerMiddleware(req, res, next) {
	const newLogData = `${new Date().toString()} REQ ${req.method}:${req.path} \n`;
	let logData = "";

	try {
		logData = await fs.readFile(path.join(process.env.LOGS_OUTPUT_PATH, "connections.log"));
	}
	catch(e) {
		console.log("No connections log file found");
		console.log(e);
	}

	try {
		await fs.writeFile(path.join(process.env.LOGS_OUTPUT_PATH, "connections.log"), newLogData + logData);
	}
	catch(e) {
		console.log("Failed to write connections log file");
		throw e;
	}

	next();
}

module.exports = loggerMiddleware;