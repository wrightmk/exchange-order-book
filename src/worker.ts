import { expose, wrap } from "comlink";
import { time } from "console";
import {
  CHANGE_TICK_SIZE,
  KILL_FEED,
  Order,
  OrderBook,
  OrderStream,
  TOGGLE_FEED,
  WebWorkerPayload,
} from "./types";

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

// Remaining things todo:
// TODO: add totalbids , totalAsks
// TODO: send data back to front end
// TOOD: build UI

class WebSocketStream {
  private ws: WebSocket;
  private ticker: string | undefined;
  private orderBook: OrderBook;
  private modifiedOrderBook: OrderBook;
  private subscribe: () => void;
  private tickSize: number;
  private decimalPrecision: number;
  private normalizedOrderBook: OrderBook;
  private lastTimeStamp: number;
  private throttleAmount: number;

  constructor(ticker = "PI_XBTUSD", tickSize = 0.5) {
    this.normalizedOrderBook = {
      bids: [],
      asks: [],
      numLevels: undefined,
      product_id: "",
      feed: "",
      tickSize: undefined,
      lastTimeStamp: 0,
    };

    this.orderBook = this.normalizedOrderBook;
    this.modifiedOrderBook = this.normalizedOrderBook;
    this.ticker = ticker;
    this.tickSize = tickSize;
    const unixTimeStamp = Date.now();
    this.lastTimeStamp = unixTimeStamp;
    this.throttleAmount = 3000;

    this.decimalPrecision = countDecimals(this.tickSize);

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
        // console.log("Stream:", parsedData);
        switch (parsedData.feed) {
          case "book_ui_1_snapshot":
            this.initializeOrderBook(parsedData, this.tickSize); //TODO: remove instance variables as arguments
            break;
          case "book_ui_1":
            this.uppdateOrderBook(parsedData, this.tickSize);
            break;

          default:
            break;
        }
      };
      this.ws.onclose = () => {
        this.ws.close();
      };
    };
    this.subscribe();
  }

  // then group by ticks, totals etc

  public toggleFeed(ticker: string, tickSize: number) {
    console.log(">>>>>>>>>>>>>>>>>", ticker, tickSize, ">>>>>>>>>>>>>");
    this.unsubscribe();

    this.tickSize = tickSize;
    this.decimalPrecision = countDecimals(tickSize);
    this.ticker = ticker;

    /**
     * @description
     * Resubscribe using initial websocket connection
     */
    const subscription = {
      event: "subscribe",
      feed: "book_ui_1",
      product_ids: [ticker],
    };
    this.ws.send(JSON.stringify(subscription));
  }

  public killFeed(killStream?: boolean) {
    try {
      if (killStream) {
        console.log("+========= y12eoooossoo =========");
        this.unsubscribe();
        this.ws.close();
        // this.orderBook = this.normalizedOrderBook;
        // this.modifiedOrderBook = this.normalizedOrderBook;
        throw "Killed Feed";
      }
      this.subscribe();
    } catch (e) {
      console.log(e);
    }
  }

  public changeTickSize(tickSize: number) {
    this.tickSize = tickSize;
    this.decimalPrecision = countDecimals(tickSize);
    this.groupOrderBook(tickSize);
  }

  private initializeOrderBook(parsedData: OrderStream, tickSize: number) {
    // TODO: groupOrderBook here too
    console.log(
      "this.buildOrderBook(parsedData.asks)",
      this.buildOrderBook(parsedData.asks)
    );
    this.orderBook = {
      ...parsedData,
      tickSize,
      lastTimeStamp: this.lastTimeStamp,
      asks: this.buildOrderBook(parsedData.asks),
      bids: this.buildOrderBook(parsedData.bids),
      // totalBids might need this for the depth visualizer TODO:
      // todalAsks
    };
    this.modifiedOrderBook = this.orderBook;
    console.log(
      "this.modifiedOrderBook in initializeORderBook",
      this.modifiedOrderBook
    );
  }

  private buildOrderBook(orders: Array<number[]>) {
    let total = 0;
    const obj: Order = {};
    for (const order of orders) {
      const [price, size] = order;
      const precisePrice = Number(
        getFlooredFixed(price, this.decimalPrecision)
      );
      total += size;
      obj[precisePrice] = {
        size,
        price: precisePrice,
        total,
      };
    }
    return obj;
    // return {obj, total}; TODO:????
  }

  private uppdateOrderBook(parsedData: OrderStream, tickSize: number) {
    this.orderBook.feed = parsedData.feed;
    const precisePrice = (price: number) =>
      Number(getFlooredFixed(price, this.decimalPrecision));

    if (parsedData.asks) {
      for (const data of parsedData.asks) {
        const [price, size] = data;

        if (size === 0) {
          delete this.orderBook.asks[precisePrice(price)];
        } else {
          this.orderBook.asks[precisePrice(price)] = {
            size,
            price: precisePrice(price),
          };
        }
      }
    }
    if (parsedData.bids) {
      for (const data of parsedData.bids) {
        const [price, size] = data;
        if (size === 0) {
          delete this.orderBook.bids[precisePrice(price)];
        } else {
          this.orderBook.bids[precisePrice(price)] = {
            size,
            price: precisePrice(price),
          };
        }
      }
    }
    this.groupOrderBook(tickSize);
    this.updateFrontend();
  }

  private unsubscribe() {
    const subscription = {
      event: "unsubscribe",
      feed: "book_ui_1",
      product_ids: [this.ticker],
    };
    this.orderBook = this.normalizedOrderBook;
    this.modifiedOrderBook = this.normalizedOrderBook;

    this.ws.send(JSON.stringify(subscription));
  }

  private groupOrderBook(tickSize: number) {
    const bids = this.groupByTickSize(tickSize, this.orderBook.bids);
    const asks = this.groupByTickSize(tickSize, this.orderBook.asks);

    const newTimeStamp = Date.now();

    this.modifiedOrderBook = {
      ...this.orderBook,
      tickSize,
      lastTimeStamp: newTimeStamp,
      asks: this.buildOrderBook(asks),
      bids: this.buildOrderBook(bids),
    };
  }

  private updateFrontend() {
    if (
      this.modifiedOrderBook.lastTimeStamp >
      this.lastTimeStamp + this.throttleAmount
    ) {
      const newTimeStamp = Date.now();

      this.modifiedOrderBook = {
        ...this.modifiedOrderBook,
        lastTimeStamp: newTimeStamp,
      };
      this.lastTimeStamp = newTimeStamp;

      // @return to frontend?? or handle this somewhere more appropriate TODO:

      console.log("this.modifisedOrderBook>>", this.modifiedOrderBook);
    }
  }

  private groupByTickSize(tickSize: number, orderType: Order): Array<number[]> {
    let lastPrice = 0;
    let aggregatedSize = 0;
    const resultsArr = [];

    const sortedOrders = Object.values(orderType).sort((a, b) => {
      return a.price - b.price;
    });

    for (const order of sortedOrders) {
      const { price, size } = order;
      const roundedDownPrice = Math.floor(price / tickSize) * tickSize;
      if (lastPrice === 0 || lastPrice === roundedDownPrice) {
        aggregatedSize += size;
      } else {
        resultsArr.push([lastPrice, aggregatedSize]);
        aggregatedSize = size;
      }
      lastPrice = roundedDownPrice;
    }
    return resultsArr;
  }
}

// Utilitiy functions

const getFlooredFixed = (value: number, decimal: number) => {
  return (
    Math.floor(value * Math.pow(10, decimal)) / Math.pow(10, decimal)
  ).toFixed(decimal);
};

const countDecimals = (value: number): number => {
  if (Math.floor(value.valueOf()) === value.valueOf()) return 0;
  return value.toString().split(".")[1].length || 0;
};

//

const dataStream = new WebSocketStream();

const streamInterface = (payload?: WebWorkerPayload) => {
  if (payload) {
    switch (payload.type) {
      case TOGGLE_FEED:
        if (payload.tickSize && payload.ticker) {
          dataStream.toggleFeed(payload.ticker, payload.tickSize);
        }
        break;
      case KILL_FEED:
        dataStream.killFeed(payload.killStream);
        break;
      case CHANGE_TICK_SIZE:
        if (payload.tickSize && payload.ticker) {
          dataStream.changeTickSize(payload.tickSize);
        }
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
