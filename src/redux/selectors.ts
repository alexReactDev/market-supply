import { AppState } from ".";

export const cart = (state: AppState) => state.cart;
export const cartTotal = (state: AppState) => cart(state).total;

export const categories = (state: AppState) => state.categories;

export const initialized = (state: AppState) => state.initialized;


export const URLPath = (state: AppState) => state.router.location.pathname;

export const URLPathEnd = (state: AppState) => {
	const url = URLPath(state);
	const cleanUrl = url.endsWith("/") ? url.slice(0, url.length - 1) : url;
	const urlEnd = cleanUrl.slice(cleanUrl.lastIndexOf("/") + 1);

	return urlEnd;
}