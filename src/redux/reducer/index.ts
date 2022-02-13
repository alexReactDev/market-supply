import { combineReducers } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";
import history from "../../history";

import cart from "./cart";

const rootReducer = combineReducers({
	router: connectRouter(history),
	cart,
})

export default rootReducer;