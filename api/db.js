const Pool = require("pg").Pool;
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({path: path.join(__dirname, ".env")});

const db = new Pool({
	user: "postgres",
	host: "localhost",
	port: 5400,
	password: process.env.DB_PASSWORD,
	database: "market_supply"
});

module.exports = db;