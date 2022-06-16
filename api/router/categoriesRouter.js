const Router = require("express").Router;
const {getCategoryData, getCategoriesList, getSubCategoryData} = require("../controller/categoriesController");

const router = new Router();

router.get("/", getCategoriesList);
router.get("/:category", getCategoryData);
router.get("/:category/:subcategory", getSubCategoryData);

module.exports = router;