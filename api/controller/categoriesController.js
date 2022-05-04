const fixtures = require("../fixtures3.1.json");

class CategoriesController {
	getCategoryData(req, res, next) {
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
	
	}

	getCategoriesList(req, res) {
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
	}
}

module.exports = new CategoriesController();