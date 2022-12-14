import { combineReducers } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";
import history from "../../history";

import cart from "./cart";
import currency from "./currency";
import categories from "./categories";
import initialized from "./initialized";
import generalError from "./generalError";
import products from "./products";
import productsDetails from "./productsDetails";
import productsReviews from "./productsReviews";
import whitelist from "./whitelist";
import login from "./login";
import signUp from "./signUp";
import userdata from "./userdata";
import preferences from "./preferences";
import userOrders from "./userOrders";
import editProfileData from "./editProfileData";
import editEmailData from "./editEmailData";
import editPasswordData from "./editPasswordData";
import deleteAccountData from "./deleteAccountData";
import checkout from "./checkout";
import search from "./search";
import menu from "./menu";
import folders from "./folders";
import collections from "./collections";
import outlets from "./outlets";
import popup from "./popup";

const rootReducer = combineReducers({
	router: connectRouter(history),
	cart,
	currency,
	categories,
	initialized,
	generalError,
	products,
	productsDetails,
	productsReviews,
	whitelist,
	login,
	signUp,
	userdata,
	preferences,
	userOrders,
	editProfileData,
	editEmailData,
	editPasswordData,
	deleteAccountData,
	checkout,
	search,
	menu,
	folders,
	collections,
	outlets,
	popup
})

export default rootReducer;