import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface ICollection {
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
	collection: string
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
			const { collection } = action.payload;

			state[collection].error = null;
			state[collection].loading = true;
		},
		collectionLoadError(state, action: PayloadAction<ICollectionLoadError>) {
			const { collection, error } = action.payload;

			state[collection].loading = false;
			state[collection].error = error;
		},
		collectionLoaded(state, action: PayloadAction<ICollectionLoadedAction>) {
			const { collection, page, sort, done, data } = action.payload;

			const col = state[collection];
			
			col.page = page;
			col.sort = sort;
			col.done = done;
			col.loading = false;
			col.loaded = true;
			col.error = null;
			col.products = [...data]
		},
		collectionDataLoaded(state, action: PayloadAction<ICollectionLoadedAction>) {
			const { collection, page, sort, done, data } = action.payload;

			const col = state[collection];
			
			col.page = page;
			col.sort = sort;
			col.done = done;
			col.loading = false;
			col.loaded = true;
			col.error = null;
			col.products = [
				...col.products,
				...data
			]
		}
	}
})

export default collectionsSlice.reducer;

export const { collectionsListLoaded, collectionLoadStart, collectionLoadError, collectionLoaded, collectionDataLoaded } = collectionsSlice.actions;