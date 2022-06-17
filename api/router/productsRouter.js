const Router = require("express").Router;
const { getProductDetails } = require("../controller/productDetailsController");
const { getProductReviews, addReviewToProduct } = require("../controller/productReviewsController");
const { getProduct } = require("../controller/productsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.get("/:id", authMiddleware(true), getProduct);
router.get("/reviews/:id", authMiddleware(true), getProductReviews);
router.post("/reviews/:id", authMiddleware(true), addReviewToProduct);
router.get("/details/:id", authMiddleware(true), getProductDetails);

module.exports = router;