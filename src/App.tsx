import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { wrap } from "comlink";
import Worker from "worker-loader!./worker";

function App() {
  const [data, setData] = React.useState("");

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {console.log("DATA:", data)}
        <button
          onClick={async () => {
            setData("loading");
            const worker = new Worker();
            // const worker = new Worker("./worker", {
            //   name: "randomname",
            //   type: "module",
            // });
            const { testfn } = wrap<import("./worker").TestWorker>(worker);
            setData(await testfn());
          }}
        >
          click
        </button>
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

export default App;
