import React, { useEffect, useRef, useState } from "react";
import { expose, wrap } from "comlink";
import Worker from "worker-loader!./worker";
import { CHANGE_TICK_SIZE, KILL_FEED, TOGGLE_FEED } from "./types";
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
    bidsLowestPrice: 0,
    asksLowestPrice: 0,
  });

  const [market, setMarket] = useState("PI_XBTUSD");
  const [tickSize, setTickSize] = useState(0.05);
  const [killStream, setKillStream] = React.useState(true);
  const ticker = market === "PI_XBTUSD" ? "PI_ETHUSD" : "PI_XBTUSD";
  const worker = useRef<Worker>();

  const methodOnMainThread = (orderBook: any) => {
    setData(Object.freeze(orderBook)); //Freeze orderbook? issue with duplicate book being created
  };

  const mainThread = {
    methodOnMainThread,
  };

  useEffect(() => {
    (async () => {
      worker.current = new Worker();
      expose(mainThread, worker.current);
    })();
    return () => {
      worker.current?.terminate();
    };
  }, []);

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
    streamInterface({ type: KILL_FEED, ticker, killStream });
    setKillStream(!killStream);
  };

  const handleTicker = (tickSize: number) => {
    streamInterface({ type: CHANGE_TICK_SIZE, tickSize, ticker });
    setTickSize(tickSize);
  };

  return (
    <div className="App">
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
