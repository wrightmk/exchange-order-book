import { expose, wrap } from "comlink";
import { CHANGE_TICK_SIZE, KILL_FEED, Order, OrderBook, OrderStream, TOGGLE_FEED, WebWorkerPayload } from "./types";

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
// TODO: install prettier

class WebSocketStream {
  private ws: WebSocket;
  private ticker: string | undefined;
  private orderBook: OrderBook;
  private modifiedOrderBook: OrderBook;
  private subscribe: () => void;
  private tickSize: number;

  constructor(ticker = "PI_XBTUSD", tickSize = 0.5) {
    //TODO: 0.05 eth
    this.orderBook = {
      bids: [],
      asks: [],
      numLevels: undefined,
      product_id: "",
      feed: "",
      tickSize: undefined
    };
    this.modifiedOrderBook = {
      bids: [],
      asks: [],
      numLevels: undefined,
      product_id: "",
      feed: "",
      tickSize: undefined
    };
    this.ticker = ticker;
    this.tickSize = tickSize;

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
            this.initializeOrderBook(parsedData, this.tickSize); //TODO: this.tickSize won't always be 0.5
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

  private initializeOrderBook(parsedData: OrderStream, tickSize: number) {
    // TODO: groupOrderBook here too
    this.orderBook = {
      ...parsedData,
      tickSize,
      asks: this.buildOrderBook(parsedData.asks),
      bids: this.buildOrderBook(parsedData.bids),
      // totalBids might need this for the depth visualizer TODO:
      // todalAsks
    };
    this.modifiedOrderBook = this.orderBook;
  }

//   private mapOrderBookHashToOrderStreamArray(orderBook: OrderBook) {
// // 
//   }

  private buildOrderBook(orders: Array<number[]>) {
    let total = 0;
    const obj: Order = {};
    for (const order of orders) {
      const [price, size] = order;
      total +=size
      obj[price] = { size, price, total };
    }
    return obj;
    // return {obj, total}; TODO:????
  }

  private uppdateOrderBook(parsedData: OrderStream, tickSize: number) {
    this.orderBook.feed = parsedData.feed;
    // TODO: order totals
    if (parsedData.asks) {
      for (const data of parsedData.asks) {
        const [price, size] = data;
        // if (price in this.orderBook.asks) {
          if (size === 0) {
            // console.log(price, size, this.orderBook.asks)
            delete this.orderBook.asks[price];
          } else {
            this.orderBook.asks[price] = { size, price }; 
          }
          
        // }
      }
    }
    if (parsedData.bids) {
      for (const data of parsedData.bids) {
        const [price, size] = data;
        // if (price in this.orderBook.bids) {
          if (size === 0) {
            delete this.orderBook.bids[price];
          } else {
            this.orderBook.bids[price] = { size, price };
          }
        // }
      }
    }
    this.groupOrderBook(tickSize)
    // TODO: update total
  }

  // then group by ticks, totals etc

  public toggleFeed(ticker: string, tickSize: number) {
    
    console.log(">>>>>>>>>>>>>>>>>", ticker, tickSize, ">>>>>>>>>>>>>");
    const unsubscribe = {
      event: "unsubscribe",
      feed: "book_ui_1",
      product_ids: [this.ticker],
    };
    
    this.tickSize = tickSize
    this.ticker = ticker;

    this.ws.send(JSON.stringify(unsubscribe));
    const subscription = {
      event: "subscribe",
      feed: "book_ui_1",
      product_ids: [ticker],
    };
    this.ws.send(JSON.stringify(subscription));
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
        console.log("+========= y12eoooossoo =========");
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

  public changeTickSize(ticker: string, tickSize:number){
    this.tickSize = tickSize;
    this.groupOrderBook(tickSize)
  }

  private groupOrderBook(tickSize:number) {

    //TODO: focus on 0.5 -> 1 first then incorporate the modified orderbook:
    // 
    // TODO: need orderbook (which we currently have. will be referenced in this fn)  
    // TODO: modified orderbook, that is the book that is sent to the front end that is changed based off of original book.
    //  ^ need 2 books so that dropdown can reference correct state when grouping
    
    const bids = this.groupByTickSize(tickSize, this.orderBook.bids)
    const asks = this.groupByTickSize(tickSize, this.orderBook.asks)
      // console.log("GROUPED BIDS", bids)
    // now we have bids and asks shaped by tickSize
  
    // calculate total
  
  
  
  // @return to frontend?? or handle this somewhere more appropriate
  // TODO: add timestamp? something wrong with orders being added when update method is called
    this.modifiedOrderBook = {
      ...this.orderBook,
      tickSize,
      asks: this.buildOrderBook(asks),
      bids: this.buildOrderBook(bids),
    };  
    console.log("this.modifiedOrderBook>>", this.modifiedOrderBook);
  }

  private groupByTickSize(tickSize:number, orderType:Order): Array<number[]> {
    let lastPrice = 0
    let aggregatedSize = 0
    const resultsArr = []

    const sortedOrders = Object.values(orderType).sort((a, b) => {
      return a.price - b.price;
    });

    for (const order of sortedOrders) {
      const {price, size} = order;
      const roundedDownPrice = Math.floor(price / tickSize) * tickSize;
      if (lastPrice === 0 || lastPrice === roundedDownPrice) {
        aggregatedSize += size
      } else {
        resultsArr.push([lastPrice, aggregatedSize])
        aggregatedSize = size;
      }
      lastPrice = roundedDownPrice
      // console.log({resultsArr})


      // console.log("bid", bid, Math.floor(price / tickSize) * tickSize)
      // // Math.floor(bid.price / tickSize) * tickSize
    }
    // console.log("=======")
    return resultsArr;
  }

  // TODO: move publics to top and privates to bottom
}

const dataStream = new WebSocketStream();

const streamInterface = (payload?: WebWorkerPayload) => {
  console.log("hiiiiiii");
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
        console.log({payload}) //TODO:
        if (payload.tickSize && payload.ticker) {
          dataStream.changeTickSize(payload.ticker, payload.tickSize);
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

