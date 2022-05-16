import { createSlice } from "@reduxjs/toolkit";

type TState = boolean;

const initialState: TState = false;

const initializedSlice = createSlice({
	name: "initialized",
	initialState,
	reducers: {
		init: () => true
	}
})

export default initializedSlice.reducer;

export const {init} = initializedSlice.actions;