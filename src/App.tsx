import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { expose, wrap } from "comlink";
import Worker from "worker-loader!./worker";
import { KILL_FEED, TOGGLE_FEED } from "./types";

function App() {
  const [data, setData] = React.useState("");
  const [market, setMarket] = useState("PI_XBTUSD");
  const [killStream, setKillStream] = React.useState(true);
  const ticker = market === "PI_XBTUSD" ? "PI_ETHUSD" : "PI_XBTUSD";
  const worker = useRef<Worker>();
  const methodOnMainThread = (a: any) => {
    alert(a);
  };

  const test = {
    methodOnMainThread,
  };

  useEffect(() => {
    (async () => {
      setData("loading");
      worker.current = new Worker();
      // const worker = new Worker("./worker", {
      //   name: "randomname",
      //   type: "module",
      // });
      // worker.current.postMessage("Yeoo");
      // worker.current.onmessage = (event) => {
      //   console.log("event from worker", event.data);
      // };
      const { testfn, streamInterface } = wrap<import("./worker").TestWorker>(
        worker.current as Worker
      );
      console.log(await streamInterface());
      // console.log(await streamInterface({ type: KILL_FEED }));
      // expose(test, worker.current);
      // setData(await testfn());
      // worker.current.terminate() TODO:
    })();
  }, []);

  // if (worker && worker.current && data === "loaded") {
  //   setData("loaded");
  // }

  const handleToggle = () => {
    const { streamInterface } = wrap<import("./worker").TestWorker>(
      worker.current as Worker
    );
    streamInterface({
      type: TOGGLE_FEED,
      ticker,
    });
    setMarket(ticker);
  };

  const handleKill = () => {
    const { streamInterface } = wrap<import("./worker").TestWorker>(
      worker.current as Worker
    );
    streamInterface({ type: KILL_FEED, ticker, killStream });
    setKillStream(!killStream);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {console.log("DATA:", data)}
        <button onClick={handleToggle}>Toggle</button>

        <button onClick={handleKill}>kill stream</button>

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
      </header>
    </div>
  );
}
export type MethodOnMainThread = typeof test;

export default App;
