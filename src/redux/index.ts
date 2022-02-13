import { configureStore } from "@reduxjs/toolkit";
import rootReducer from './reducer';

const setupStore = () => {
	const configuredStore = configureStore({
		reducer: rootReducer
	})

	return configuredStore;
}

export default setupStore;

export type AppStore = ReturnType<typeof setupStore>;
export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore['dispatch'];