import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IState {
	loading: boolean,
	error: any
}

const initialState: IState = {
	loading: false,
	error: null
}

const deleteAccountDataSlice = createSlice({
	name: "deleteAccountData",
	initialState,
	reducers: {
		deleteAccountRequest(state) {
			state.error = null;
			state.loading = true;
		},
		deleteAccountFail(state, action: PayloadAction<any>) {
			state.loading = false;
			state.error = action.payload;
		},
		deleteAccountSuccess(state) {
			state.loading = false;
		}
	}
})

export default deleteAccountDataSlice.reducer;

export const {deleteAccountRequest, deleteAccountFail, deleteAccountSuccess} = deleteAccountDataSlice.actions;