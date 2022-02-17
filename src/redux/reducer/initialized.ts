import { createSlice } from "@reduxjs/toolkit";
import { INIT } from "../../constants";

type TState = boolean;

const initialState: TState = false;

const initializedSlice = createSlice({
	name: "initialized",
	initialState,
	reducers: {},
	extraReducers:{
		[INIT]: () => true
	}
})

export default initializedSlice.reducer;