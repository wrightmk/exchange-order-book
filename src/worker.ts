import { expose, wrap } from "comlink";
import {
  CHANGE_TICK_SIZE,
  KILL_FEED,
  Order,
  OrderBook,
  OrderStream,
  TOGGLE_FEED,
  WebWorkerPayload,
} from "./types";

export class WebSocketStream {
  private ws: WebSocket;
  private ticker: string | undefined;
  private orderBook: OrderBook;
  private modifiedOrderBook: OrderBook;
  private subscribe: () => void;
  private tickSize: number;
  private decimalPrecision: number;
  private normalizedOrderBook: OrderBook;
  private lastTimeStamp: number;
  private timeStampDelay: number;

  constructor(ticker = "PI_XBTUSD", tickSize = 0.5) {
    this.normalizedOrderBook = {
      bids: [],
      asks: [],
      numLevels: 0,
      product_id: "",
      feed: "",
      tickSize: undefined,
      lastTimeStamp: 0,
      asksTotal: 0,
      bidsTotal: 0,
      asksLowestPrice: 0,
      bidsLowestPrice: 0,
    };

    const unixTimeStamp = Date.now();

    this.orderBook = this.normalizedOrderBook;
    this.modifiedOrderBook = this.normalizedOrderBook;
    this.ticker = ticker;
    this.tickSize = tickSize;
    this.lastTimeStamp = unixTimeStamp;
    this.timeStampDelay = 1500;
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
        switch (parsedData.feed) {
          case "book_ui_1_snapshot":
            this.initializeOrderBook(parsedData);
            break;
          case "book_ui_1":
            this.uppdateOrderBook(parsedData);
            this.updateFrontend();
            break;

          default:
            break;
        }
      };
      this.ws.onerror = () => {
        this.ws.close();
      };
      this.ws.onclose = () => {
        this.ws.close();
      };
    };
    this.subscribe();
  }

  public toggleFeed(ticker: string, tickSize: number) {
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
        this.unsubscribe();
        this.ws.close();
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

  private initializeOrderBook(parsedData: OrderStream) {
    const {
      obj: asks,
      total: asksTotal,
      spreadPrice: asksLowestPrice,
    } = this.buildOrderBook(parsedData.asks);
    const {
      obj: bids,
      total: bidsTotal,
      spreadPrice: bidsLowestPrice,
    } = this.buildOrderBook(parsedData.bids);

    this.orderBook = {
      ...parsedData,
      numLevels: parsedData.numLevels || undefined,
      tickSize: this.tickSize,
      lastTimeStamp: this.lastTimeStamp,
      asks,
      bids,
      asksTotal,
      bidsTotal,
      asksLowestPrice,
      bidsLowestPrice,
    };
    this.modifiedOrderBook = this.orderBook;

    this.updateFrontend(true);
  }

  private buildOrderBook(orders: Array<number[]>) {
    let total = 0;
    const obj: Order = {};
    // let count = 0;
    let spreadPrice = 0;

    for (const order of orders) {
      // if (count >= this.orderBook.numLevels) {
      //   /**
      //    * @description
      //    * keep a fixed length order book to match the snapshot numLevels
      //    */
      //   break;
      // }
      const [price, size] = order;
      const precisePrice = Number(
        getFlooredFixed(price, this.decimalPrecision)
      );
      if (!spreadPrice) spreadPrice = price;
      total += size;
      obj[precisePrice] = {
        size,
        price: precisePrice,
        total,
      };
      // count++;
    }
    return { obj, total, spreadPrice };
  }

  private uppdateOrderBook(parsedData: OrderStream) {
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
            total: 0,
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
            total: 0,
          };
        }
      }
    }
    this.groupOrderBook(this.tickSize);
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
    const groupedBids = this.groupByTickSize(
      tickSize,
      this.orderBook.bids,
      true
    );
    const groupedAsks = this.groupByTickSize(tickSize, this.orderBook.asks);

    const newTimeStamp = Date.now();

    const {
      obj: asks,
      total: asksTotal,
      spreadPrice: asksLowestPrice,
    } = this.buildOrderBook(groupedAsks);
    const {
      obj: bids,
      total: bidsTotal,
      spreadPrice: bidsLowestPrice,
    } = this.buildOrderBook(groupedBids);

    this.modifiedOrderBook = {
      ...this.orderBook,
      tickSize,
      lastTimeStamp: newTimeStamp,
      asks,
      bids,
      asksTotal,
      bidsTotal,
      asksLowestPrice,
      bidsLowestPrice,
    };
  }

  private updateFrontend(byPassTimeout = false) {
    if (
      byPassTimeout ||
      this.modifiedOrderBook.lastTimeStamp >
        this.lastTimeStamp + this.timeStampDelay
    ) {
      const newTimeStamp = Date.now();

      this.modifiedOrderBook = {
        ...this.modifiedOrderBook,
        lastTimeStamp: newTimeStamp,
      };
      this.lastTimeStamp = newTimeStamp;

      (async () => {
        const postMessage: any = wrap<import("./App").MethodOnMainThread>(
          self as any
        );
        await postMessage.methodOnMainThread(this.modifiedOrderBook);
      })();
    }
  }

  public groupByTickSize(
    tickSize: number,
    orderType: Order,
    isBidOrder = false
  ): Array<number[]> {
    let lastPrice = 0;
    let aggregatedSize = 0;
    const resultsArr = [];

    const sortedOrders = Object.values(orderType).sort((a, b) => {
      if (isBidOrder) {
        return b.price - a.price;
      }
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

    resultsArr.push([lastPrice, aggregatedSize]);

    return resultsArr;
  }
}

// Utilitiy functions

export const getFlooredFixed = (value: number, decimal: number) => {
  return (
    Math.floor(value * Math.pow(10, decimal)) / Math.pow(10, decimal)
  ).toFixed(decimal);
};

export const countDecimals = (value: number): number => {
  if (Math.floor(value.valueOf()) === value.valueOf()) return 0;
  return value.toString().split(".")[1].length || 0;
};

//

export const dataStream = new WebSocketStream();

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

export const worker = {
  streamInterface,
};

expose(worker);
