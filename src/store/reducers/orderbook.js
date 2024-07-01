import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  entries: {
    bid: {},
    ask: {},
  },
  connected: false,
};

export const orderbookSlice = createSlice({
  name: "orderbook",
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    updateEntries: (state, action) => {
      for (const entry of action.payload) {
        const [price, count, amount] = entry;

        if (amount > 0) {
          state.entries.bid[price] = {
            count,
            amount,
          };
        } else {
          state.entries.ask[price] = {
            count,
            amount: amount * -1,
          };
        }
      }
    },
    updateEntry: (state, action) => {
      const [price, count, amount] = action.payload;
      if (count === 0) {
        delete state.entries.bid[price];
        delete state.entries.ask[price];
        return;
      }

      if (amount > 0) {
        state.entries.bid[price] = {
          count,
          amount,
        };
      } else if (amount < 0) {
        state.entries.ask[price] = {
          count,
          amount: amount * -1,
        };
      }
    },
  },
});

const waitForOpen = (unopenedSocket) => {
  return new Promise((resolve) => {
    unopenedSocket.addEventListener("open", (event) => {
      resolve();
    });
  });
};

let socket = null;

export const fetchOrderBook = createAsyncThunk(
  "orderbook/fetchOrderBook",
  async (
    channelConfig = {
      event: "subscribe",
      channel: "book",
      symbol: "tBTCUSD",
    },
    { dispatch },
  ) => {
    if (
      !socket ||
      socket.readyState === WebSocket.CLOSED ||
      socket.readyState === WebSocket.CLOSING
    ) {
      // Init socket
      let updatesChannelId = null;

      socket = new WebSocket("wss://api-pub.bitfinex.com/ws/2"); // TODO: Make singleton instance
      socket.addEventListener("message", (wsMessage) => {
        const msgData = JSON.parse(wsMessage.data);
        if (!updatesChannelId) {
          // Wait for subscribe response with channel ID
          const { event: eventName, channel, chanId } = msgData;

          if (eventName === "subscribed" && channel === "book") {
            updatesChannelId = chanId;
          }
        } else {
          // Wait for entries and process them
          const [channelId, updateData] = msgData;

          if (channelId === updatesChannelId) {
            if (Array.isArray(updateData) && Array.isArray(updateData[0])) {
              // This message is a snapshot
              dispatch(updateEntries(updateData));
            } else {
              // This message is an update at a price
              dispatch(updateEntry(updateData));
            }
          }
        }
      });

      await waitForOpen(socket);

      // Emit subscribe to channel
      socket.send(JSON.stringify(channelConfig));
      dispatch(setConnected(true));
    }
  },
);

export const disconnectSocket = createAsyncThunk(
  "orderbook/disconnectSocket",
  async (
    channelConfig = {
      event: "subscribe",
      channel: "book",
      symbol: "tBTCUSD",
    },
    { dispatch },
  ) => {
    if (socket) {
      socket.close();

      // TODO: Maybe await for close?
      dispatch(setConnected(false));
    }
  },
);

export const { updateEntries, updateEntry, setConnected, reset } =
  orderbookSlice.actions;
export const orderbookReducer = orderbookSlice.reducer;
