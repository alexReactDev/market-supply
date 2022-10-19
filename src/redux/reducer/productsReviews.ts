import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IReview {
	id: number,
	product_id: string
	title: string,
	rate: number,
	text: string,
	timestamp: number
}

export interface IProductReviews {
	id: string,
	loading: boolean,
	loaded: boolean,
	error: any,
	reviews: IReview[]
}

interface IState {
	[key: string]: IProductReviews
}

interface IProductReviewsErrorAction {
	id: string,
	error: any
};

interface IProductReviewsLoadedAction {
	id: string,
	reviews: IReview[]
};

const initialState: IState = {};

const productsReviewsSlice = createSlice({
	name: "productsReviews",
	initialState,
	reducers: {
		productReviewsLoadStart(state, action: PayloadAction<string>) {
			const id = action.payload;

			state[id] = {
				id,
				loading: true,
				loaded: false,
				error: null,
				reviews: []
			}
		}, 
		productReviewsLoadError(state, action: PayloadAction<IProductReviewsErrorAction>) {
			const { id, error } = action.payload;

			state[id].error = error;
			state[id].loading = false;
		},
		productReviewsLoaded(state, action: PayloadAction<IProductReviewsLoadedAction>) {
			const { id, reviews } = action.payload;

			state[id].loading = false;
			state[id].loaded = true;
			state[id].reviews = reviews;
		}
	}
})

export default productsReviewsSlice.reducer;

export const { productReviewsLoadStart, productReviewsLoadError, productReviewsLoaded } = productsReviewsSlice.actions;