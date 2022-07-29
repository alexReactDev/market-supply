import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICartProducts {
	[key: string]: number
}
interface IState {
	loading: boolean,
	loaded: boolean,
	error: any,
	total: number,
	products: ICartProducts
}

interface IPayload {
	total: number,
	products: ICartProducts
}

interface ICartItemsLoadedPayload {
	total: number,
	products: ICartProducts
}

const initialState: IState = {
	loading: false,
	loaded: false,
	error: null,
	total: 0,
	products: {}
}

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		productIncrement(state, action: PayloadAction<IPayload>) {
			const { products, total } = action.payload;
			
			state.products = products;
			state.total = total;
		},
		productDecrement(state, action: PayloadAction<IPayload>) {
			const { products, total } = action.payload;

			state.products = products;
			state.total = total;
		},
		removeProduct(state, action: PayloadAction<IPayload>) {
			const { products, total } = action.payload;

			state.products = products;
			state.total = total;
		},
		emptyCart(state) {
			state.total = 0;
			state.products = {};
		},
		cartItemsLoaded(state, action: PayloadAction<ICartItemsLoadedPayload>) {
			const {total, products} = action.payload;

			state.products = products;
			state.total = total;
		},
		cartProductsLoadStart(state) {
			state.error = null;
			state.loading = true;
		},
		cartProductsLoadError(state, action: PayloadAction<any>) {
			state.loading = false;
			state.error = action.payload;
		},
		cartProductsLoaded(state) {
			state.loading = false;
			state.loaded = true;
		}
	}
})

export default cartSlice.reducer;

export const {productIncrement, productDecrement, removeProduct, emptyCart, cartItemsLoaded, cartProductsLoadStart, cartProductsLoadError, cartProductsLoaded} = cartSlice.actions;