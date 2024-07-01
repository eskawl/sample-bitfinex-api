import { configureStore } from "@reduxjs/toolkit";
import { orderbookReducer } from "./reducers/orderbook";

export const store = configureStore({
  reducer: {
    orderbook: orderbookReducer,
  },
});
