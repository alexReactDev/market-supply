import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { INIT } from "../../constants";
import { TInitAction } from "../actions";

interface ICategory {
	page: number,
	sort: string,
	done: boolean,
	loading: boolean,
	products: string[],
	error: Error | null,
	name: string,
	isPublic: boolean
}

interface IState {
	[key: string]: ICategory
}

const initialState: IState = {}
interface ICategoryAction extends Partial<ICategory> {
	category: string
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
	},
	extraReducers: {
		[INIT](state, action: TInitAction) {
			const categories = action.payload.categories;

			categories.forEach((cat) => {
				state[cat.URLName] = {
					page: 0,
					sort: "default",
					done: false,
					loading: false,
					products: [],
					error: null,
					name: cat.name,
					isPublic: cat.isPublic
				}
			})
		}
	}
})

export default categoriesSlice.reducer;

export const { categoryLoadStart, categoryLoadError, categoryLoaded } = categoriesSlice.actions;