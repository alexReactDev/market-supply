import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ICategory {
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

const initialState: IState = {
	["clothing"]: {
		page: 1,
		sort: 'default',
		done: false,
		loading: false,
		products: [],
		error: null
	},
	["electronics"]: {
		page: 1,
		sort: 'default',
		done: false,
		loading: false,
		products: [],
		error: null
	},
	["shoes"]: {
		page: 1,
		sort: 'default',
		done: false,
		loading: false,
		products: [],
		error: null
	},
	["watches"]: {
		page: 1,
		sort: 'default',
		done: false,
		loading: false,
		products: [],
		error: null
	},
	["jewellery"]: {
		page: 1,
		sort: 'default',
		done: false,
		loading: false,
		products: [],
		error: null
	},
	["health-and-beauty"]: {
		page: 1,
		sort: 'default',
		done: false,
		loading: false,
		products: [],
		error: null
	},
	["kids-and-babies"]: {
		page: 1,
		sort: 'default',
		done: false,
		loading: false,
		products: [],
		error: null
	},
	["sports"]: {
		page: 1,
		sort: 'default',
		done: false,
		loading: false,
		products: [],
		error: null
	},
	["home-and-garden"]: {
		page: 1,
		sort: 'default',
		done: false,
		loading: false,
		products: [],
		error: null
	},
}

interface ICategoryAction {
	category: string
}

interface ICategoryLoadedAction extends ICategoryAction {
	data: Omit<ICategory, "loading">
}

interface ICategoryErrorAction extends ICategoryAction {
	error: Error
}

const categoriesSlice = createSlice({
	name: "categories",
	initialState,
	reducers: {
		categoryLoadStart(state, action: PayloadAction<ICategoryAction>) {
			const { payload: { category } } = action;

			state[category].loading = true;
		},
		categoryLoadError(state, action: PayloadAction<ICategoryErrorAction>) {
			const { payload: { category, error } } = action;

			state[category].loading = false;
			state[category].error = error;
		},
		categoryLoaded(state, action: PayloadAction<ICategoryLoadedAction>) {
			const { payload: { category, data }} = action;

			state[category] = {
				...data,
				loading: false,
				products: [
					...state[category].products,
					...data.products
				]
			}
		},
	}
})

export default categoriesSlice.reducer;

export const { categoryLoadStart, categoryLoadError, categoryLoaded } = categoriesSlice.actions;