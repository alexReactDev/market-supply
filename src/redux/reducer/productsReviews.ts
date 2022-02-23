import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IReview {
	name: string,
	rate: number,
	text: string,
	timestamp: number
}

interface IProductReviews {
	id: string,
	loading: boolean,
	error: Error | null,
	reviews: IReview[]
}

interface IProductReviewsLoading extends Pick<IProductReviews, "id" | "loading"> {};
interface IProductReviewsError extends Pick<IProductReviews, "id" | "error" | "loading"> {};

interface IState {
	[key: string]: IProductReviews | IProductReviewsLoading | IProductReviewsError
}

interface IProductReviewsLoadingAction extends Pick<IProductReviewsLoading, "id"> {};
interface IProductReviewsErrorAction extends Pick<IProductReviewsError, "id" | "error"> {};
interface IProductReviewsLoadedAction extends Omit<IProductReviews, "loading" | "error"> {};

const initialState: IState = {};

const productsReviewsSlice = createSlice({
	name: "productsReviews",
	initialState,
	reducers: {
		productReviewsLoadStart(state, action: PayloadAction<IProductReviewsLoadingAction>) {
			const { id } = action.payload;

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
			const { id, ...data } = action.payload;

			state[id] = {
				...data,
				loading: false,
				error: null,
				id
			}
		}
	}
})

export default productsReviewsSlice.reducer;

export const { productReviewsLoadStart, productReviewsLoadError, productReviewsLoaded } = productsReviewsSlice.actions;