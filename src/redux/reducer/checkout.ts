import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IConfirmationDataProduct {
	productId: string,
	amount: number,
	total: number
}

export interface IConfirmationData {
	orderId: string,
	paymentMethod: string,
	deliveryMethod: string,
	total: number,
	products: IConfirmationDataProduct[]
}

interface IState {
	loading: boolean,
	error: any,
	confirmationData: IConfirmationData | null
}

const initialState: IState = {
	loading: false,
	error: null,
	confirmationData: null
}

const checkoutSlice = createSlice({
	name: "checkout",
	initialState,
	reducers: {
		checkoutLoading(state) {
			state.error = null;
			state.confirmationData = null;
			state.loading = true;
		},
		checkoutError(state, action: PayloadAction<any>) {
			state.loading = false;
			state.error = action.payload;
		},
		checkoutConfirmationDataLoaded(state, action: PayloadAction<IConfirmationData>) {
			state.loading = false;
			state.confirmationData = action.payload;
		},
		checkoutConfirmationCanceled(state) {
			state.confirmationData = null
		},
		checkoutSuccess(state) {
			state.loading = false;
		}
	}
})

export default checkoutSlice.reducer;

export const { checkoutLoading, checkoutError, checkoutConfirmationDataLoaded, checkoutConfirmationCanceled, checkoutSuccess} = checkoutSlice.actions;