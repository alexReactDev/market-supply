const express = require("express");
const fixtures = require("../fixtures2.json");

const router = new express.Router();

router.get("/categories/:category", (req, res, next) => {

	const reqCategory = req.params.category;
	const page = +req.query.page || 1;
	const sort = req.query.sort || "default";

	if(fixtures.categories[reqCategory]) {
		const initialCategory = fixtures.categories[reqCategory];
		const products = fixtures.products;
		let category;

		switch(sort) {
			case "low-price":
				category = initialCategory.concat().sort((a, b) => products[a].price - products[b].price);
			break;
			case "high-price":
				category = initialCategory.concat().sort((a, b) => products[b].price - products[a].price);
			break;
			case "low-rate":
				category = initialCategory.concat().sort((a, b) => products[a].rate - products[b].rate);
			break;
			case "high-rate":
				category = initialCategory.concat().sort((a, b) => products[b].rate - products[a].rate);
			break;
			default:
				category = initialCategory;
		}
		
		const pageLength = process.env.PAGE_LENGTH;
		const totalPages = Math.ceil(category.length / pageLength);
		const data = category.slice(pageLength * page - pageLength, pageLength * page);

		console.log(data);

		res.send({
			page,
			totalPages,
			sort,
			data,
		});
	}

	next();
});

router.get("/product/:id", (req, res, next) => {
	const id = req.params.id;

	if(fixtures.products[id]) {
		res.send(fixtures.products[id]);
	}

	next();
})

router.get("/product-reviews/:id", (req, res) => {
	res.send(fixtures.reviews);
})

router.get("/product-details/:id", (req, res) => {
	res.send(fixtures.details);
})

router.get("/cart", (req, res) => {
	res.send(fixtures.cart);
})

module.exports = router;