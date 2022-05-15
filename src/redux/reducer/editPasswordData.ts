import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IState {
	loading: boolean,
	error: any
}

const initialState: IState = {
	loading: false,
	error: null
}

const editPasswordDataSlice = createSlice({
	name: "editPasswordData",
	initialState,
	reducers: {
		editPasswordRequest(state) {
			state.error = null;
			state.loading = true;
		},
		editPasswordFail(state, action: PayloadAction<any>) {
			state.loading = false;
			state.error = action.payload;
		},
		editPasswordSuccess(state) {
			state.loading = false;
		}
	}
})

export default editPasswordDataSlice.reducer;

export const {editPasswordRequest, editPasswordFail, editPasswordSuccess} = editPasswordDataSlice.actions;