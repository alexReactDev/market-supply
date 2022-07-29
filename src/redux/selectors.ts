import { AppState } from ".";
import { IProduct } from "./reducer/products";

export const foldersSelector = (state: AppState) => state.folders;

export const collectionsSelector = (state: AppState) => state.collections;

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

export const URLLocationSelector = (state: AppState) => state.router.location;
export const URLPathSelector = (state: AppState) => state.router.location.pathname;

export const editProfileDataSelector = (state: AppState) => state.editProfileData;
export const editEmailDataSelector = (state: AppState) => state.editEmailData;
export const editPasswordDataSelector = (state: AppState) => state.editPasswordData;
export const deleteAccountDataSelector = (state: AppState) => state.deleteAccountData;

export const searchSelector = (state: AppState) => state.search;
export const searchResultSelector = (state: AppState) => state.search.result;

export const menuOpenSelector = (state: AppState) => state.menu.isOpen;

export const outletsSelector = (state: AppState) => state.outlets;

export const cartAmountSelector = (state: AppState) => Array.from(Object.keys(cartProductsSelector(state))).length;

export const whitelistAmountSelector = (state: AppState) => Array.from(Object.keys(whitelistProductsSelector(state))).length;

export const URLPathEndSelector = (state: AppState) => {
	const url = URLPathSelector(state);
	const cleanUrl = url.endsWith("/") ? url.slice(0, url.length - 1) : url;
	const urlEnd = cleanUrl.slice(cleanUrl.lastIndexOf("/") + 1);

	return urlEnd;
}

export const foldersWithItemsSelector = (state: AppState) => {
	const folders = foldersSelector(state);

	return folders.map((folder) => ({
		...folder,
		items: folder.items.map((catName) => {
			const cat = categoriesSelector(state)[catName];

			return {
				id: cat.id,
				name: cat.name,
				url_name: cat.url_name,
			}
		})
	}))
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
			total: productsSelector(state)[key].price * cartProducts[key]
		})
	}

	return cartProductsWithProps.concat().sort((productA, productB) => productA.webId - productB.webId);
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
			const {product_id, ...orderData} = order;

			return {
				...orderData,
				picture: products[product_id].pictures[0],
				name: products[product_id].name,
				webId: products[product_id].webId
			}
		})
	}

	return ordersWithProductData;
}

export const checkoutConfirmationDataProductsWithPropsSelector = (state: AppState) => {
	const confirmData = checkoutConfirmationDataSelector(state);
	const products = productsSelector(state);

	if(!confirmData) return null;

	return confirmData.products.map(({product_id, amount, total}) => ({
		product_id,
		amount,
		total,
		img: products[product_id].pictures[0],
		name: products[product_id].name,
		webId: products[product_id].webId
	}))
}

export const searchProductsWithPropsSelector = (state: AppState) => {
	const products = productsSelector(state);
	const searchResult = searchResultSelector(state);

	return searchResult.map((productId) => {
		const product = products[productId];

		return({
			productId,
			name: product.name,
			webId: product.webId,
			rate: product.rate,
			price: product.price,
			oldPrice: product.oldPrice,
			pictures: product.pictures
		})
	})
}