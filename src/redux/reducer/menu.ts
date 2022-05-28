import { createSlice } from "@reduxjs/toolkit"

interface IState {
	isOpen: boolean
}

const initialState: IState = {
	isOpen: false
}

const menuSlice = createSlice({
	name: "menu",
	initialState,
	reducers: {
		setMenuOpen(state) {
			state.isOpen = true;
		},
		setMenuClosed(state) {
			state.isOpen = false
		}
	}
})

export default menuSlice.reducer;

export const { setMenuOpen, setMenuClosed } = menuSlice.actions;