const express = require("express");
const path = require("path");
const cors = require("cors");
const router = require("./router");
const dotenv = require('dotenv');

dotenv.config({
	path: path.join(__dirname, '.env')
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "/public")));
app.use("/api", router);

app.get("*", (req, res) => {
	res.status(404).send();
})

app.listen(4500, () => console.log("Server started on port 4500"));
