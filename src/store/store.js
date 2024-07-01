import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { bitfinexApi } from "./services/bitfinex";
import { orderbookReducer } from "./reducers/orderbook";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [bitfinexApi.reducerPath]: bitfinexApi.reducer,
    orderbook: orderbookReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(bitfinexApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
