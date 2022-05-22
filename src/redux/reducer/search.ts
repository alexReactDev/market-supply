import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IState {
	search: string,
	page: number,
	done: boolean,
	loading: boolean,
	loaded: boolean,
	error: any,
	result: string[]
}

interface searchDataLoadedAction {
	search: string,
	page: number,
	done: boolean,
	result: string[]
}

const initialState: IState = {
	search: "",
	page: 0,
	done: false,
	loading: false,
	loaded: false,
	error: null,
	result: []
}

const searchSlice = createSlice({
	name: "search",
	initialState,
	reducers: {
		searchRequest(state, action: PayloadAction<string>) {
			state.error = null;
			state.result = [];
			state.search = action.payload;
			state.loading = true;
		},
		searchDataLoading(state) {
			state.loading = true;
		},
		searchDataLoaded(state, action: PayloadAction<searchDataLoadedAction>) {
			const { search, page, done, result } = action.payload;

			state.loaded = true;
			state.loading = false;
			state.search = search;
			state.page = page;
			state.done = done;
			state.result = [
				...state.result,
				...result
			]
		},
		searchError(state, action: PayloadAction<any>) {
			state.loading = false;
			state.error = action.payload;
		}
	}
})

export default searchSlice.reducer;

export const { searchRequest, searchDataLoading, searchDataLoaded, searchError } = searchSlice.actions;