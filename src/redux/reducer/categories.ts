import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface ICategory {
	id: number,
	name: string, // foldername/categoryname
	url_name: string,
	category_id: number,
	page: number,
	sort: string,
	done: boolean,
	loading: boolean,
	products: string[],
	error: Error | null
}

interface IState {
	[key: string]: ICategory
}

const initialState: IState = {}
interface ICategoryAction extends Partial<ICategory> {
	category: string
}

export interface ICategoryInitialData {
	id: number,
	name: string,
	url_name: string,
	internalName: string,
	category_id: number
}

interface ICategoryLoadAction extends ICategoryAction {
	sortChanging: boolean
}

interface ICategoryLoadedAction extends ICategoryAction {
	data: Omit<ICategory, "loading" | "isPublic" | "name" | "error">
}

interface ICategoryErrorAction extends ICategoryAction {
	error: Error
}

const categoriesSlice = createSlice({
	name: "categories",
	initialState,
	reducers: {
		categoriesListLoaded(state, action: PayloadAction<ICategoryInitialData[]>) {
			const categories = action.payload;

			categories.forEach((cat) => {
				const { internalName, ...data } = cat;

				state[internalName] = {
					...data,
					page: 0,
					sort: "default",
					done: false,
					loading: false,
					products: [],
					error: null,
				}
			})
		},
		categoryLoadStart(state, action: PayloadAction<ICategoryLoadAction>) {
			const { category, sortChanging } = action.payload;

			state[category].loading = true;
			if(sortChanging) state[category].products = [];
		},
		categoryLoadError(state, action: PayloadAction<ICategoryErrorAction>) {
			const { category, error } = action.payload;

			state[category].loading = false;
			state[category].error = error;
			state[category].page = 0;
		},
		categoryLoaded(state, action: PayloadAction<ICategoryLoadedAction>) {
			const { category, data } = action.payload;

			state[category] = {
				...state[category],
				...data,
				loading: false,
				error: null,
				products: [
					...data.products
				]
			}
		},
	}
})

export default categoriesSlice.reducer;

export const { categoriesListLoaded, categoryLoadStart, categoryLoadError, categoryLoaded } = categoriesSlice.actions;