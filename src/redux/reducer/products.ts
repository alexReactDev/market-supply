import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
	error: Error | null
}

export interface IProductLoading {
	id: string,
	loading: true
}

export interface IProductError extends Partial<IProduct> {
	id: string,
	error: Error
}

export interface IState {
	[key: string]: IProduct | IProductLoading | IProductError
}

type TProductsLoadedAction = Omit<IProduct, "loading" | "error">[];

const initialState: IState = {};

const productsSlice = createSlice({
	name: "products",
	initialState,
	reducers: {
		productsLoadStart(state, action: PayloadAction<string[]>) {
			const productsIds = action.payload;

			productsIds.forEach((productId) => {
				state[productId] = {
					id: productId,
					loading: true
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
					error: null
				}
			})
		}
	}
})

export default productsSlice.reducer;

export const { productsLoadStart, productsLoadError, productsLoaded } = productsSlice.actions;