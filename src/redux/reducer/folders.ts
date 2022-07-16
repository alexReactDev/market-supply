import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IFolder {
	id: number,
	name: string,
	url_name: string,
	items: string[]
}

const initialState: IFolder[] = [];

const folderSlice = createSlice({
	name: "folders",
	initialState,
	reducers: {
		foldersLoaded(state, action: PayloadAction<IFolder[]>) {
			return [...action.payload];
		}
	}
})

export default folderSlice.reducer;

export const { foldersLoaded } = folderSlice.actions;