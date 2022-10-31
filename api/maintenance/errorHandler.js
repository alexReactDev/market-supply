const fs = require("fs/promises");
const path = require("path");

async function errorHandler(e) {
	const newLogData = `${new Date().toString()} ${e.name}\n${e.message}\n${e.stack}\n\n`;
	let logData = "";

	try {
		logData = await fs.readFile(path.join(process.cwd(), "log", "error.log"));
	}
	catch(e) {
		console.log("No error log file found");
		console.log(e);
	}

	let writeAttempts = 0;

	writeLog();

	process.exit();

	async function writeLog() {
		try {
			await fs.writeFile(path.join(process.cwd(), "log", "error.log"), newLogData + logData);
		}
		catch(e) {
			if(e.code !== "ENOENT" || writeAttempts > 0) {
				console.log(e);
				process.exit();
			}

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
			console.log(e);
			process.exit();
		}
	}
}

module.exports = errorHandler;