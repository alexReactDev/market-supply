import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IState {
	total: number,
	products: {
		[key: string]: number
	}
}

interface IPayload {
	productId: string,
	productPrice: number
}

interface IPayloadWithAmount extends IPayload {
	amount: number
}

const initialState: IState = {
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
		}
	}
})

export default cartSlice.reducer;

export const {productIncrement, productDecrement, removeProduct} = cartSlice.actions;