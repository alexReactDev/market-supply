import { createAction, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, AppState } from ".";
import { INIT } from "../constants";
import { categoryLoaded, categoryLoadError, categoryLoadStart } from "./reducer/categories";
import { IProduct, productsLoaded, productsLoadError, productsLoadStart } from "./reducer/products";
import { productDetailsLoaded, productDetailsLoadError, productDetailsLoadStart } from "./reducer/productsDetails";
import { IReview, productReviewsLoaded, productReviewsLoadError, productReviewsLoadStart } from "./reducer/productsReviews";
import { productsSelector, userIdSelector, userOrdersSelector } from "./selectors";
import { emptyCart, productDecrement, productIncrement, removeProduct } from "./reducer/cart";
import { addToWhitelist, clearWhitelist, removeFromWhitelist } from "./reducer/whitelist";
import { loginStart, loginSuccess, loginError, logout } from "./reducer/login";
import { push } from "connected-react-router";
import { signUpError, signUpStart, signUpSuccess } from "./reducer/signUp";
import axios from "../httpConfig";
import { userDataLoaded, userDataLoadError, userDataLoadStart } from "./reducer/userdata";
import { IOrder, userOrdersLoaded, userOrdersLoadError, userOrdersLoadStart } from "./reducer/userOrders";
import { preferencesLoaded } from "./reducer/preferences";
export interface IInitData {
	categories: [{
		URLName: string,
		name: string, 
		isPublic: boolean
	}]
};
export type TInitAction = PayloadAction<IInitData>;

export const init = createAction<IInitData>(INIT);

export const initialize = () => async (dispatch: AppDispatch, getState: () => AppState) => {

	const initData: Partial<IInitData> = {};

	try {
		const categories = (await axios.get("/api/categories")).data;
		initData.categories = categories;
	}
	catch(e) {
		//Here can be retries
		console.log("Initialization error")
		console.log(e);
		throw e;
	}

	dispatch(init(initData as IInitData));
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
		dispatch(productsLoadStart(nonExistingProducts));

		const rawProducts = await Promise.allSettled(nonExistingProducts.map((productId) => axios.get(`/api/product/${productId}`)));
	
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

	dispatch(categoryLoaded({
		category: categoryName,
		data: {
			done: page === totalPages,
			products: data,
			page,
			sort,
		}
	}))
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
	dispatch(productsLoadStart([id]));

	try {
		const product = (await axios.get(`api/product/${id}`)).data;
		dispatch(productsLoaded([product]));
	}
	catch(e: any) {
		console.log(e);

		dispatch(productsLoadError([
			{
				id,
				error: e as Error
			}
		]));
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
	const productPrice = (productsSelector(state)[productId] as IProduct).price;

	try {
		const incrementedProduct = (await axios.patch("/api/cart", {
			action: "decrement",
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

export const checkoutAction = (checkoutData: {[key: string]: string}) => async (dispatch: AppDispatch) => {
	
	try {
		await axios.post("api/orders", {checkout: checkoutData});
		alert("Thanks for order!");
		dispatch(emptyCart());
	}
	catch(e: any) {
		if(!e.response) throw e;

		alert("Something went wrong. Try again later.")
	}
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

	dispatch(userDataLoadStart);

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

	dispatch(userOrdersLoadStart);

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
	
			if(products[productId]) return order;
	
			dispatch(productsLoadStart([productId]));
	
			try {
				const product = (await axios.get(`/api/product/${productId}`)).data as IProduct;
	
				dispatch(productsLoaded([product]));
	
				return order;
			}
			catch(e: any) {
				dispatch(productsLoadError([{
					id: productId,
					error: e
				}]));
	
				throw(e);
			}
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