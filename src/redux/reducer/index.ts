import { combineReducers } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";
import history from "../../history";

import cart from "./cart";
import currency from "./currency";
import categories from "./categories";
import initialized from "./initialized";
import products from "./products";
import productsDetails from "./productsDetails";
import productsReviews from "./productsReviews";
import whitelist from "./whitelist";
import login from "./login";

const rootReducer = combineReducers({
	router: connectRouter(history),
	cart,
	currency,
	categories,
	initialized,
	products,
	productsDetails,
	productsReviews,
	whitelist,
	login
})

export default rootReducer;