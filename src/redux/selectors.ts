import { AppState } from ".";
import { IProduct } from "./reducer/products";

export const cart = (state: AppState) => state.cart;
export const cartTotal = (state: AppState) => cart(state).total;
export const cartProductsSelector = (state: AppState) => cart(state).products;

export const categoriesSelector = (state: AppState) => state.categories;

export const initialized = (state: AppState) => state.initialized;

export const productsSelector = (state: AppState) => state.products;
export const productsDetailsSelector = (state: AppState) => state.productsDetails;
export const productsReviewsSelector = (state: AppState) => state.productsReviews;

export const URLPathSelector = (state: AppState) => state.router.location.pathname;

export const URLPathEndSelector = (state: AppState) => {
	const url = URLPathSelector(state);
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

export interface IProductWithProps extends IProduct {
	amount: number,
	total: number
}

export const cartProductsWithPropsSelector = (state: AppState) => {

	const cartProducts = cartProductsSelector(state);
	const cartProductsWithProps = [];

	for (let key in cartProducts) {
		cartProductsWithProps.push({
			...productsSelector(state)[key],
			amount: cartProducts[key],
			//@ts-ignore
			total: productsSelector(state)[key].price * cartProducts[key]
		})
	}

	return cartProductsWithProps;
}