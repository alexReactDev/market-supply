import axios from "../httpConfig";
import { AppDispatch, AppState } from ".";
import { categoriesListLoaded, categoryDataLoaded, categoryLoaded, categoryLoadError, categoryLoadStart, ICategoryInitialData } from "./reducer/categories";
import { productsLoaded, productsLoadError, productsLoadStart } from "./reducer/products";
import { productDetailsLoaded, productDetailsLoadError, productDetailsLoadStart } from "./reducer/productsDetails";
import { IReview, productReviewsLoaded, productReviewsLoadError, productReviewsLoadStart } from "./reducer/productsReviews";
import { cartProductsSelector, checkoutConfirmationDataSelector, productsSelector, searchSelector, userIdSelector, userOrdersSelector, whitelistProductsSelector } from "./selectors";
import { cartItemsLoaded, cartProductsLoaded, cartProductsLoadError, cartProductsLoadStart, emptyCart, productDecrement, productIncrement, removeProduct } from "./reducer/cart";
import { addToWhitelist, clearWhitelist, removeFromWhitelist, wishlistItemsLoaded, wishlistProductsLoaded, wishlistProductsLoadError, wishlistProductsLoadStart } from "./reducer/whitelist";
import { loginStart, loginSuccess, loginError, logout } from "./reducer/login";
import { push } from "connected-react-router";
import { signUpError, signUpStart, signUpSuccess } from "./reducer/signUp";
import { userDataLoaded, userDataLoadError, userDataLoadStart, userIdLoaded } from "./reducer/userdata";
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
import { collectionDataLoaded, collectionLoaded, collectionLoadError, collectionLoadStart, collectionsListLoaded } from "./reducer/collections";
import { outletsLoadError, outletsLoadStart, outletsLoadSuccess } from "./reducer/outlets";
import { displayPopup } from "./reducer/popup";


//Initialization

export const initialize = () => async (dispatch: AppDispatch) => {

	try {
		await dispatch(loadUserIdActionAsync());

		dispatch(loginSuccess());
	}
	catch(e: any) {
		if(!e.response) return dispatch(generalError(e));
	}

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

	let collections;

	try {
		collections = (await axios.get("/api/collections")).data;
	}
	catch(e) {
		return dispatch(generalError(e));
	}

	dispatch(collectionsListLoaded(collections));


	await dispatch(loadCartAction());

	await dispatch(loadWishlistAction());

	await dispatch(loadUserPreferencesAction());

	dispatch(init());
}


//Categories
interface ICategoryData {
	totalPages: number,
	page: number,
	sort: string,
	data: string[]
}

export const loadCategoryProducts = (catId: number, sort?: string) => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	let category;
	let categoryName;

	for (let key in state.categories) {
		if(state.categories[key].id === catId) {
			categoryName = key;
			category = state.categories[key];
		}
	}

	if(!category || !categoryName) return dispatch(push("/error"));

	const catSort = sort || category.sort;
	
	dispatch(categoryLoadStart({category: categoryName}));

	let categoryData: ICategoryData;

	try {
		categoryData = (await axios.get(`/api/categories/${categoryName}?sort=${catSort}`)).data;
	}
	catch(e) {
		console.log(e);

		dispatch(categoryLoadError({
			category: categoryName,
			error: e
		}))

		return;
	}

	const { page, totalPages, data } = categoryData;

	const nonExistingProducts = data.filter((productId) => !state.products[productId]);

	if(nonExistingProducts.length > 0) await Promise.allSettled(nonExistingProducts.map((productId) => loadProductByIdActionAsync(productId)));

	dispatch(categoryLoaded({
		category: categoryName,
		done: page >= totalPages,
		sort: categoryData.sort,
		page,
		data
	}))
}

export const loadMoreCategoryProducts = (catId: number) => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	let category;
	let categoryName;

	for (let key in state.categories) {
		if(state.categories[key].id === catId) {
			categoryName = key;
			category = state.categories[key];
		}
	}

	if(!category || !categoryName) return dispatch(push("/error"));

	dispatch(categoryLoadStart({
		category: categoryName
	}));

	let categoryData;

	try {
		categoryData = (await axios.get(`/api/categories/${categoryName}?page=${category.page + 1}&sort=${category.sort}`)).data;
	}
	catch(e) {
		return dispatch(categoryLoadError({
			category: categoryName,
			error: e
		}))
	}

	const { page, totalPages, sort, data } = categoryData;

	const nonExistingProducts = data.filter((productId: string) => !state.products[productId]);

	if(nonExistingProducts.length > 0) await Promise.allSettled(nonExistingProducts.map((productId: string) => loadProductByIdActionAsync(productId)));

	dispatch(categoryDataLoaded({
		category: categoryName,
		done: page >= totalPages,
		page,
		sort,
		data
	}))
}

//Products

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

		dispatch(productsLoaded(loadedProduct));

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
	dispatch(productDetailsLoadStart(id));

	try {
		const productDetails = (await axios.get(`/api/product/details/${id}`)).data;
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
	dispatch(productReviewsLoadStart(id));

	try {
		const productReviews = (await axios.get(`/api/product/reviews/${id}`)).data;
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

interface IReviewToPublish {
	email: string,
	title: string,
	text: string,
	rate: number,
	timestamp: number
}

export const publishReviewAction = (productId: string, review: IReviewToPublish) => async (dispatch: AppDispatch) => {
	
	try {
		const savedReview = (await axios.post(`api/product/reviews/${productId}`, review)).data;

		dispatch(productReviewsLoaded({
			id: productId,
			reviews: [savedReview]
		}));
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(displayPopup("Failed to publish review. Try again later."));
	}
}

//Cart

export const loadCartAction = () => async (dispatch: AppDispatch) => {
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
}

export const productIncrementAction = (productId: string, amount: number = 1) => async (dispatch: AppDispatch) => {
	try {
		const cart = (await axios.patch(`/api/cart/increment/${productId}`, {payload: amount})).data;

		dispatch(productIncrement(cart));
	}
	catch(e: any) {
		if(!e.response) throw e;

		return dispatch(push("/error"));
	}
}

export const productDecrementAction = (productId: string, amount: number = 1) => async (dispatch: AppDispatch) => {
	try {
		const cart = (await axios.patch(`/api/cart/decrement/${productId}`, {payload: amount})).data;

		dispatch(productDecrement(cart));
	}
	catch(e: any) {
		if(!e.response) throw e;

		return dispatch(push("/error"));
	}
}

export const removeProductAction = (productId: string) => async (dispatch: AppDispatch) => {
	try {
		const cart = (await (await axios.delete(`/api/cart/${productId}`))).data;

		dispatch(removeProduct(cart))
	}
	catch(e: any) {
		if(!e.response) throw e;

		return dispatch(push("/error"));
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

export const loadCartProductsAction = () => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const cartProducts = cartProductsSelector(state);
	const products = productsSelector(state);

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

//Checkout

export const checkoutAction = (checkoutData: {[key: string]: string}) => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const cart = cartProductsSelector(state);
	const products = productsSelector(state);
	
	dispatch(checkoutLoading());

	let confirmData;
	
	try {
		confirmData = (await axios.post("api/orders", {payload: {
			...checkoutData,
			products: cart
		}})).data as IConfirmationData;
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		return dispatch(checkoutError(e.response.data));
	}

	try {
		Promise.all(confirmData.products.map(async ({ product_id }) => {
			const product = products[product_id];
	
			if(product && !product.error && !product.loading) return product;

			if(product && product.error) throw product.error;

			if(product && product.loading) {
				await product.promise;
				return product;
			}
	
			await dispatch(loadProductByIdActionAsync(product_id));

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
		await axios.post(`/api/orders/confirm/${confirmData?.confirmationLink}`);

		dispatch(checkoutSuccess());
		dispatch(emptyCart());
		dispatch(displayPopup("Thanks for order"));
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

export const loadOutletsAction = () => async (dispatch: AppDispatch) => {
	let outlets;

	dispatch(outletsLoadStart());

	try {
		outlets = (await axios.get("/api/outlets")).data;
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		return dispatch(outletsLoadError(e));
	}

	dispatch(outletsLoadSuccess(outlets));
}


//Wishlist

export const loadWishlistAction = () => async (dispatch: AppDispatch) => {
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
}

export const addToWhitelistAction = (id: string) => async (dispatch: AppDispatch) => {
	try {
		await axios.post(`/api/wishlist/${id}`);
		
		dispatch(addToWhitelist(id));
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(push("/error"));
	}
}

export const removeFromWhitelistAction = (id: string) => async (dispatch: AppDispatch) => {
	try {
		await axios.delete(`/api/wishlist/${id}`);

		dispatch(removeFromWhitelist(id));
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

//Authorization
interface loginData {
	email: string,
	password: string
}

export const loginAction = (loginData: loginData) => async (dispatch: AppDispatch) => {
	dispatch(loginStart());

	try {
		await axios.post("/api/login", {payload: loginData.email, password: loginData.password});
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(loginError({error: e.response.data}));

		if(e.response.status !== 400 && e.response.status !== 403) dispatch(push("/error"));

		return;
	}

	dispatch(loadCartAction());

	dispatch(loadWishlistAction());

	try {
		await dispatch(loadUserIdActionAsync());
	}
	catch(e: any) {
		return dispatch(loginError(e));
	}

	dispatch(loadUserPreferencesAction());
	return dispatch(loginSuccess());
}

export const logoutAction = () => async (dispatch: AppDispatch) => {
	try {
		await axios.post("/api/logout");
	}
	catch(e: any) {
		if(!e.response) throw e;

		return dispatch(push("/error"));
	}

	dispatch(emptyCart());
	dispatch(clearWhitelist());
	dispatch(logout());
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
		savedUser = (await axios.post("/api/user", {payload: signUpData})).data;
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(signUpError({error: e.response.data}));

		if(e.response.status !== 400) dispatch(push("/error"));

		return;
	}

	dispatch(loginStart());

	try {
		await axios.post("/api/login", {payload: savedUser.email, password: signUpData.password});
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(loginError({error: e.response.data}));
		dispatch(signUpError(e.response.data));
		dispatch(push("/error"));

		return;
	}

	try {
		await dispatch(loadUserIdActionAsync());
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		dispatch(loginError({error: e.response.data}));
		dispatch(signUpError(e.response.data));
		dispatch(push("/error"));
	}

	dispatch(loginSuccess());
	dispatch(signUpSuccess());
}

export const loadUserIdActionAsync = () => async (dispatch: AppDispatch) => {
	let userId = (await axios.get("/api/user/id")).data;

	dispatch(userIdLoaded(userId));

	return userId;
}

//UserData&UserProfile

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

		return dispatch(userOrdersLoadError(e));
	}

	try {
		const orders = await Promise.all(res.data.map(async (order: IOrder) => {
			const {product_id} = order;
			const product = products[product_id];
	
			if(product && !product.error && !product.loading) return order;

			if(product && product.error) throw product.error;

			if(product && product.loading) {
				await product.promise;
				return order;
			}
	
			await dispatch(loadProductByIdActionAsync(product_id));

			return order;
		}))

		dispatch(userOrdersLoaded({
			page: res.page,
			done: res.page >= res.totalPages,
			orders,
		}))
	}
	catch(e: any) {
		if(!e.response) throw e;

		dispatch(userOrdersLoadError(e));
	}
}

export const editProfileAction = (profileData: {[key: string]: string | null}) => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const userId = userIdSelector(state);
	dispatch(editProfileRequest());

	try {
		const newUserData = (await axios.put(`/api/user/profile/${userId}`, {payload: profileData})).data;

		dispatch(userDataLoaded(newUserData));
		dispatch(editProfileSuccess());
		dispatch(push("/account"));
		dispatch(displayPopup("Profile data successfully changed"));
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(push("/error"));
			throw e;
		}

		dispatch(editProfileFail(e.response.data));
	}
}

export const editEmailAction = (data: {email: string, password: string}) => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const userId = userIdSelector(state);

	dispatch(editEmailRequest());

	try {
		const updatedUserData = (await axios.put(`/api/user/email/${userId}`, {payload: data.email, password: data.password})).data;

		dispatch(editEmailSuccess());
		dispatch(userDataLoaded(updatedUserData));
		dispatch(push("/account"));
		dispatch(displayPopup("Email successfully changed"));
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		dispatch(editEmailFail(e.response.data));
	}
}

export const editPasswordAction = (data: {oldPassword: string, newPassword: string}) => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const userId = userIdSelector(state);
	dispatch(editPasswordRequest());

	try {
		await axios.put(`/api/user/password/${userId}`, {password: data.oldPassword, payload: data.newPassword});

		dispatch(editPasswordSuccess());
		await dispatch(logoutAction());
		dispatch(push("/login"));
		dispatch(displayPopup("Password successfully changed"));
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		dispatch(editPasswordFail(e.response.data));
	}
}

export const deleteAccountAction = (password: string) => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const userId = userIdSelector(state);
	
	dispatch(deleteAccountRequest());

	try {
		await axios.delete(`/api/user/${userId}`, {data: {password}});

		dispatch(deleteAccountSuccess());
		await dispatch(logoutAction());
		dispatch(push("/"));
		dispatch(displayPopup("Account successfully deleted"));
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		dispatch(deleteAccountFail(e.response.data));
	}
}

//Preferences

export const loadUserPreferencesAction = () => async (dispatch: AppDispatch, getState: () => AppState) => {
	let preferences;

	try {
		preferences = (await axios.get("/api/preferences")).data;
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}
	}

	return dispatch(preferencesLoaded(preferences));
}

export const changePreferenceAutoFillAction = (autofill: boolean) => async (dispatch: AppDispatch) => {
	let preferences;
	
	try {
		preferences = (await axios.put("/api/preferences/auto-fill", {payload: autofill})).data;
	}
	catch(e: any) {
		if(!e.response) {
			dispatch(generalError(e));
			throw e;
		}

		dispatch(push("/error"));
	}

	dispatch(preferencesLoaded(preferences));
}

//Search

export const searchRequestAction = (searchQuery: string, page?: number) => async (dispatch: AppDispatch, getState: () => AppState) => {
	dispatch(searchRequest(searchQuery));

	try {
		const searchResult = (await axios.get(`api/search/?q=${searchQuery}&page=${page ? page : 1}`)).data as searchDataLoadedAction;

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
		dispatch(push(`/search/?q=${searchResult.search}&page=${searchResult.page}`));
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
		const searchResult = (await axios.get(`/api/search/?q=${search.search}&page=${search.page + 1}`)).data as searchDataLoadedAction;

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

//Collections

export const loadCollectionData = (colId: number, sort?: string ) => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	let collection;
	let colName;
	
	for (let key in state.collections) {
		if(state.collections[key].id === colId) {
			colName = key;
			collection = state.collections[key]
		}
	}

	if(!colName || !collection) return dispatch(push("/error"));

	sort = sort || collection.sort;

	dispatch(collectionLoadStart({
		collection: colName
	}));

	let collectionData;

	try {
		collectionData = (await axios.get(`/api/collections/${colName}?sort=${sort}`)).data;
	}
	catch(e: any) {
		dispatch(collectionLoadError({
			collection: colName,
			error: e
		}))
	}

	const { page, totalPages, data } = collectionData;

	const nonExistingProducts = data.filter((productId: string) => !state.products[productId]);

	if(nonExistingProducts.length > 0) await Promise.allSettled(nonExistingProducts.map((productId: string) => loadProductByIdActionAsync(productId)));

	dispatch(collectionLoaded({
		collection: colName,
		done: page >= totalPages,
		sort,
		page,
		data,
	}))
}

export const loadMoreCollectionProducts = (colId: number) => async (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	let collection;
	let colName;

	for (let key in state.collections) {
		if(state.collections[key].id === colId) {
			colName = key;
			collection = state.collections[key]
		}
	}

	if(!colName || !collection) return dispatch(push("/error"));

	dispatch(collectionLoadStart({
		collection: colName
	}));

	let collectionData;

	try {
		collectionData = (await axios.get(`/api/collections/${colName}?sort=${collection.sort}&page=${collection.page + 1}`)).data;
	}
	catch(e) {
		dispatch(collectionLoadError({
			collection: colName,
			error: e
		}))
	}

	const { page, totalPages, data, sort } = collectionData;

	const nonExistingProducts = data.filter((productId: string) => !state.products[productId]);

	if(nonExistingProducts.length > 0) await Promise.allSettled(nonExistingProducts.map((productId: string) => loadProductByIdActionAsync(productId)));

	dispatch(collectionDataLoaded({
		collection: colName,
		done: page >= totalPages,
		sort,
		page,
		data,
	}))
}

export const loadCollectionDataByUrlName = (url: string, sort?: string) => (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();

	dispatch(loadCollectionData(state.collections[url].id, sort));
}

//Other

export const subscribeToNewsletterAction = (email: string) => async (dispatch: AppDispatch) => {
	try {
		await axios.post("/api/newsletter", {email});
		dispatch(displayPopup("Thanks for subscription"));
	}
	catch(e) {
		dispatch(displayPopup("Failed to subscribe. Try again later."));
	}
}