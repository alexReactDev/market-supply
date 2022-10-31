const fs = require("fs/promises");
const path = require("path");

async function loggerMiddleware(req, res, next) {
	const newLogData = `${new Date().toString()} REQ ${req.method}:${req.path} \n`;
	let logData = "";

	try {
		logData = await fs.readFile(path.join(process.cwd(), "log", "connections.log"));
	}
	catch(e) {
		console.log("No connections log file found");
		console.log(e);
	}

	let writeAttempts = 0;

	writeLog();

	next();

	async function writeLog() {
		try {
			await fs.writeFile(path.join(process.cwd(), "log", "connections.log"), newLogData + logData);
		}
		catch(e) {
			if(e.code !== "ENOENT" || writeAttempts > 0) throw e;
	
			createLogFolder();
			writeLog();
		}
	}

	async function createLogFolder() {
		try {
			await fs.mkdir(path.join(process.cwd(), "log"));
		}
		catch(e) {
			console.log("Failed to create log folder");
			throw e;
		}
	}
}

module.exports = loggerMiddleware;