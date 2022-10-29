const fs = require("fs/promises");
const path = require("path");

async function errorHandler(e) {
	const newLogData = `${new Date().toString()} ${e.name}\n${e.message}\n${e.stack}\n\n`;
	let logData = "";

	try {
		logData = await fs.readFile(path.join(process.cwd(), "log", "error.log"));
	}
	catch(e) {
		process.exit();
	}

	try {
		await fs.writeFile(path.join(process.cwd(), "log", "error.log"), newLogData + logData);
	}
	catch(e) {
		process.exit();
	}
	
	console.log(newLogData);

	process.exit();
}

module.exports = errorHandler;