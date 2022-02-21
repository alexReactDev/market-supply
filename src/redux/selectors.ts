import { AppState } from ".";

export const cart = (state: AppState) => state.cart;
export const cartTotal = (state: AppState) => cart(state).total;

export const categoriesSelector = (state: AppState) => state.categories;

export const initialized = (state: AppState) => state.initialized;

export const productsSelector = (state: AppState) => state.products;

export const URLPath = (state: AppState) => state.router.location.pathname;

export const URLPathEnd = (state: AppState) => {
	const url = URLPath(state);
	const cleanUrl = url.endsWith("/") ? url.slice(0, url.length - 1) : url;
	const urlEnd = cleanUrl.slice(cleanUrl.lastIndexOf("/") + 1);

	return urlEnd;
}

export const publicCategoriesKeysSelector = (state: AppState) => {
	const categories = categoriesSelector(state);
	const publicCategoriesKeys = [];

	for(let key in categories) {
		if(categories[key].isPublic) publicCategoriesKeys.push(key);
	}

	return publicCategoriesKeys;
}