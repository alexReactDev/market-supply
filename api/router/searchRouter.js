const Router = require("express").Router;
const { productsSearch } = require("../controller/searchController");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.get("/", authMiddleware(true), productsSearch);

module.exports = router;