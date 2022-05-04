import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IState {
	loggedIn: boolean,
	error: string | null,
	loading: boolean
}

const initialState: IState = {
	loggedIn: false,
	error: null,
	loading: false
}

interface IErrorAction {
	error: string
}

const loginSlice = createSlice({
	name: "login",
	initialState,
	reducers: {
		loginStart(state) {
			state.loading = true;
			state.error = null
		},
		loginError(state, action: PayloadAction<IErrorAction>) {
			const {error} = action.payload;

			state.loading = false;
			state.error = error;
		},
		loginSuccess(state) {
			state.loading = false;
			state.loggedIn = true;
		},
		logout(state) {
			state.loggedIn = false;
		}
	}
})

export default loginSlice.reducer;

export const {loginStart, loginError, loginSuccess, logout} = loginSlice.actions;