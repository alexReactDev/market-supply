import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IState {
	autoFill: boolean
}

const initialState: IState = {
	autoFill: false
}

const preferencesSlice = createSlice({
	name: "preferences",
	initialState,
	reducers: {
		preferencesLoaded(state, action: PayloadAction<IState>) {
			return action.payload;
		}
	}
})

export default preferencesSlice.reducer;

export const {preferencesLoaded} = preferencesSlice.actions;