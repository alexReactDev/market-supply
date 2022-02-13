import { AppState } from ".";

export const cart = (state: AppState) => state.cart;
export const cartTotal = (state: AppState) => cart(state).total;