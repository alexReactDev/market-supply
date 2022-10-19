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
	}, 1000 * 60 * 60); // 1 hour
	
	setInterval(async () => {
		try {
			await deleteExpiredOrdersAndConfirmationLinks();
		}
		catch(e) {
			console.log("Maintenance error: Failed to delete expired orders and confirmation links")
		}
	}, 1000 * 60 * 60) // 1 hour
}

module.exports = maintenance;