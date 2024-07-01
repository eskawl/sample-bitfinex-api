import { useDispatch, useSelector } from "react-redux";
import { disconnectSocket, fetchOrderBook } from "./store/reducers/orderbook";
import { useEffect } from "react";
import cx from "classnames";

const OrderBookSegment = ({ entries, title, reversed = false }) => {
  return (
    <div className="orderbook-segment">
      <h5>{title}</h5>
      <div className={cx("orderbook-entries", { reversed })}>
        <div className="orderbook-entries-header">
          <span>Count</span>
          <span>Amount</span>
          {/* <span>Total</span> */}
          <span>Price</span>
        </div>
        {Object.entries(entries).map(([price, info]) => (
          <div key={price} className="orderbook-entry">
            <span>{info.count}</span>
            <span>{info.amount.toFixed(4)}</span>
            {/* <span>{(info.amount * info.count).toFixed(4)}</span> */}
            <span>{Intl.NumberFormat().format(price)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const OrderBook = () => {
  const dispatch = useDispatch();
  const { entries, connected } = useSelector(({ orderbook }) => orderbook);

  const handleConnect = () => {
    dispatch(fetchOrderBook());
  };

  const handleDisconnect = () => {
    dispatch(disconnectSocket());
  };

  return (
    <div className="orderbook">
      <h2>Orderbook</h2>
      <div className="controls">
        <button onClick={handleConnect} disabled={connected}>
          Connect
        </button>
        <button onClick={handleDisconnect} disabled={!connected}>
          Disconnect
        </button>
      </div>
      <div className="orderbook-container">
        <OrderBookSegment entries={entries.bid} title="Bid" />
        <OrderBookSegment entries={entries.ask} title="Ask" reversed />
      </div>
    </div>
  );
};
