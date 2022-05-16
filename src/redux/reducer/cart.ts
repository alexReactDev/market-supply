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
	productId: string,
	productPrice: number
}

interface IPayloadWithAmount extends IPayload {
	amount: number
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
		productIncrement(state, action: PayloadAction<IPayloadWithAmount>) {
			const { productId, productPrice, amount } = action.payload;
			
			state.products[productId] = (state.products[productId] || 0) + amount;
			state.total = state.total + productPrice * amount;
		},
		productDecrement(state, action: PayloadAction<IPayloadWithAmount>) {
			const { productId, productPrice } = action.payload;
			let { amount } = action.payload;

			if(amount > state.products[productId]) amount = state.products[productId];

			state.total = state.total - productPrice * amount;
			state.products[productId] = state.products[productId] - amount;
			if(state.products[productId] <= 0) delete state.products[productId];
		},
		removeProduct(state, action: PayloadAction<IPayload>) {
			const { productId, productPrice } = action.payload;

			state.total = state.total - productPrice * state.products[productId];
			delete state.products[productId];
		},
		emptyCart(state) {
			state.total = 0;
			state.products = {};
		},
		cartItemsLoaded(state, action: PayloadAction<ICartItemsLoadedPayload>) {
			const {total, products} = action.payload;

			state.products = {
				...state.products,
				...products
			}

			state.total += total;
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