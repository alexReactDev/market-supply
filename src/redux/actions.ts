import { AppDispatch, AppState } from ".";
import { categoriesListLoaded, categoryLoaded, categoryLoadError, categoryLoadStart, ICategoryInitialData } from "./reducer/categories";
import { IProduct, productsLoaded, productsLoadError, productsLoadStart } from "./reducer/products";
import { productDetailsLoaded, productDetailsLoadError, productDetailsLoadStart } from "./reducer/productsDetails";
import { IReview, productReviewsLoaded, productReviewsLoadError, productReviewsLoadStart } from "./reducer/productsReviews";
import { cartProductsSelector, checkoutConfirmationDataSelector, productsSelector, searchSelector, userIdSelector, userOrdersSelector, whitelistProductsSelector } from "./selectors";
import { cartItemsLoaded, cartProductsLoaded, cartProductsLoadError, cartProductsLoadStart, emptyCart, productDecrement, productIncrement, removeProduct } from "./reducer/cart";
import { addToWhitelist, clearWhitelist, removeFromWhitelist, wishlistItemsLoaded, wishlistProductsLoaded, wishlistProductsLoadError, wishlistProductsLoadStart } from "./reducer/whitelist";
import { loginStart, loginSuccess, loginError, logout } from "./reducer/login";
import { push } from "connected-react-router";
import { signUpError, signUpStart, signUpSuccess } from "./reducer/signUp";
import axios from "../httpConfig";
import { userDataLoaded, userDataLoadError, userDataLoadStart } from "./reducer/userdata";
import { IOrder, userOrdersLoaded, userOrdersLoadError, userOrdersLoadStart } from "./reducer/userOrders";
import { preferencesLoaded } from "./reducer/preferences";
import { editProfileFail, editProfileRequest, editProfileSuccess } from "./reducer/editProfileData";
import { init } from "./reducer/initialized";
import { generalError } from "./reducer/generalError";
import { editEmailFail, editEmailRequest, editEmailSuccess } from "./reducer/editEmailData";
import { editPasswordFail, editPasswordRequest, editPasswordSuccess } from "./reducer/editPasswordData";
import { deleteAccountFail, deleteAccountRequest, deleteAccountSuccess } from "./reducer/deleteAccountData";
import { checkoutConfirmationCanceled, checkoutConfirmationDataLoaded, checkoutError, checkoutLoading, checkoutSuccess, IConfirmationData } from "./reducer/checkout";
import { searchDataLoaded, searchDataLoadedAction, searchDataLoading, searchError, searchRequest } from "./reducer/search";
import { foldersLoaded, IFolder } from "./reducer/folders";

export const initialize = () => async (dispatch: AppDispatch) => {

	//get userId
	let folders;

	try {
		folders = (await axios.get("/api/categories")).data;
	}
	catch(e) {
		return dispatch(generalError(e));
	}

	let categories: ICategoryInitialData[] = [];

	let foldersWithItems: IFolder[];

	try {
		foldersWithItems = await Promise.all(folders.map(async (folder: any) => {

			const folderItems = (await axios.get(`/api/categories/${folder.url_name}`)).data;

			categories.push(...folderItems.map((cat: any) => ({...cat, internalName: `${folder.url_name}/${cat.url_name}`})));

			return {
				...folder,
				items: folderItems.map((item: any) => `${folder.url_name}/${item.url_name}`)
			}
		}))
	}
	catch(e) {
		return dispatch(generalError(e));
	}

	dispatch(foldersLoaded(foldersWithItems));

	dispatch(categoriesListLoaded(categories));

	try {
		const cartItems = (await axios.get("/api/cart")).data;
		dispatch(cartItemsLoaded(cartItems));
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		dispatch(cartProductsLoadError(e));
	}

	try {
		const wishlistItems = (await axios.get("/api/wishlist")).data;
		dispatch(wishlistItemsLoaded(wishlistItems));
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		dispatch(wishlistProductsLoadError(e));
	}

	dispatch(init());
}

interface ICategoryData {
	totalPages: number,
	page: number,
	sort: string,
	data: string[]
}

export const loadCategoryDataWithProducts = (categoryName: string, newSort?: string) => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const category = state.categories[categoryName];
	const catSort = newSort || category.sort;
	
	dispatch(categoryLoadStart({category: categoryName, sortChanging: catSort === category.sort ? false : true}));

	let categoryData: ICategoryData;

	try {
		categoryData =  (await axios.get(`/api/categories/${categoryName}?page=${catSort === category.sort ? category.page + 1 : 1}&sort=${catSort}`)).data;
	}
	catch(e) {
		console.log(e);

		dispatch(categoryLoadError({
			category: categoryName,
			error: e as Error
		}))

		return;
	}

	const { page, totalPages, sort, data } = categoryData;

	const nonExistingProducts = data.filter((productId) => !state.products[productId]);

	if(nonExistingProducts.length > 0) {

		const rawProducts = await Promise.allSettled(nonExistingProducts.map((productId) => {
			const productPromise = axios.get(`/api/product/${productId}`);

			dispatch(productsLoadStart([{
				productId,
				promise: productPromise
			}]));

			return productPromise;
		}));
	
		const products = rawProducts.map((product, index) => {
			if(product.status === "rejected") return ({
				id: nonExistingProducts[index],
				error: product.reason
			})
			else return ({
				...product.value.data
			})
		})
	
		const rejectedProducts = products.filter((product) => product.error);
		if(rejectedProducts.length > 0) dispatch(productsLoadError(rejectedProducts));
	
		const loadedProducts = products.filter((product) => !product.error);
		if(loadedProducts.length > 0) dispatch(productsLoaded(loadedProducts));
	}

	/*dispatch(categoryLoaded({
		category: categoryName,
		data: {
			done: page === totalPages,
			products: data,
			page,
			sort,
		}
	}))*/
}

export const subscribeToNewsletterAction = (email: string) => async () => {
	try {
		await axios.post("/api/newsletter", {email});
		alert("You've subscribed newsletter");
	}
	catch(e) {
		alert("Failed to subscribe. Try again later.")
	}
}

export const loadProductByIdAction = (id: string) => async (dispatch: AppDispatch) => {
	try {
		const result = await dispatch(loadProductByIdActionAsync(id));
		return result;
	}
	catch(e: any) {
		if(!e.handled) throw e;

		return e;
	}
}

export const loadProductByIdActionAsync = (id: string) => async (dispatch: AppDispatch) => {

	try {
		const productPromise = axios.get(`api/product/${id}`);
		
		dispatch(productsLoadStart([{
			productId: id,
			promise: productPromise
		}]));

		const loadedProduct = (await productPromise).data;

		dispatch(productsLoaded([loadedProduct]));

		return loadedProduct;
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(productsLoadError([
			{
				id,
				error: e
			}
		]));

		e.handled = true;
		throw e;
	}
}

export const loadProductDetailsAction = (id: string) => async (dispatch: AppDispatch) => {
	dispatch(productDetailsLoadStart({id}));

	try {
		const productDetails = (await axios.get(`/api/product/${id}/details`)).data;
		dispatch(productDetailsLoaded({
			id,
			details: productDetails
		}));
	}
	catch(e) {
		console.log(e);
		
		dispatch(productDetailsLoadError({
			id,
			error: e as Error
		}));
	}
}

export const loadProductReviewsAction = (id: string) => async (dispatch: AppDispatch) => {
	dispatch(productReviewsLoadStart({id}));

	try {
		const productReviews = (await axios.get(`/api/product/${id}/reviews`)).data;
		dispatch(productReviewsLoaded({
			id,
			reviews: productReviews
		}));
	}
	catch(e) {
		console.log(e);
		
		dispatch(productReviewsLoadError({
			id,
			error: e as Error
		}));
	}
}

export const productIncrementAction = (productId: string, amount: number = 1) => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const productPrice = (productsSelector(state)[productId] as IProduct).price;

	try {
		const incrementedProduct = (await axios.patch("/api/cart", {
			action: "increment",
			id: productId,
			amount
		})).data;

		dispatch(productIncrement({
			productId: incrementedProduct.id,
			amount: incrementedProduct.amount,
			productPrice
		}))
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(push("/error"));
	}
}

export const productDecrementAction = (productId: string, amount: number = 1) => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const productPrice = productsSelector(state)[productId].price;

	try {
		const decrementedProduct = (await axios.patch("/api/cart", {
			action: "decrement",
			id: productId,
			amount
		})).data;

		dispatch(productDecrement({
			productId: decrementedProduct.id,
			amount: decrementedProduct.amount,
			productPrice
		}))
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(push("/error"));
	}
}

export const removeProductAction = (productId: string) => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const productPrice = (productsSelector(state)[productId] as IProduct).price;

	try {
		const removedItem = await (await axios.delete(`/api/cart/${productId}`)).data;

		dispatch(removeProduct({
			productId: removedItem,
			productPrice
		}))
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(push("/error"));
	}
}

export const emptyCartAction = () => async (dispatch: AppDispatch) => {
	try {
		await axios.delete("/api/cart");

		dispatch(emptyCart());
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(push("/error"));
	}
}

interface IReviewToPublish extends IReview {
	email: string
}

export const publishReviewAction = (productId: string, review: IReviewToPublish) => async (dispatch: AppDispatch) => {
	
	try {
		const savedReview = (await axios.post(`api/product/${productId}/reviews`, {review})).data;

		dispatch(productReviewsLoaded({
			id: productId,
			reviews: [savedReview]
		}));
	}
	catch(e: any) {
		if(!e.response) throw e;

		alert("Failed to publish review. Try again later.");
	}
}

export const checkoutAction = (checkoutData: {[key: string]: string}) => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const cart = cartProductsSelector(state);
	const products = productsSelector(state);
	
	dispatch(checkoutLoading());

	let confirmData;
	try {
		confirmData = (await axios.post("api/orders", {cart, data: checkoutData})).data as IConfirmationData;
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		return dispatch(checkoutError(e.response.data));
	}

	try {
		Promise.all(confirmData.products.map(async ({ productId }) => {
			const product = products[productId];
	
			if(product && !product.error && !product.loading) return product;

			if(product && product.error) throw product.error;

			if(product && product.loading) {
				await product.promise;
				return product;
			}
	
			await dispatch(loadProductByIdActionAsync(productId));

			return product;
		}))
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		return dispatch(checkoutError(e.response.data));
	}

	dispatch(checkoutConfirmationDataLoaded(confirmData));
}

export const confirmCheckoutAction = () => async (dispatch: AppDispatch, getState: () => AppState) => { 
	const state = getState();
	const confirmData = checkoutConfirmationDataSelector(state);

	dispatch(checkoutLoading());

	try {
		await axios.post(`/api/orders/confirm/${confirmData?.orderId}`);

		dispatch(checkoutSuccess());
		dispatch(emptyCart());
		alert("Thanks for order");
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		dispatch(checkoutError(e.response.data));
	}
}

export const cancelCheckoutConfirmationAction = () => async (dispatch: AppDispatch) => {
	dispatch(checkoutConfirmationCanceled());
}

export const addToWhitelistAction = (id: string) => async (dispatch: AppDispatch) => {
	try {
		const savedItem = await (await axios.post("/api/wishlist", {id})).data;
		
		dispatch(addToWhitelist({id: savedItem}));
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(push("/error"));
	}
}

export const removeFromWhitelistAction = (id: string) => async (dispatch: AppDispatch) => {
	try {
		const removedItem = await (await axios.delete(`/api/wishlist/${id}`)).data;

		dispatch(removeFromWhitelist({id: removedItem}));
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(push("/error"));
	}
}

export const clearWishlistAction = () => async (dispatch: AppDispatch) => {
	try {
		await axios.delete("/api/wishlist");

		dispatch(clearWhitelist());
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(push("/error"));
	}
}

interface loginData {
	email: string,
	password: string
}

export const loginAction = (loginData: loginData) => async (dispatch: AppDispatch) => {
	dispatch(loginStart());

	try {
		await axios.post("/api/login", loginData);
		return dispatch(loginSuccess());
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(loginError({error: e.response.data}));

		if(e.response.status !== 400) dispatch(push("/error"));

		return;
	}
}

export const logoutAction = () => async (dispatch: AppDispatch) => {
	try {
		await axios.post("/api/logout");
		return dispatch(logout());
	}
	catch(e: any) {
		if(!e.response) throw e;

		return dispatch(push("/error"));
	}
}

interface signUpData {
	name: string,
	surname?: string,
	email: string,
	password: string
}

export const signUpAction = (signUpData: signUpData) => async (dispatch: AppDispatch) => {
	dispatch(signUpStart());

	let savedUser;

	try {
		savedUser = await (await axios.post("/api/user", signUpData)).data;
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(signUpError({error: e.response.data}));

		if(e.response.status !== 400) dispatch(push("/error"));

		return;
	}

	dispatch(loginStart());

	try {
		await axios.post("/api/login", {email: savedUser.email, password: signUpData.password});
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(loginError({error: e.response.data}));
		dispatch(signUpError(e.response.data));
		dispatch(push("/error"));

		return;
	}

	dispatch(loginSuccess());
	dispatch(signUpSuccess());
}

export const loadUserDataAction = () => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const userId = userIdSelector(state);

	dispatch(userDataLoadStart());

	try {
		const userdata = (await axios.get(`/api/user/${userId}`)).data;

		dispatch(userDataLoaded(userdata));
	}
	catch(e: any) {
		if (!e.response) throw e;

		dispatch(userDataLoadError(e));
	}
}

export const loadUserOrdersAction = () => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const page = userOrdersSelector(state).page;
	const userId = userIdSelector(state);
	const products = productsSelector(state);

	dispatch(userOrdersLoadStart());

	let res;

	try {
		res = (await axios.get(`api/orders/${userId}?page=${page + 1}`)).data;
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(userOrdersLoadError(e));
	}

	try {
		const orders = await Promise.all(res.orders.map(async (order: IOrder) => {
			const {productId} = order;
			const product = products[productId];
	
			if(product && !product.error && !product.loading) return order;

			if(product && product.error) throw product.error;

			if(product && product.loading) {
				await product.promise;
				return order;
			}
	
			await dispatch(loadProductByIdActionAsync(productId));

			return order;
		}))

		dispatch(userOrdersLoaded({
			...res,
			orders,
		}))
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(userOrdersLoadError(e));
	}
}

export const changePreferencesAction = (pref: {[key: string]: string | boolean}) => async (dispatch: AppDispatch) => {
	try {
		const newPreferences = (await axios.patch("/api/preferences", pref)).data;
		console.log(newPreferences);

		dispatch(preferencesLoaded(newPreferences));
	}
	catch(e: any) {
		dispatch(push("/error"));
		throw e;
	}
}

export const editProfileAction = (profileData: {[key: string]: string | null}) => async (dispatch: AppDispatch) => {
	dispatch(editProfileRequest());

	try {
		const newUserData = (await axios.patch("/api/user/profile", profileData)).data;

		dispatch(userDataLoaded(newUserData));
		dispatch(editProfileSuccess());
		dispatch(push("/account"));
		alert("Profile data successfully changed");
	}
	catch(e: any) {
		if(!e.response) {
			push("/error");
			throw e;
		}

		dispatch(editProfileFail(e.response.data));
	}
}

export const loadCartProductsAction = () => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const cartProducts = cartProductsSelector(state);
	const products = productsSelector(state);

	console.log("Where is the error?")

	dispatch(cartProductsLoadStart());

	try {
		await Promise.all(Object.keys(cartProducts).map(async (productId) => {
			const product = products[productId];

			if(product && !product.error && !product.loading) return product;
			if(product && product.error) throw product.error;
			if(product && product.loading) {
				await product.promise;
				return product;
			}

			const loadedProduct = await dispatch(loadProductByIdActionAsync(productId));

			return loadedProduct;
		}))

		dispatch(cartProductsLoaded());
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		dispatch(cartProductsLoadError(e));
	}
}

export const loadWishlistProductsAction = () => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const wishlistProducts = whitelistProductsSelector(state);
	const products = productsSelector(state);

	dispatch(wishlistProductsLoadStart());

	try {
		await Promise.all(wishlistProducts.map(async (productId) => {
			const product = products[productId];

			if(product && !product.error && !product.loading) return product;
			if(product && product.error) throw product.error;
			if(product && product.loading) {
				await product.promise;
				return product;
			}

			const loadedProduct = await dispatch(loadProductByIdActionAsync(productId));

			return loadedProduct;
		}))

		dispatch(wishlistProductsLoaded());
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		dispatch(wishlistProductsLoadError(e));
	}
}

export const editEmailAction = (data: {email: string, password: string}) => async (dispatch: AppDispatch) => {
	dispatch(editEmailRequest());

	try {
		const updatedUserData = (await axios.patch("/api/user/email", data)).data;

		dispatch(editEmailSuccess());
		dispatch(userDataLoaded(updatedUserData));
		dispatch(push("/account"));
		alert("Email successfully changed");
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		dispatch(editEmailFail(e.response.data));
	}
}

export const editPasswordAction = (data: {oldPassword: string, newPassword: string}) => async (dispatch: AppDispatch) => {
	dispatch(editPasswordRequest());

	try {
		const res = (await axios.patch("/api/user/password", data)).data;

		dispatch(editPasswordSuccess());
		dispatch(push("/account"));
		alert("Password successfully changed");
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		dispatch(editPasswordFail(e.response.data));
	}
}

export const deleteAccountAction = () => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const userId = userIdSelector(state);
	
	dispatch(deleteAccountRequest());

	try {
		await axios.delete(`/api/user/${userId}`);

		dispatch(deleteAccountSuccess());
		dispatch(logout());
		dispatch(push("/"));
		alert("Account successfully deleted");
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		dispatch(deleteAccountFail(e.response.data));
	}
}

export const searchRequestAction = (searchQuery: string, page?: number) => async (dispatch: AppDispatch, getState: () => AppState) => {
	dispatch(searchRequest(searchQuery));

	try {
		const searchResult = (await axios.get(`api/search/${searchQuery}?page=${page ? page : 1}`)).data as searchDataLoadedAction;

		const state = getState();
		const products = productsSelector(state);
		await Promise.all(searchResult.result.map(async (productId) => {
			const product = products[productId];

			if(product && !product.error && !product.loading) return product;
			if(product && product.error) throw product.error;
			if(product && product.loading) {
				await product.promise;
				return product;
			}

			const loadedProduct = await dispatch(loadProductByIdActionAsync(productId));

			return loadedProduct;
		}))

		dispatch(searchDataLoaded(searchResult));
		dispatch(push(`/search/${searchResult.search}?page=${searchResult.page}`));
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		dispatch(searchError(e));
	}
}

export const loadMoreSearchResultsAction = () => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const search = searchSelector(state);

	dispatch(searchDataLoading());

	try {
		const searchResult = (await axios.get(`/api/search/${search.search}?page=${search.page + 1}`)).data as searchDataLoadedAction;

		const state = getState();
		const products = productsSelector(state);
		await Promise.all(searchResult.result.map(async (productId) => {
			const product = products[productId];

			if(product && !product.error && !product.loading) return product;
			if(product && product.error) throw product.error;
			if(product && product.loading) {
				await product.promise;
				return product;
			}

			const loadedProduct = await dispatch(loadProductByIdActionAsync(productId));

			return loadedProduct;
		}))

		dispatch(searchDataLoaded(searchResult));
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		dispatch(searchError(e));
	}
}