import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LOGOUT } from "../../constants";

interface IState {
	auto_fill: boolean,
	currency: string
}

const initialState: IState = {
	auto_fill: false,
	currency: "USD"
}

const preferencesSlice = createSlice({
	name: "preferences",
	initialState,
	reducers: {
		preferencesLoaded(state, action: PayloadAction<IState>) {
			return action.payload;
		}
	},
	extraReducers: {
		[LOGOUT]: () => initialState
	}
})

export default preferencesSlice.reducer;

export const {preferencesLoaded} = preferencesSlice.actions;