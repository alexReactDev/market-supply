const express = require("express");

const authorizationRouter = require("./authorizationRouter");
const cartRouter = require("./cartRouter");
const wishlistRouter = require("./wishlistRouter");
const userRouter = require("./userRouter");
const categoriesRouter = require("./categoriesRouter");
const productsRouter = require("./productsRouter");
const newsletterRouter = require("./newsletterRouter");
const ordersRouter = require("./ordersRouter");
const preferencesRouter = require("./preferencesRouter");
const searchRouter = require("./searchRouter");

const router = new express.Router();

router.use("/", authorizationRouter);
router.use("/cart", cartRouter);
router.use("/wishlist", wishlistRouter);
router.use("/user", userRouter);
router.use("/categories", categoriesRouter);
router.use("/product", productsRouter);
router.use("/newsletter", newsletterRouter);
router.use("/orders", ordersRouter);
router.use("/preferences", preferencesRouter);
router.use("/search", searchRouter);

module.exports = router;