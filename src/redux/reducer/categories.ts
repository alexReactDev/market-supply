import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface ICategory {
	id: number,
	name: string, // foldername/categoryname
	url_name: string,
	folder_id: number,
	page: number,
	sort: string,
	done: boolean,
	loading: boolean,
	loaded: boolean,
	products: string[],
	error: any
}

interface IState {
	[key: string]: ICategory
}

const initialState: IState = {}
interface ICategoryAction {
	category: string
}

export interface ICategoryInitialData {
	id: number,
	name: string,
	url_name: string,
	internalName: string,
	category_id: number
}

interface ICategoryLoadedAction {
	category: string,
	page: number,
	sort: string,
	done: boolean,
	data: string[]
}

interface ICategoryErrorAction extends ICategoryAction {
	error: any
}

const categoriesSlice = createSlice({
	name: "categories",
	initialState,
	reducers: {
		categoriesListLoaded(state, action: PayloadAction<ICategoryInitialData[]>) {
			const categories = action.payload;

			categories.forEach((cat) => {
				const { internalName, category_id, ...data } = cat;

				state[internalName] = {
					...data,
					folder_id: category_id,
					page: 0,
					sort: "default",
					done: false,
					loading: false,
					loaded: false,
					products: [],
					error: null,
				}
			})
		},
		categoryLoadStart(state, action: PayloadAction<ICategoryAction>) {
			const { category } = action.payload;

			state[category].loading = true;
		},
		categoryLoadError(state, action: PayloadAction<ICategoryErrorAction>) {
			const { category, error } = action.payload;

			state[category].loading = false;
			state[category].error = error;
			state[category].page = 0;
		},
		categoryLoaded(state, action: PayloadAction<ICategoryLoadedAction>) {
			const { category, page, sort, done, data } = action.payload;

			const cat = state[category];

			cat.page = page;
			cat.sort = sort;
			cat.done = done;
			cat.error = null;
			cat.loading = false;
			cat.loaded = true;
			cat.products = [...data]
		},
		categoryDataLoaded(state, action: PayloadAction<ICategoryLoadedAction>) {
			const { category, page, sort, done, data } = action.payload;

			const cat = state[category];

			cat.page = page;
			cat.sort = sort;
			cat.done = done;
			cat.error = null;
			cat.loading = false;
			cat.loaded = true;
			cat.products = [
				...cat.products,
				...data
			]
		}
	}
})

export default categoriesSlice.reducer;

export const { categoriesListLoaded, categoryLoadStart, categoryLoadError, categoryLoaded, categoryDataLoaded } = categoriesSlice.actions;