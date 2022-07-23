import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IDetails {
	description: string
}
export interface IProductDetails {
	id: string,
	loading: boolean,
	error: any,
	details: IDetails
}

interface IState {
	[key: string]: IProductDetails
}

const initialState: IState = {};

interface IProductsDetailsAction {
	id: string
}

interface IProductDetailsErrorAction {
	id: string,
	error: any
}
interface IProductDetailsLoadedAction {
	id: string,
	details: IDetails
}

const productsDetailsSlice = createSlice({
	name: "productDetails",
	initialState,
	reducers: {
		productDetailsLoadStart(state, action: PayloadAction<IProductsDetailsAction>) {
			const { id } = action.payload;

			state[id] = {
				id,
				loading: true,
				error: null,
				details: {
					description: ""
				}
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
				details
			}
		}
	}
})

export default productsDetailsSlice.reducer;

export const { productDetailsLoadStart, productDetailsLoadError, productDetailsLoaded } = productsDetailsSlice.actions;