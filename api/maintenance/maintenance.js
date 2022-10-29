const fs = require("fs/promises");
const path = require("path");
const { deleteExpiredTemporaryUsers } = require("../controller/userController");
const { deleteExpiredOrdersAndConfirmationLinks } = require("../controller/ordersController");

function maintenance() {
	setInterval(async () => {
		try {
			await deleteExpiredTemporaryUsers();
		}
		catch(e) {
			console.log("Maintenance error: Failed to delete expired temporary users");
		}
	}, +process.env.EXPIRED_USERS_CLEAN_TIME); // 1 hour
	
	setInterval(async () => {
		try {
			await deleteExpiredOrdersAndConfirmationLinks();
		}
		catch(e) {
			console.log("Maintenance error: Failed to delete expired orders and confirmation links")
		}
	}, +process.env.EXPIRED_CONFIRMATION_LINKS_CLEAN_TIME) // 1 hour

	setInterval(() => {
		try {
			fs.truncate(path.join(process.cwd(), "_log", "error.log"), +process.env.MAX_LOGFILE_SIZE);
		}
		catch(e) {
			throw new Error(`Failed to clear error log!\n${e}`);
		}
	}, +process.env.LOGFILE_CLEAN_TIME);
}

module.exports = maintenance;