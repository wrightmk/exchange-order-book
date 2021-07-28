import React from "react";
import { OrderBook } from "../types";
import Asks from "./Asks";
import Bids from "./Bids";
import Book from "./Book";
import Button from "./Button";
import FooterBar from "./FooterBar";
import HeaderBar from "./HeaderBar";
import { OrderBookContainer, OrderBookWrapper } from "./styles";

interface Props {
  market: string;
  tickSize: number;
  handleToggle: () => void;
  handleKill: () => void;
  handleTicker: (arg0: number) => void;
  data: OrderBook;
}

export default function Orderbook({
  market,
  tickSize,
  handleToggle,
  handleKill,
  handleTicker,
  data,
}: Props) {
  function isInt(n: number) {
    return n % 1 === 0;
  }
  const decimalPlace = !isInt(data.tickSize || 0) ? 2 : 0;
  // TODO calculate spread for headerbar
  return (
    <OrderBookContainer>
      <HeaderBar
        handleTicker={handleTicker}
        tickSize={tickSize}
        market={market}
        asksLowestPrice={data.asksLowestPrice}
        bidsLowestPrice={data.bidsLowestPrice}
      />
      <OrderBookWrapper>
        {/* <Book data={data}> */}
        <Bids
          bids={data.bids}
          decimalPlace={decimalPlace}
          bidsTotal={data.bidsTotal}
        />
        {/* </Book> */}
        {/* <Book data={data}> */}
        <Asks
          asks={data.asks}
          decimalPlace={decimalPlace}
          asksTotal={data.asksTotal}
        />
        {/* </Book> */}
      </OrderBookWrapper>
      <FooterBar handleToggle={handleToggle} handleKill={handleKill} />
    </OrderBookContainer>
  );
}
