import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const socket = new WebSocket("wss://api-pub.bitfinex.com/ws/2");

// const socketConnected = new Promise((resolve) => {
//   socket.addEventListener("open", (event) => {
//     resolve();
//   });
// });

// Define a service using a base URL and expected endpoints
export const bitfinexApi = createApi({
  reducerPath: "bitfinexApi",
  baseQuery() {},
  endpoints: (builder) => ({
    // getOrderBook: builder.mutation({
    //   async queryFn(channelConfig) {
    //     await socketConnected;
    //     socket.send({
    //       event: "subscribe",
    //       channel: "book",
    //       symbol: "tBTCUSD",
    //     });
    //   },
    //   async onCacheEntryAdded(
    //     arg,
    //     { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
    //   ) {
    //     const listener = (activity) => {
    //       updateCachedData((draft) => {
    //         draft.push(activity);
    //       });
    //     };
    //   },
    // }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
// export const { useGetPokemonByNameQuery } = bitfinexApi;
