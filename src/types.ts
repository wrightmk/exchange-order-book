export const TOGGLE_FEED = "TOGGLE_FEED";
export const KILL_FEED = "KILL_FEED";
export const CHANGE_TICK_SIZE = "CHANGE_TICK_SIZE";

export interface OrderStream {
  asks: Array<number[]>;
  bids: Array<number[]>;
  feed: string;
  numLevels?: number;
  product_id: string;
}

export interface Order {
  [key: number]: { size: number, price: number, total?:number }; 
}

export interface OrderBook {
  asks: Order;
  bids: Order;
  numLevels?: number;
  feed: string;
  product_id: string;
  tickSize?: number
}

export interface WebWorkerPayload {
    type: string;
    ticker?: string;
    killStream?: boolean;
    tickSize?: number
}