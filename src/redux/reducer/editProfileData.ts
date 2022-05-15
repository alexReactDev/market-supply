import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IState {
	loading: boolean,
	error: any
}

const initialState: IState = {
	loading: false,
	error: null
}

const editProfileDataSlice = createSlice({
	name: "editProfileData",
	initialState,
	reducers: {
		editProfileRequest(state) {
			state.error = null;
			state.loading = true;
		},
		editProfileFail(state, action: PayloadAction<any>) {
			state.loading = false;
			state.error = action.payload;
		},
		editProfileSuccess(state) {
			state.loading = false;
		}
	}
})

export default editProfileDataSlice.reducer;

export const {editProfileRequest, editProfileFail, editProfileSuccess} = editProfileDataSlice.actions;