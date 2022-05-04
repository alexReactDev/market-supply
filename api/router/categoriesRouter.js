const Router = require("express").Router;
const {getCategoryData, getCategoriesList} = require("../controller/categoriesController");

const router = new Router();

router.get("/", getCategoriesList);
router.get("/:category", getCategoryData);

module.exports = router;