import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { USD } from "../../constants";

interface IState {
	currency: string,
	rates: {
		[key: string]: number
	} | null
}

interface IPayloadChangeCurrency {
	newValue: IState['currency']
}

interface IPayloadUpdateRates {
	newRates: IState['rates']
}

const initialState: IState = {
	currency: USD,
	rates: null
}

const currencySlice = createSlice({
	name: 'currency',
	initialState,
	reducers: {
		changeCurrency(state, action: PayloadAction<IPayloadChangeCurrency>) {
			const { newValue } = action.payload;

			state.currency = newValue;
		},
		updateRates(state, action: PayloadAction<IPayloadUpdateRates>) {
			const { newRates } = action.payload;

			state.rates = newRates;
		}
	}
})

export default currencySlice.reducer;

export const { changeCurrency, updateRates } = currencySlice.actions;