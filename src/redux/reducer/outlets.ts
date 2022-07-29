import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IOutlet {
	id: number,
	address: string,
	schedule: string,
	phone: string
}

interface IState {
	loading: boolean,
	loaded: boolean,
	error: any,
	outlets: IOutlet[]
}

const initialState: IState = {
	loading: false,
	loaded: false,
	error: null,
	outlets: []
}

const outletsSlice = createSlice({
	name: "outlets",
	initialState,
	reducers: {
		outletsLoadStart(state) {
			state.error = null;
			state.loading = true;
		},
		outletsLoadError(state, action: PayloadAction<any>) {
			state.loading = false;
			state.error = action.payload;
		},
		outletsLoadSuccess(state, action: PayloadAction<IOutlet[]>) {
			state.loading = false;
			state.loaded = true;
			state.outlets = action.payload;
		}
	}
})

export default outletsSlice.reducer;

export const { outletsLoadStart, outletsLoadError, outletsLoadSuccess } = outletsSlice.actions;