import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IState {
	display: boolean,
	message: string
}

const initialState: IState = {
	display: false,
	message: ""
}

const popupSlice = createSlice({
	name: "popup",
	initialState,
	reducers: {
		displayPopup(state, action: PayloadAction<string>) {
			state.display = true;
			state.message = action.payload;
		},
		hidePopup(state) {
			state.display = false;
			state.message = "";
		}
	}
})

export default popupSlice.reducer;

export const { displayPopup, hidePopup } = popupSlice.actions;