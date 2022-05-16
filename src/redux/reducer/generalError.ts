import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = null;

const generalErrorSlice = createSlice({
	name: "generalError",
	initialState,
	reducers: {
		generalError(state, action: PayloadAction<any>) {
			return action.payload;
		}
	}
})

export default generalErrorSlice.reducer;

export const { generalError } = generalErrorSlice.actions;