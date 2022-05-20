import { AppState } from ".";
import { IProduct } from "./reducer/products";

export const cartSelector = (state: AppState) => state.cart;
export const cartTotal = (state: AppState) => cartSelector(state).total;
export const cartProductsSelector = (state: AppState) => cartSelector(state).products;

export const checkoutSelector = (state: AppState) => state.checkout;
export const checkoutConfirmationDataSelector = (state: AppState) => checkoutSelector(state).confirmationData;

export const wishlistSelector = (state: AppState) => state.whitelist;
export const whitelistProductsSelector = (state: AppState) => state.whitelist.products;

export const categoriesSelector = (state: AppState) => state.categories;

export const initialized = (state: AppState) => state.initialized;

export const generalErrorSelector = (state: AppState) => state.generalError;

export const loggedInSelector = (state: AppState) => state.login.loggedIn;
export const loginErrorSelector = (state: AppState) => state.login.error;
export const loginLoadingSelector = (state: AppState) => state.login.loading;

export const signUpLoadingSelector = (state: AppState) => state.signUp.loading;
export const signUpErrorSelector = (state: AppState) => state.signUp.error;

export const productsSelector = (state: AppState) => state.products;
export const productsDetailsSelector = (state: AppState) => state.productsDetails;
export const productsReviewsSelector = (state: AppState) => state.productsReviews;

export const userDataSelector = (state: AppState) => state.userdata;
export const userIdSelector = (state: AppState) => userDataSelector(state).userId;

export const userOrdersSelector = (state: AppState) => state.userOrders;

export const preferencesSelector = (state: AppState) => state.preferences;

export const URLPathSelector = (state: AppState) => state.router.location.pathname;

export const editProfileDataSelector = (state: AppState) => state.editProfileData;
export const editEmailDataSelector = (state: AppState) => state.editEmailData;
export const editPasswordDataSelector = (state: AppState) => state.editPasswordData;
export const deleteAccountDataSelector = (state: AppState) => state.deleteAccountData;

export const cartAmountSelector = (state: AppState) => Array.from(Object.keys(cartProductsSelector(state))).length;

export const whitelistAmountSelector = (state: AppState) => Array.from(Object.keys(whitelistProductsSelector(state))).length;

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
	if(!cartSelector(state).loaded || cartSelector(state).loading || cartSelector(state).error) return null;

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

export const whitelistProductsWithPropsSelector = (state: AppState) => {

	const whitelistProducts = whitelistProductsSelector(state);
	const whitelistProductsWithProps = whitelistProducts.map((productId) => productsSelector(state)[productId]);

	return whitelistProductsWithProps;
}

export const userOrdersWithProductDataSelector = (state: AppState) => {
	const userOrders = userOrdersSelector(state);
	const products = productsSelector(state); 

	const ordersWithProductData = {
		...userOrders,
		orders: userOrders.orders.map((order) => {
			const {productId, ...orderData} = order;

			return {
				...orderData,
				picture: products[productId].pictures[0],
				name: products[productId].name,
				webId: products[productId].webId
			}
		})
	}

	return ordersWithProductData;
}

export const checkoutConfirmationDataProductsWithPropsSelector = (state: AppState) => {
	const confirmData = checkoutConfirmationDataSelector(state);
	const products = productsSelector(state);

	if(!confirmData) return null;

	return confirmData.products.map(({productId, amount, total}) => ({
		productId,
		amount,
		total,
		img: products[productId].pictures[0],
		name: products[productId].name,
		webId: products[productId].webId
	}))
}