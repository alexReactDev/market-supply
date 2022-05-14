import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LOGOUT } from "../../constants"

interface IOrder {
	productId: string,
	amount: number,
	total: number,
	deliveryMethod: "pickup" | "delivery",
	paymentMethod: "online" | "onReceive"
}

interface IState {
	loading: boolean,
	done: boolean,
	page: number,
	error: any,
	orders: IOrder[]
}

const initialState: IState = {
	loading: false,
	done: false,
	page: 0,
	error: null,
	orders: []
}

interface ILoadedAction {
	done: boolean,
	page: number,
	orders: IOrder[]
}

const userOrdersSlice = createSlice({
	name: "userOrders",
	initialState,
	reducers: {
		userOrdersLoadStart(state) {
			state.error = null;
			state.loading = true;
		},
		userOrdersLoadError(state, action: PayloadAction<any>) {
			state.loading = false;
			state.error = action.payload;
		},
		userOrdersLoaded(state, action: PayloadAction<ILoadedAction>) {
			const {page, done, orders} = action.payload;

			state.loading = false;
			state.done = done;
			state.page = page;
			state.orders = [
				...state.orders,
				...orders
			]
		},
		newOrder(state, action: PayloadAction<IOrder>) {
			state.orders.unshift(action.payload);
		}
	},
	extraReducers: {
		[LOGOUT]: () => initialState
	}
})

export default userOrdersSlice.reducer;

export const {userOrdersLoadStart, userOrdersLoadError, userOrdersLoaded, newOrder} = userOrdersSlice.actions;