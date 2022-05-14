import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LOGOUT } from "../../constants";

interface IUserData {
	[key: string]: string,
}

interface IState {
	userId: string | null,
	loading: boolean,
	loaded: boolean,
	error: any,
	userData: IUserData
}

const initialState: IState = {
	userId: null,
	loading: false,
	loaded: false,
	error: null,
	userData: {}
}

const userDataSlice = createSlice({
	name: "userdata",
	initialState,
	reducers: {
		userIdLoaded(state, action: PayloadAction<string>) {
			state.userId = action.payload;
		},
		userDataLoadStart(state) {
			state.error = null;
			state.loading = true;
			state.loaded = false;
		},
		userDataLoadError(state, action: PayloadAction<any>) {
			state.loading = false;
			state.error = action.payload;
		},
		userDataLoaded(state, action: PayloadAction<IUserData>) {
			state.loading = false;
			state.loaded = true;
			state.userData = action.payload;
		}
	},
	extraReducers: {
		[LOGOUT]: () => initialState
	}
})

export default userDataSlice.reducer;

export const {userIdLoaded, userDataLoadStart, userDataLoadError, userDataLoaded} = userDataSlice.actions;