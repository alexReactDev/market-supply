import { combineReducers } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";
import history from "../../history";

import cart from "./cart";
import currency from "./currency";

const rootReducer = combineReducers({
	router: connectRouter(history),
	cart,
	currency,
})

export default rootReducer;