import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IState {
	loading: boolean,
	error: any
}

const initialState: IState = {
	loading: false,
	error: null
}

const editEmailDataSlice = createSlice({
	name: "editEmailData",
	initialState,
	reducers: {
		editEmailRequest(state) {
			state.error = null;
			state.loading = true;
		},
		editEmailFail(state, action: PayloadAction<any>) {
			state.loading = false;
			state.error = action.payload;
		},
		editEmailSuccess(state) {
			state.loading = false;
		}
	}
})

export default editEmailDataSlice.reducer;

export const {editEmailRequest, editEmailFail, editEmailSuccess} = editEmailDataSlice.actions;