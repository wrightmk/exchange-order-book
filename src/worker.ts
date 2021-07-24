import { expose, wrap } from "comlink";
import { KILL_FEED, TOGGLE_FEED } from "./types";

function testfn() {
  console.log("hi");
}

const test2 = async () => {
  console.log("test2");
  // $
  const main: any = wrap<import("./App").MethodOnMainThread>(self as any);
  await main.methodOnMainThread(42);
};

test2();

class WebSocketStream {
  private ws: WebSocket;
  private ticker: string | undefined;

  constructor(ticker = "PI_XBTUSD") {
    this.ticker = ticker;
    // const subscribe = {
    //   event: "subscribe",
    //   feed: "book_ui_1",
    //   product_ids: ["PI_XBTUSD"],
    // };
    this.ws = new WebSocket("wss://www.cryptofacilities.com/ws/v1");

    // this.ws.onopen = () => {
    // this.subscribe(ticker);
    // this.ws.send(JSON.stringify(subscribe));
    // };
    const subscription = {
      event: "subscribe",
      feed: "book_ui_1",
      product_ids: [ticker],
    };

    this.ws.onopen = () => {
      console.log("open");
      this.ws.send(JSON.stringify(subscription));
    };

    this.ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      console.log(parsedData);
    };
    this.ws.onclose = () => {
      this.ws.close();
    };
  }

  toggleFeed(ticker?: string) {
    console.log(">>>>>>>>>>>>>>>>>", ticker, ">>>>>>>>>>>>>");
    const unsubscribe = {
      event: "unsubscribe",
      feed: "book_ui_1",
      product_ids: [this.ticker],
    };
    this.ws.send(JSON.stringify(unsubscribe));
    const subscription = {
      event: "subscribe",
      feed: "book_ui_1",
      product_ids: [ticker],
    };
    this.ws.send(JSON.stringify(subscription));
    this.ticker = ticker;
  }

  subscribe() {
    const subscription = {
      event: "subscribe",
      feed: "book_ui_1",
      product_ids: [this.ticker],
    };
    this.ws = new WebSocket("wss://www.cryptofacilities.com/ws/v1");
    this.ws.OPEN;
    this.ws.onopen = () => {
      console.log("open");
      this.ws.send(JSON.stringify(subscription));
    };
    this.ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      console.log(parsedData);
    };
    this.ws.onclose = () => {
      this.ws.close();
    };
  }

  unsubscribe() {
    const subscription = {
      event: "unsubscribe",
      feed: "book_ui_1",
      product_ids: [this.ticker],
    };

    this.ws.send(JSON.stringify(subscription));
  }

  killFeed(killStream?: boolean) {
    console.log(">>>>>>>Test");
    try {
      if (killStream) {
        console.log("+========= yeoooooo =========");
        this.unsubscribe();
        this.ws.close();
        throw "Killed Feed";
      }
      this.subscribe();
    } catch (e) {
      console.log(e);
    }
  }
}

const dataStream = new WebSocketStream();

const streamInterface = (payload?: {
  type: string;
  ticker?: string;
  killStream?: boolean;
}) => {
  console.log("hiiiiiii");
  if (payload) {
    switch (payload.type) {
      case TOGGLE_FEED:
        dataStream.toggleFeed(payload.ticker);
        break;
      case KILL_FEED:
        dataStream.killFeed(payload.killStream);
        break;
    }
  }
};

const worker = {
  testfn,
  test2,
  streamInterface,
};

export type TestWorker = typeof worker;

expose(worker);
