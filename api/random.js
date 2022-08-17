const subcategories_count = 6;
const products_per_subcategory = 50;
const reviews_per_product = 3;
const orders_per_user = 40;

const Pool = require("pg").Pool;
const dotenv = require("dotenv");
const uuid = require("uuid");
const lodash = require("lodash");
const bcrypt = require("bcrypt");

dotenv.config();

const db = new Pool({
	user: "postgres",
	host: "localhost",
	port: 5400,
	password: process.env.DB_PASSWORD,
	database: "market_supply"
});

const words = "Veggies es bonus vobis proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic Gumbo beet greens corn soko endive gumbo gourd Parsley shallot courgette tatsoi pea sprouts fava beancollard greens dandelion okra wakame tomato Dandelioncucumber earthnut pea peanut soko zucchini quorum participes solo hoc sermone utuntur sedes Latinae interretiales multiplicantur ac conventus internationales iam plus viginti annos undis radiophonicis nuntios emittere pergit".split(" ");
const names = "Alex Lucy John Dylan Damien Eli Gordon Joe Donald Margaret Eliza".split(" ");
const texts = ["Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic.", "Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava beancollard greens dandelion okra wakame tomato.", "Hungaria, quae minor in regnis Europae erat, usque ad 1844 multarum civitatum regni eiusque conservativismi causa in legislatione in diaetis Latino sermone utebantur.", "Lorem ispum dolor sit amet in hoc sermone scripta sunt", "Lingua Latina temporibus Neolatinis plura Europae regna non utuntur, nisi in rebus Ecclesiae operibusque scientiae."];

async function createCategories() {
	await db.query("INSERT INTO categories (name, url_name) values('Clothing', 'clothing');");
	await db.query("INSERT INTO categories (name, url_name) values('Electronics', 'electronics');");
	await db.query("INSERT INTO categories (name, url_name) values('Shoes', 'shoes');");
	await db.query("INSERT INTO categories (name, url_name) values('Watches', 'watches');");
	await db.query("INSERT INTO categories (name, url_name) values('Jewelry', 'jewelry');");
	await db.query("INSERT INTO categories (name, url_name) values('Health and Beauty', 'health-and-beauty');");
	await db.query("INSERT INTO categories (name, url_name) values('Kids and Babies', 'kids-and-babies');");
	await db.query("INSERT INTO categories (name, url_name) values('Sport', 'sport');");
	await db.query("INSERT INTO categories (name, url_name) values('Home and Garden', 'home-and-garden');");
}

async function createSubcategories() {
	const categories = (await db.query("SELECT * FROM categories;")).rows;
	
	for (let i = 0; i < categories.length; i++) {
		for(let j = 1; j <= subcategories_count; j++) {
			const name = `Subcategory ${j}`;
			const URLName = `subcategory-${j}`;
			const cat = categories[i].id;

			await db.query("INSERT INTO subcategories (name, url_name, category_id) values($1, $2, $3);", [name, URLName, cat]);
		}
	}
}

async function createCollections() {
	await db.query("INSERT INTO collections (name, url_name) values('New', 'new');");
	await db.query("INSERT INTO collections (name, url_name) values('Hot Deal', 'hot-deal');");
	await db.query("INSERT INTO collections (name, url_name) values('Special Deal', 'special-deal');");
	await db.query("INSERT INTO collections (name, url_name) values('Featured', 'featured');");
	await db.query("INSERT INTO collections (name, url_name) values('Latest', 'latest');");
}

async function createOutlets() {
	await db.query("INSERT INTO outlets (address, schedule, phone) values($1, $2, $3);",
	['123 Main Road, New York, NY 1234', '9:00-23:00 mon-sun', "+ 1 (987) 654 321"]);
	await db.query("INSERT INTO outlets (address, schedule, phone) values($1, $2, $3);",
	['1 Second Road, New York, NY 4321', '9:00-23:00 mon-sun', "+ 1 (321) 987 654"]);
	await db.query("INSERT INTO outlets (address, schedule, phone) values($1, $2, $3);",
	['12 Small Road, New York, NY 8121', '9:00-23:00 mon-sun', "+ 1 (321) 987 654"]);
}

async function createProduct(catURL) {
	const id = uuid.v4();
	let webId;

	while(true) {
		webId = lodash.random(100000, 999999);
		const taken = (await db.query("SELECT * FROM products where web_id = $1;", [webId])).rows;

		if(taken.length === 0) break;
	}

	const name = words[lodash.random(words.length - 1)] + " " + words[lodash.random(words.length - 1)];
	const price = lodash.random(2.00, 500.00);
	const oldPrice = lodash.random(1) ? lodash.random(price, 500.00) : null;
	let rate = lodash.random(1, 5);
	if(rate < 4 && lodash.random(0, 1) === 1) rate = lodash.random(3, 5);
	let isNew = lodash.random(1) ? true : false;

	if(isNew) isNew = lodash.random(1) ? false : true;

	const picture = `/images/${catURL}/${lodash.random(1, 20)}.webp`;

	const product = (await db.query("INSERT INTO products (id, web_id, name, price, old_price, rate, is_new) values($1, $2, $3, $4, $5, $6, $7) RETURNING *;", [id, webId, name, price, oldPrice, rate, isNew])).rows[0];

	await db.query("INSERT INTO products_pictures (product_id, picture) values($1, $2);", [product.id, picture]);

	for (let i = 2; i < 8; i++) {
		await db.query("INSERT INTO products_pictures (product_id, picture) values($1, $2);", [product.id, `/images/products/${i}.png`]);
	}

	if(isNew) {
		await db.query("INSERT INTO items_of_collections (collection_id, product_id) values($1, $2);", [1, id]);
	}

	return product;
}

async function createProductReview(productId) {
	const title = names[lodash.random(names.length - 1)];
	const rate = lodash.random(1, 5);
	const text = texts[lodash.random(texts.length - 1)];
	const timestamp = lodash.random(1465377155000, 1654679594000);

	const review = (await db.query("INSERT INTO products_reviews (title, text, rate, timestamp, product_id) values($1, $2, $3, $4, $5);", [title, text, rate, timestamp, productId])).rows[0];

	return review;
}

async function createProductDetails(productId) {
	const description = `El primer ejemplar identificado medía 4,6 metros de longitud y fue arponeado y capturado
	en las costas de Table Bay, Sudáfrica, en 1828. El espécimen fue vendido por 6 £, y su holotipo
	se muestra en el Museo de Historia Natural de París.4​ La primera cita científica fue dada al año 
	siguiente por Andrew Smith, un médico militar vinculado al ejército británico, que se encontraba 
	estacionado en Ciudad del Cabo. En 1849 publicó una descripción más detallada de la especie. Se 
	le asignó el nombre de "tiburón ballena" debido a la fisiología del pez, ya que se trata de un 
	tiburón pero posee un tamaño comparable al de una ballena. En la religión vietnamita se le venera
	 como a una deidad, y se le llama "Ca Ong", que significa literalmente "Señor Pez". También 
	recibe el nombre de pez dominó, dámero, o pez dama, por el clásico juego de mesa. 
	`;

	const productDetails = (await db.query("INSERT INTO products_details (description, product_id) values($1, $2);", [description, productId])).rows[0];

	return productDetails;
}

async function createTestUser() {
	const id = uuid.v4();
	const name = "John";
	const surname = "Doe";
	const email = "example@gmail.com";
	const phone = "+ 1 234 567 890";
	const town = "New York";
	const street = "Explorer's street";
	const house = "123";
	const apartment = null;
	const zip = "54321";

	const user = (await db.query("INSERT INTO users (id, name, surname, email, phone, town, street, house, apartment, zip) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;", 
	[id, name, surname, email, phone, town, street, house, apartment, zip])).rows[0];
	
	const password = await bcrypt.hash("123", 3);

	await db.query("INSERT INTO users_passwords (user_id, password) values($1, $2);", [user.id, password]);

	const userPersonId = (await db.query("INSERT INTO persons (user_id) values($1) RETURNING id;", [user.id])).rows[0].id;

	const products = (await db.query("SELECT * FROM products;")).rows;

	await db.query("INSERT INTO cart_products (person_id, product_id, amount) values($1, $2, $3);", [userPersonId, products[0].id, lodash.random(1, 3)]);
	await db.query("INSERT INTO cart_products (person_id, product_id, amount) values($1, $2, $3);", [userPersonId, products[1].id, lodash.random(1, 3)]);

	await db.query("INSERT INTO wishlist_products (person_id, product_id) values($1, $2);", [userPersonId, products[3].id]);
	await db.query("INSERT INTO wishlist_products (person_id, product_id) values($1, $2);", [userPersonId, products[4].id]);
	await db.query("INSERT INTO wishlist_products (person_id, product_id) values($1, $2);", [userPersonId, products[5].id]);

	await db.query("INSERT INTO users_preferences (person_id, auto_fill, currency) values($1, $2, $3);", [userPersonId, true, "USD"]);

	for(let i = 0; i < orders_per_user; i++) {
		const user_id = user.id;
		const product_id = products[i].id;
		const amount = lodash.random(1, 3);
		const total = products[i].price * amount;
		const deliveryMethod = lodash.random(1) ? "delivery" : "pickup";
		const paymentMethod = lodash.random(1) ? "online" : "onRecieve";

		await db.query("INSERT INTO users_orders (user_id, product_id, amount, total, delivery_method, payment_method) values($1, $2, $3, $4, $5, $6);",
		[user_id, product_id, amount, total, deliveryMethod, paymentMethod]);
	}
}

async function config() {
	await createCategories();
	await createSubcategories();
	await createCollections();
	await createOutlets();

	const categories = (await db.query("SELECT * FROM categories;")).rows;

	for (let i = 0; i < categories.length; i++) {

		const subcategories = (await db.query("SELECT * FROM subcategories where category_id = $1", [categories[i].id])).rows;

		for(let j = 0; j < subcategories.length; j++) {

			for (let k = 0; k < products_per_subcategory; k++) {
				const product = await createProduct(categories[i].url_name);
				await createProductDetails(product.id);
				
				for(let l = 0; l < reviews_per_product; l++) {
					await createProductReview(product.id);
				}

				await db.query("INSERT INTO items_of_subcategories (subcategory_id, product_id) values($1, $2);", [subcategories[j].id, product.id]);

				const collections = (await db.query("SELECT * FROM collections;")).rows;

				if(k < collections.length && k > 0) {
					await db.query("INSERT INTO items_of_collections (collection_id, product_id) values($1, $2);", [collections[k].id, product.id]);
				}
			}
		}
	}

	await createTestUser();
}

(async () => {
	try {
		await config();
		console.log("Config success");
		process.exit();
	}
	catch(e) {
		console.log("Error!");
		console.log(e);
		process.exit();
	}
})();
