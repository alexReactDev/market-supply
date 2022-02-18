import { combineReducers } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";
import history from "../../history";

import cart from "./cart";
import currency from "./currency";
import categories from "./categories";
import initialized from "./initialized";
import products from "./products";

const rootReducer = combineReducers({
	router: connectRouter(history),
	cart,
	currency,
	categories,
	initialized,
	products,
})

export default rootReducer;