import { configureStore } from "@reduxjs/toolkit";
import { routerMiddleware } from "connected-react-router";
import history from "../history";
import locationChangeMiddleware from "./middleware/locationChangeMiddleware";
import rootReducer from './reducer';

const setupStore = () => {
	const configuredStore = configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(routerMiddleware(history)).concat(locationChangeMiddleware)
	})

	return configuredStore;
}

export default setupStore;

export type AppStore = ReturnType<typeof setupStore>;
export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore['dispatch'];