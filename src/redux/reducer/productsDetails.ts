import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IProductDetails {
	id: string,
	loading: boolean,
	error: any,
	details: {
		description: string
	}
}

interface IProductDetailsLoading extends Pick<IProductDetails, "id" | "loading"> {}
interface IProductDetailsError extends Pick<IProductDetails, "id" | "error" | "loading"> {}


interface IState {
	[key: string]: IProductDetails | IProductDetailsLoading | IProductDetailsError
}

const initialState: IState = {};

interface IProductsDetailsAction extends Pick<IProductDetailsLoading, "id"> {}
interface IProductDetailsErrorAction extends Pick<IProductDetailsError, "id" | "error"> {}
interface IProductDetailsLoadedAction extends Omit<IProductDetails, "loading" | "error"> {}

const productsDetailsSlice = createSlice({
	name: "productDetails",
	initialState,
	reducers: {
		productDetailsLoadStart(state, action: PayloadAction<IProductsDetailsAction>) {
			const { id } = action.payload;

			state[id] = {
				id,
				loading: true
			}
		},
		productDetailsLoadError(state, action: PayloadAction<IProductDetailsErrorAction>) {
			const { id, error } = action.payload;

			state[id] = {
				...state[id],
				loading: false,
				error
			}
		},
		productDetailsLoaded(state, action: PayloadAction<IProductDetailsLoadedAction>) {
			const { id, details } = action.payload;

			state[id] = {
				id,
				loading: false,
				error: null,
				details,
			}
		}
	}
})

export default productsDetailsSlice.reducer;

export const { productDetailsLoadStart, productDetailsLoadError, productDetailsLoaded } = productsDetailsSlice.actions;