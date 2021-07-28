import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { expose, wrap } from "comlink";
import Worker from "worker-loader!./worker";
import {
  CHANGE_TICK_SIZE,
  KILL_FEED,
  Order,
  OrderBook,
  TOGGLE_FEED,
} from "./types";
import Button from "./components/Button";
import Dropdown from "./components/Dropdown";
import Orderbook from "./components/Orderbook";

function App() {
  const [data, setData] = React.useState({
    bids: [],
    asks: [],
    numLevels: 0,
    product_id: "",
    feed: "",
    tickSize: undefined,
    lastTimeStamp: 0,
    asksTotal: 0,
    bidsTotal: 0,
  });
  const [market, setMarket] = useState("PI_XBTUSD");
  const [tickSize, setTickSize] = useState(0.05);

  const [killStream, setKillStream] = React.useState(true);
  const ticker = market === "PI_XBTUSD" ? "PI_ETHUSD" : "PI_XBTUSD";
  const worker = useRef<Worker>();
  const methodOnMainThread = (orderBook: any) => {
    // console.log(a);
    // setData(orderBook);
    setData(Object.freeze(orderBook)); //Freeze orderbook? issue with duplicate book being created
    // alert(a);
  };

  const test = {
    methodOnMainThread,
  };

  useEffect(() => {
    (async () => {
      // setData("loading");
      worker.current = new Worker();
      // const worker = new Worker("./worker", {
      //   name: "randomname",
      //   type: "module",
      // });
      // worker.current.postMessage("Yeoo");
      // worker.current.onmessage = (event) => {
      //   console.log("event from worker", event.data);
      // };
      const { streamInterface } = wrap<import("./types").WebWorker>(
        worker.current as Worker
      );
      console.log(await streamInterface());
      // console.log(await streamInterface({ type: KILL_FEED }));
      expose(test, worker.current);
      // setData(await testfn());
      // worker.current.terminate() TODO:
    })();
  }, []);

  // if (worker && worker.current && data === "loaded") {
  //   setData("loaded");
  // }

  const { streamInterface } = wrap<import("./types").WebWorker>(
    worker.current as Worker
  );
  const handleToggle = () => {
    if (killStream) {
      streamInterface({
        type: TOGGLE_FEED,
        ticker,
        tickSize: ticker === "PI_XBTUSD" ? 0.5 : 0.05,
      });
      setMarket(ticker);
    }
  };

  const handleKill = () => {
    // const { streamInterface } = wrap<import("./worker").WebWorker>(
    //   worker.current as Worker
    // );
    streamInterface({ type: KILL_FEED, ticker, killStream });
    setKillStream(!killStream);
  };

  const handleTicker = (tickSize: number) => {
    // const { streamInterface } = wrap<import("./worker").WebWorker>(
    //   worker.current as Worker
    // );
    streamInterface({ type: CHANGE_TICK_SIZE, tickSize, ticker });
    setTickSize(tickSize);
  };

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {console.log("DATA:", data)}

        <button onClick={() => handleTicker(0.5)}>0.5 XBT</button>
        <button onClick={() => handleTicker(1.0)}>1.0 XBT</button>
        <button onClick={() => handleTicker(2.5)}>2.5 XBT</button>
        <p>----------</p>
        <button onClick={() => handleTicker(0.05)}>0.05 ETH</button>
        <button onClick={() => handleTicker(0.1)}>0.1 ETH</button>
        <button onClick={() => handleTicker(0.25)}>0.25 ETH</button>

        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <Orderbook
        handleToggle={handleToggle}
        handleKill={handleKill}
        handleTicker={handleTicker}
        tickSize={tickSize}
        market={market}
        data={data}
      />
    </div>
  );
}
export type MethodOnMainThread = typeof test;

export default App;
