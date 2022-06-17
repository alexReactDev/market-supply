const Router = require("express").Router;
const {getCategoryData, getCategoriesList, getSubCategoryData} = require("../controller/categoriesController");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.get("/", authMiddleware(true), getCategoriesList);
router.get("/:category", authMiddleware(true), getCategoryData);
router.get("/:category/:subcategory", authMiddleware(true), getSubCategoryData);

module.exports = router;