const fs = require("fs/promises");
const path = require("path");

async function loggerMiddleware(req, res, next) {
	const newLogData = `${new Date().toString()} REQ ${req.method}:${req.path} \n`;
	let logData = "";

	try {
		logData = await fs.readFile(path.join(process.cwd(), "_log", "connections.log"));
	}
	catch(e) {

	}

	try {
		await fs.writeFile(path.join(process.cwd(), "_log", "connections.log"), newLogData + logData);
	}
	catch(e) {
		throw e;
	}

	next();
}

module.exports = loggerMiddleware;