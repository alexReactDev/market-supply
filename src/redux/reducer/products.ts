import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

export interface IProduct {
	id: string,
	webId: number,
	name: string,
	price: number,
	oldPrice: number | null,
	rate: number,
	categories: string[],
	isNew: boolean,
	pictures: string[],
	loading: boolean,
	error: any,
	loaded: boolean,
	promise: null | Promise<AxiosResponse<IProduct>>
}

const initialProduct: IProduct = {
	id: "",
	webId: 0,
	name: "",
	price: 0,
	oldPrice: null,
	rate: 0,
	categories: [],
	isNew: false,
	pictures: [],
	loading: false,
	error: null,
	loaded: false,
	promise: null
}

interface IProductError {
	id: string,
	error: any
}

export interface IState {
	[key: string]: IProduct 
}

type TProductsLoadedAction = Omit<IProduct, "loading" | "error">[];

interface IProductLoadData {
	productId: string,
	promise: Promise<AxiosResponse<IProduct>>
}

const initialState: IState = {};

const productsSlice = createSlice({
	name: "products",
	initialState,
	reducers: {
		productsLoadStart(state, action: PayloadAction<IProductLoadData[]>) {
			const products = action.payload;

			products.forEach((productLoadData) => {
				state[productLoadData.productId] = {
					...initialProduct,
					id: productLoadData.productId,
					loading: true,
					promise: productLoadData.promise
				}
			})
		},
		productsLoadError(state, action: PayloadAction<IProductError[]>) {
			const products = action.payload;

			products.forEach(({ id, error }) => {
				state[id] = {
					...state[id],
					loading: false,
					error: error
				}
			})
		},
		productsLoaded(state, action: PayloadAction<TProductsLoadedAction>) {
			const products  = action.payload;

			products.forEach((product) => {
				state[product.id] = {
					...product,
					loading: false,
					error: null,
					promise: null,
					loaded: true
				}
			})
		}
	}
})

export default productsSlice.reducer;

export const { productsLoadStart, productsLoadError, productsLoaded } = productsSlice.actions;