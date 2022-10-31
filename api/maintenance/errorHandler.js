const fs = require("fs/promises");
const path = require("path");

async function errorHandler(error) {
	const newLogData = `${new Date().toString()} ${error.name}\n${error.message}\n${error.stack}\n\n`;
	let logData = "";

	try {
		logData = await fs.readFile(path.join(process.env.LOGS_OUTPUT_PATH, "error.log"));
	}
	catch(e) {
		console.log("No error log file found");
		console.log(e);
	}

	try {
		await fs.writeFile(path.join(process.env.LOGS_OUTPUT_PATH, "error.log"), newLogData + logData);
	}
	catch(e) {
		console.log("Failed to write error log file\n" + e);
		console.log("ERROR:\n" + error);
		process.exit();
	}

	process.exit();
}

module.exports = errorHandler;