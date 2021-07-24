import { expose, wrap } from "comlink";
import { KILL_FEED, Order, OrderBook, OrderStream, TOGGLE_FEED } from "./types";

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
  private orderBook: OrderBook;
  private subscribe: any;

  constructor(ticker = "PI_XBTUSD") {
    this.orderBook = {
      bids: [],
      asks: [],
      numLevels: undefined,
      product_id: "",
      feed: "",
    };
    this.ticker = ticker;

    this.ws = new WebSocket("wss://www.cryptofacilities.com/ws/v1");

    this.subscribe = () => {
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
        const parsedData: OrderStream = JSON.parse(event.data);
        console.log("Stream:", parsedData);
        switch (parsedData.feed) {
          case "book_ui_1_snapshot":
            this.initializeOrderBook(parsedData);
            break;
          case "book_ui_1":
            this.uppdateOrderBook(parsedData);
            break;

          default:
            break;
        }
        console.log("this.orderBook", this.orderBook);
      };
      this.ws.onclose = () => {
        this.ws.close();
      };
    };
    this.subscribe();
  }

  private initializeOrderBook(parsedData: OrderStream) {
    this.orderBook = {
      ...parsedData,
      asks: this.buildOrderBook(parsedData.asks),
      bids: this.buildOrderBook(parsedData.bids),
    };
  }

  private buildOrderBook(orders: Array<number[]>) {
    const obj: Order = {};
    for (const order of orders) {
      const [price, size] = order;
      obj[price] = { size };
    }
    return obj;
  }

  private uppdateOrderBook(parsedData: OrderStream) {
    if (parsedData.asks) {
      for (const data of parsedData.asks) {
        const [price, size] = data;
        if (price in this.orderBook.asks) {
          if (size === 0) {
            delete this.orderBook.asks[price];
          } else {
            this.orderBook.asks[price] = { size };
          }
        }
      }
    }
    if (parsedData.bids) {
      for (const data of parsedData.bids) {
        const [price, size] = data;
        if (price in this.orderBook.bids) {
          if (size === 0) {
            delete this.orderBook.bids[price];
          } else {
            this.orderBook.bids[price] = { size };
          }
        }
      }
    }
  }

  // then group by ticks, totals etc

  public toggleFeed(ticker?: string) {
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

  private unsubscribe() {
    const subscription = {
      event: "unsubscribe",
      feed: "book_ui_1",
      product_ids: [this.ticker],
    };

    this.ws.send(JSON.stringify(subscription));
  }

  public killFeed(killStream?: boolean) {
    console.log(">>>>>>>Test");
    try {
      if (killStream) {
        console.log("+========= yeoooooo =========");
        this.unsubscribe();
        this.ws.close();
        // clear orderbook state TODO: BUG
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
