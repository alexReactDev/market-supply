import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ICollection {
	id: number
	name: string,
	url_name: string,
	loading: boolean,
	loaded: boolean,
	page: number,
	sort: string,
	done: boolean,
	error: any,
	products: string[]
}

interface IState {
	[key: string]: ICollection
}

interface ICollectionData {
	id: number,
	name: string,
	url_name: string
}

interface ICollectionLoadAction {
	collection: string,
	sortChanging: boolean | undefined
}

interface ICollectionLoadError {
	collection: string,
	error: any
}

interface ICollectionLoadedAction {
	collection: string,
	page: number,
	sort: string,
	done: boolean,
	data: string[]
}

const initialState: IState = {}

const collectionsSlice = createSlice({
	name: "collections",
	initialState,
	reducers: {
		collectionsListLoaded(state, action: PayloadAction<ICollectionData[]>) {
			const collections = action.payload;

			collections.forEach((col) => {
				state[col.url_name] = {
					...col,
					loading: false,
					loaded: false,
					page: 0,
					sort: "default",
					done: false,
					error: null,
					products: []
				}
			})
		},
		collectionLoadStart(state, action: PayloadAction<ICollectionLoadAction>) {
			const { collection, sortChanging = false } = action.payload;

			state[collection].error = null;
			state[collection].loading = true;

			if(sortChanging) state[collection].products = [];
		},
		collectionLoadError(state, action: PayloadAction<ICollectionLoadError>) {
			const { collection, error } = action.payload;

			state[collection].loading = false;
			state[collection].error = error;
		},
		collectionLoaded(state, action: PayloadAction<ICollectionLoadedAction>) {
			const { collection, page, sort, done, data } = action.payload;

			state[collection].page = page;
			state[collection].sort = sort;
			state[collection].done = done;
			state[collection].products = [
				...state[collection].products,
				...data
			]
		}
	}
})

export default collectionsSlice.reducer;

export const { collectionsListLoaded, collectionLoadStart, collectionLoadError, collectionLoaded } = collectionsSlice.actions;