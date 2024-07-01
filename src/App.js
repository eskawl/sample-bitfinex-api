import "./App.css";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { OrderBook } from "./OrderBook";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <OrderBook />
      </div>
    </Provider>
  );
}

export default App;
