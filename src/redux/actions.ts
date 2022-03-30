import { createAction, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, AppState } from ".";
import { INIT } from "../constants";
import { categoryLoaded, categoryLoadError, categoryLoadStart } from "./reducer/categories";
import { IProduct, productsLoaded, productsLoadError, productsLoadStart } from "./reducer/products";
import { productDetailsLoaded, productDetailsLoadError, productDetailsLoadStart } from "./reducer/productsDetails";
import { IReview, productReviewsLoaded, productReviewsLoadError, productReviewsLoadStart } from "./reducer/productsReviews";
import Axios from "axios";
import { productsSelector } from "./selectors";
import { productDecrement, productIncrement, removeProduct } from "./reducer/cart";

const axios = Axios.create({
	baseURL: "http://localhost:3000/"
});
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
		const productDetails = (await axios.get(`/api/product-details/${id}`)).data;
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
		const productReviews = (await axios.get(`/api/product-reviews/${id}`)).data;
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

export const productIncrementAction = (productId: string, amount: number = 1) => (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const productPrice = (productsSelector(state)[productId] as IProduct).price;

	dispatch(productIncrement({
		productId,
		productPrice,
		amount
	}))
}

export const productDecrementAction = (productId: string, amount: number = 1) => (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const productPrice = (productsSelector(state)[productId] as IProduct).price;

	dispatch(productDecrement({
		productId,
		productPrice,
		amount
	}))
}

export const removeProductAction = (productId: string) => (dispatch: AppDispatch, getState: () => AppState) => {
	const state = getState();
	const productPrice = (productsSelector(state)[productId] as IProduct).price;

	dispatch(removeProduct({
		productId,
		productPrice
	}))
}

interface IReviewToPublish extends IReview {
	email: string
}

export const publishReviewAction = (productId: string, review: IReviewToPublish) => async (dispatch: AppDispatch) => {
	
	try {
		const savedReview = (await axios.post(`api/product-reviews/${productId}`, {review})).data;

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