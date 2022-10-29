const express = require("express");
const path = require("path");
const cors = require("cors");
const router = require("./router");
const dotenv = require('dotenv');
const cookie = require("cookie-parser");
const maintenance = require("./maintenance/maintenance.js");
const errorHandler = require("./maintenance/errorHandler.js");

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
	return res.sendFile(path.join(__dirname, "public", "index.html"));
})

app.listen(4500, () => console.log("Server started on port 4500"));

maintenance();

process.on("uncaughtException", errorHandler);