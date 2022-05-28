import { PayloadAction } from "@reduxjs/toolkit";
import { setMenuClosed } from "../reducer/menu";

export default (store: any) => (next: (action: PayloadAction<any>) => any) => (action: PayloadAction<any>) => {
	if(action.type !== "@@router/LOCATION_CHANGE") return next(action);

	window.scrollTo(0, 0);
	store.dispatch(setMenuClosed());
	next(action);
}