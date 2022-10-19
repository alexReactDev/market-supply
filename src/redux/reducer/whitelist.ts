import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IState {
	loading: boolean,
	loaded: boolean,
	error: any,
	products: string[]
}

const initialState: IState = {
	loading: false,
	loaded: false,
	error: null,
	products: []
}

const whitelistSlice = createSlice({
	name: "whitelist",
	initialState,
	reducers: {
		addToWhitelist(state, action: PayloadAction<string>) {
			const id  = action.payload;

			state.products.push(id);
		},
		removeFromWhitelist(state, action: PayloadAction<string>) {
			const id  = action.payload;

			state.products = state.products.filter((productId) => productId !== id);
		},
		clearWhitelist(state) {
			state.products = [];
		},
		wishlistItemsLoaded(state, action: PayloadAction<string[]>) {
			state.products = [
				...state.products,
				...action.payload
			]
		},
		wishlistProductsLoadStart(state) {
			state.error = null;
			state.loading = true;
		},
		wishlistProductsLoadError(state, action: PayloadAction<any>) {
			state.loading = false;
			state.error = action.payload;
		},
		wishlistProductsLoaded(state) {
			state.loading = false;
			state.loaded = true;
		}
	}
})

export default whitelistSlice.reducer;

export const { addToWhitelist, removeFromWhitelist, clearWhitelist, wishlistItemsLoaded, wishlistProductsLoadStart, wishlistProductsLoadError, wishlistProductsLoaded } = whitelistSlice.actions;