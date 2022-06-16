const db = require("../db");

class CategoriesController {
	async getSubCategoryData(req, res) {
		const reqCategory = req.params.category;
		const reqSubCategory = req.params.subcategory;
		const page = +req.query.page || 1;
		const sort = req.query.sort || "default";
	
		const category = (await db.query("SELECT * FROM categories where url_name = $1;", [reqCategory])).rows[0];

		if(!category) res.sendStatus(404);

		const subcategory = (await db.query("SELECT * FROM subcategories where url_name = $1 and category_id = $2;", [reqSubCategory, category.id])).rows[0];

		if(!subcategory) res.sendStatus(404);

		let subcategoryItemsIds = (await db.query("SELECT product_id FROM items_of_subcategories where subcategory_id = $1;", [subcategory.id])).rows.map((item) => item.product_id);
		const products = (await db.query("SELECT * FROM products;")).rows;
		const subcategoryItems = products.filter((product) => subcategoryItemsIds.includes(product.id));

		/*
		const subcategoryItemsIds = (await db.query("SELECT product_id FROM items_of_subcategories where subcategory_id = $1;", [subcategory.id])).rows;

		const subcategoryItems = [];

		for(let i = 0; i < subcategoryItemsIds.length; i++) {
			const product = (await db.query("SELECT * FROM products where id = $1;", [subcategoryItemsIds[i].product_id])).rows[0];
			subcategoryItems.push(product);
		}
		*/

		let sortedSubcategoryItems;

		switch(sort) {
			case "low-price":
				sortedSubcategoryItems = subcategoryItems.sort((productA, productB) => productA.price - productB.price);
			break;
			case "high-price":
				sortedSubcategoryItems = subcategoryItems.sort((productA, productB) => productB.price - productA.price);
			break;
			case "low-rate":
				sortedSubcategoryItems = subcategoryItems.sort((productA, productB) => productA.rate - productB.rate);
			break;
			case "high-rate":
				sortedSubcategoryItems = subcategoryItems.sort((productA, productB) => productB.rate - productA.rate);
			break;
			case "alphabet":
				sortedSubcategoryItems = subcategoryItems.sort((productA, productB) => productA.name.localeCompare(productB.name, "en", {sensitivity: "accent"}));
			break;
			default:
				sortedSubcategoryItems = subcategoryItems;
		}

		const pageLength = process.env.PAGE_LENGTH;
		const sortedSubcategoryItemsIds = sortedSubcategoryItems.map((product) => product.id);
		const totalPages = Math.ceil(sortedSubcategoryItems.length / pageLength);
		const data = sortedSubcategoryItemsIds.slice(pageLength * page - pageLength, pageLength * page);

		res.send({
			page,
			sort,
			totalPages,
			data
		});
	}

	async getCategoryData(req, res) {
		const requestedCategory = req.params.category;

		const cat = (await db.query("SELECT * FROM categories where url_name = $1;", [requestedCategory])).rows[0];

		if(!cat) res.sendStatus(404);

		const catContent = (await db.query("SELECT * FROM subcategories where category_id = $1;", [cat.id])).rows;

		res.send(catContent);
	}

	async getCategoriesList(req, res) {
		const categories = (await db.query("SELECT * FROM categories;")).rows;
	
		res.send(categories);
	}
}

module.exports = new CategoriesController();