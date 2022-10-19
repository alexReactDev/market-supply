import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IReview {
	title: string,
	rate: number,
	text: string,
	timestamp: number
}

export interface IProductReviews {
	id: string,
	loading: boolean,
	error: any,
	reviews: IReview[]
}

interface IProductReviewsLoading extends Pick<IProductReviews, "id" | "loading"> {};
interface IProductReviewsError extends Pick<IProductReviews, "id" | "error" | "loading"> {};

interface IState {
	[key: string]: IProductReviews | IProductReviewsLoading | IProductReviewsError
}

interface IProductReviewsErrorAction extends Pick<IProductReviewsError, "id" | "error"> {};
interface IProductReviewsLoadedAction extends Omit<IProductReviews, "loading" | "error"> {};

const initialState: IState = {};

const productsReviewsSlice = createSlice({
	name: "productsReviews",
	initialState,
	reducers: {
		productReviewsLoadStart(state, action: PayloadAction<string>) {
			const id = action.payload;

			state[id] = {
				id,
				loading: true
			}
		}, 
		productReviewsLoadError(state, action: PayloadAction<IProductReviewsErrorAction>) {
			const { id, error } = action.payload;

			state[id] = {
				...state[id],
				error,
				loading: false
			}
		},
		productReviewsLoaded(state, action: PayloadAction<IProductReviewsLoadedAction>) {
			const { id, reviews: loadedReviews } = action.payload;

			const reviews = [
				...loadedReviews,
				//@ts-ignore
				...state[id].reviews ? state[id].reviews : []
			]

			state[id] = {
				id,
				loading: false,
				error: null,
				reviews,
			}
		}
	}
})

export default productsReviewsSlice.reducer;

export const { productReviewsLoadStart, productReviewsLoadError, productReviewsLoaded } = productsReviewsSlice.actions;