import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IState {
	products: string[]
}

interface IAction {
	id: string
}

const initialState: IState = {
	products: []
}

const whitelistSlice = createSlice({
	name: "whitelist",
	initialState,
	reducers: {
		addToWhitelist(state, action: PayloadAction<IAction>) {
			const { id } = action.payload;

			state.products.push(id);
		},
		removeFromWhitelist(state, action: PayloadAction<IAction>) {
			const { id } = action.payload;

			state.products = state.products.filter((productId) => productId !== id);
		},
		clearWhitelist(state) {
			state.products = [];
		}
	}
})

export default whitelistSlice.reducer;

export const { addToWhitelist, removeFromWhitelist, clearWhitelist } = whitelistSlice.actions;