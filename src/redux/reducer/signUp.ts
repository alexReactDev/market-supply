import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IProps {
	loading: boolean,
	error: string | null
}

const initialState: IProps = {
	loading: false,
	error: null
}

const signUpSlice = createSlice({
	name: "signUp",
	initialState,
	reducers: {
		signUpStart(state) {
			state.error = null;
			state.loading = true;
		},
		signUpError(state, action: PayloadAction<{error: string}>) {
			const {error} = action.payload;

			state.loading = false;
			state.error = error;
		},
		signUpSuccess(state) {
			state.loading = false;
		}
	}
})

export default signUpSlice.reducer;

export const {signUpStart, signUpError, signUpSuccess} = signUpSlice.actions;