import { createAction, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, AppState } from ".";
import { INIT } from "../constants";
import axios from "axios";
import { categoryLoaded, categoryLoadError, categoryLoadStart } from "./reducer/categories";

export interface IInitData {
	categories: [{
		URLName: string,
		name: string, 
		isPublic: boolean
	}]
};
export type TInitAction = PayloadAction<IInitData>;

export const init = createAction<IInitData>(INIT);

export const initialize = () => async (dispatch: AppDispatch, getState: () => AppState) => {
	
	const initData: Partial<IInitData> = {};

	try {
		const categories = (await axios.get("/api/categories")).data;
		initData.categories = categories;
	}
	catch(e) {
		//Here can be retries
		console.log("Initialization error")
		console.log(e);
		throw e;
	}

	dispatch(init(initData as IInitData));
}

interface ICategoryData {
	totalPages: number,
	page: number,
	sort: string,
	data: string[]
}

export const loadCategoryData = (categoryName: string, newSort?: string) => async (dispatch: AppDispatch, getState: () => AppState) => {
	dispatch(categoryLoadStart({category: categoryName}));

	const state = getState();
	const category = state.categories[categoryName];
	const catSort = newSort || category.sort;

	try {
		const categoryData: ICategoryData =  (await axios.get(`/api/categories/${categoryName}?page=${catSort === category.sort ? category.page + 1 : 1}&sort=${catSort}`)).data;
		const { page, totalPages, sort, data } = categoryData;

		dispatch(categoryLoaded({
			category: categoryName,
			data: {
				done: page === totalPages,
				products: data,
				page,
				sort,
			}
		}))
	}
	catch(e) {
		console.log(e);

		dispatch(categoryLoadError({
			category: categoryName,
			error: e as Error
		}))
	}
}