const express = require("express");
const fixtures = require("../fixtures3.1.json");
fixtures.productReviews = {};

const router = new express.Router();

router.get("/categories", (req, res) => {

	const initialCategories = fixtures.categories;
	const categories = [];

	for (let cat in initialCategories) {
		const { URLName, name, isPublic } = initialCategories[cat];

		categories.push({
			URLName,
			name,
			isPublic
		})
	}

	res.send(categories);
})

router.get("/categories/:category", (req, res, next) => {

	const reqCategory = req.params.category;
	const page = +req.query.page || 1;
	const sort = req.query.sort || "default";

	if(!fixtures.categories[reqCategory]) next();

	const category = fixtures.categories[reqCategory];
	const initialCategoryProducts = category.products;
	const products = fixtures.products;
	let categoryProducts;

	switch(sort) {
		case "low-price":
			categoryProducts = initialCategoryProducts.concat().sort((a, b) => products[a].price - products[b].price);
		break;
		case "high-price":
			categoryProducts = initialCategoryProducts.concat().sort((a, b) => products[b].price - products[a].price);
		break;
		case "low-rate":
			categoryProducts = initialCategoryProducts.concat().sort((a, b) => products[a].rate - products[b].rate);
		break;
		case "high-rate":
			categoryProducts = initialCategoryProducts.concat().sort((a, b) => products[b].rate - products[a].rate);
		break;
		case "alphabet":
			categoryProducts = initialCategoryProducts.concat().sort((a, b) => products[a].name.localeCompare(products[b].name, "en", {sensitivity: "accent"}));
		break;
		default:
			categoryProducts = initialCategoryProducts;
	}
	
	const pageLength = process.env.PAGE_LENGTH;
	const totalPages = Math.ceil(categoryProducts.length / pageLength);
	const data = categoryProducts.slice(pageLength * page - pageLength, pageLength * page);

	res.send({
		page,
		totalPages,
		sort,
		data,
	});

});

router.get("/product/:id", (req, res, next) => {
	const id = req.params.id;

	if(fixtures.products[id]) {
		res.send(fixtures.products[id]);
	}

	next();
})

router.get("/product-reviews/:id", (req, res) => {

	const id = req.params.id;

	if(fixtures.productReviews[id]) {
		res.send(fixtures.productReviews[id])
	}
	else {
		res.send(fixtures.reviews);
	}
})

router.post("/product-reviews/:id", (req, res) => { //res.status(500).send();
	const id = req.params.id;

	const {email, ...review} = req.body.review;

	fixtures.productReviews[id] ? fixtures.productReviews[id].push(review) : fixtures.productReviews[id] = [review, ...fixtures.reviews];
	res.send(review);
})

router.get("/product-details/:id", (req, res) => {
	res.send(fixtures.details);
})

router.get("/cart", (req, res) => {
	res.send(fixtures.cart);
})

router.post("/newsletter", (req, res) => {
	console.log(`Newsletter subscription request: ${req.body.email}`);
	res.status(202).send();
})

module.exports = router;