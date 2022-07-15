const express = require("express");
const path = require("path");
const cors = require("cors");
const router = require("./router");
const dotenv = require('dotenv');
const cookie = require("cookie-parser");
const { deleteExpiredTemporaryUsers } = require("./controller/userController");
const { deleteExpiredOrdersAndConfirmationLinks } = require("./controller/ordersController");

dotenv.config({
	path: path.join(__dirname, '.env')
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookie());
app.use(express.static(path.join(__dirname, "/public")));

app.use("/api", router);

app.get("*", (req, res) => {
	res.status(404).send();
})

app.listen(4500, () => console.log("Server started on port 4500"));

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