CREATE TABLE categories (
	id SERIAL PRIMARY KEY,
	name VARCHAR NOT NULL UNIQUE,
	url_name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE subcategories (
	id SERIAL PRIMARY KEY,
	name VARCHAR NOT NULL,
	url_name VARCHAR NOT NULL,
	category_id INTEGER NOT NULL,
	FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
	UNIQUE (name, category_id),
	UNIQUE (url_name, category_id)
);

CREATE TABLE products (
	id VARCHAR PRIMARY KEY,
	web_id INTEGER NOT NULL,
	name VARCHAR NOT NULL,
	price INTEGER NOT NULL,
	old_price INTEGER,
	rate INTEGER DEFAULT 0 NOT NULL CHECK(rate >= 0 and rate <= 5),
	is_new BOOLEAN NOT NULL
);

CREATE TABLE products_reviews (
	id SERIAL PRIMARY KEY,
	title VARCHAR NOT NULL,
	text VARCHAR,
	rate INTEGER CHECK(rate >= 1 and rate <= 5) NOT NULL,
	timestamp BIGINT NOT NULL,
	product_id VARCHAR NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE products_details (
	description VARCHAR,
	product_id VARCHAR PRIMARY KEY,
	FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE items_of_subcategories (
	id SERIAL PRIMARY KEY,
	subcategory_id INTEGER NOT NULL,
	FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE,
	product_id VARCHAR NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE collections (
	id SERIAL PRIMARY KEY,
	name VARCHAR NOT NULL UNIQUE,
	url_name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE items_of_collections (
	id SERIAL PRIMARY KEY,
	collection_id INTEGER,
	FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
	product_id VARCHAR,
	FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE users (
	id VARCHAR PRIMARY KEY,
	name VARCHAR NOT NULL,
	surname VARCHAR,
	email VARCHAR NOT NULL UNIQUE,
	phone VARCHAR,
	town VARCHAR,
	street VARCHAR,
	house VARCHAR,
	apartment VARCHAR,
	zip VARCHAR
);

CREATE TABLE users_passwords (
	user_id VARCHAR PRIMARY KEY,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	password VARCHAR NOT NULL
);

CREATE TABLE temporary_users (
	id VARCHAR PRIMARY KEY,
	expires BIGINT NOT NULL
);

CREATE TABLE persons (
	id SERIAL PRIMARY KEY,
	user_id VARCHAR,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	temporary_user_id VARCHAR,
	FOREIGN KEY (temporary_user_id) REFERENCES temporary_users(id) ON DELETE CASCADE,
	CHECK((user_id IS NULL and temporary_user_id IS NOT NULL) OR (user_id IS NOT NULL and temporary_user_id IS NULL))
);

CREATE TABLE cart_products (
	id SERIAL PRIMARY KEY,
	person_id INTEGER NOT NULL,
	FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE CASCADE,
	product_id VARCHAR NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
	amount INTEGER NOT NULL DEFAULT 1 CHECK (amount > 0),
	UNIQUE (person_id, product_id)
);

CREATE TABLE wishlist_products (
	id SERIAL PRIMARY KEY,
	person_id INTEGER NOT NULL,
	FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE CASCADE,
	product_id VARCHAR NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
	UNIQUE (person_id, product_id)
);

CREATE TABLE users_preferences (
	person_id INTEGER PRIMARY KEY,
	FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE CASCADE,
	auto_fill BOOLEAN NOT NULL DEFAULT false,
	currency VARCHAR NOT NULL DEFAULT 'USD'
);

CREATE TABLE users_orders (
	id SERIAL PRIMARY KEY,
	user_id VARCHAR NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	product_id VARCHAR NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id),
	amount INTEGER NOT NULL,
	total INTEGER NOT NULL,
	delivery_method VARCHAR NOT NULL,
	payment_method VARCHAR NOT NULL
);

CREATE TABLE orders (
	id SERIAL PRIMARY KEY,
	name VARCHAR NOT NULL,
	surname VARCHAR NOT NULL,
	phone VARCHAR NOT NULL,
	email VARCHAR NOT NULL,
	delivery_method VARCHAR NOT NULL CHECK (delivery_method = 'pickup' or delivery_method = 'delivery'),
	payment_method VARCHAR NOT NULL CHECK (payment_method = 'online' or payment_method = 'onRecieve'),
	total INTEGER NOT NULL,
	confirmed BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE orders_confirmation_link (
	order_id INTEGER PRIMARY KEY NOT NULL,
	FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
	link VARCHAR NOT NULL,
	expires BIGINT NOT NULL
);

CREATE TABLE orders_delivery_data (
	order_id INTEGER PRIMARY KEY NOT NULL,
	FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
	town VARCHAR NOT NULL,
	street VARCHAR NOT NULL,
	house VARCHAR NOT NULL,
	apartment_no VARCHAR,
	zip VARCHAR NOT NULL,
	prefered_date VARCHAR
);

CREATE TABLE orders_products (
	id SERIAL PRIMARY KEY,
	order_id INTEGER NOT NULL,
	FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
	product_id VARCHAR NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id),
	amount INTEGER NOT NULL,
	total INTEGER NOT NULL
);

CREATE TABLE outlets (
	id SERIAL PRIMARY KEY,
	address VARCHAR NOT NULL,
	schedule VARCHAR NOT NULL,
	phone VARCHAR NOT NULL
);

CREATE TABLE orders_pickup_outlet (
	order_id INTEGER NOT NULL,
	FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
	outlet_id INTEGER NOT NULL,
	FOREIGN KEY (outlet_id) REFERENCES outlets(id)
);
 