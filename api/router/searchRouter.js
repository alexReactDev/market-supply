const Router = require("express").Router;
const { productsSearch } = require("../controller/searchController");

const router = new Router();

router.get("/:search", productsSearch);

module.exports = router;