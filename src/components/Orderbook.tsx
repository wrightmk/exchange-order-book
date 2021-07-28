import React from "react";
import { OrderBook } from "../types";
import Asks from "./Asks";
import Bids from "./Bids";
import Button from "./Button";
import FooterBar from "./FooterBar";
import HeaderBar from "./HeaderBar";
import { Default, Mobile } from "./Responsive";
import Spread from "./Spread";
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
        <Default>
          <Bids
            bids={data.bids}
            decimalPlace={decimalPlace}
            bidsTotal={data.bidsTotal}
          />
          <Asks
            asks={data.asks}
            decimalPlace={decimalPlace}
            asksTotal={data.asksTotal}
          />
        </Default>
        <Mobile>
          <Asks
            asks={data.asks}
            decimalPlace={decimalPlace}
            asksTotal={data.asksTotal}
          />
          <Mobile>
            <Spread
              asksLowestPrice={data.asksLowestPrice}
              bidsLowestPrice={data.bidsLowestPrice}
            />
          </Mobile>
          <Bids
            bids={data.bids}
            decimalPlace={decimalPlace}
            bidsTotal={data.bidsTotal}
          />
        </Mobile>
      </OrderBookWrapper>
      <FooterBar handleToggle={handleToggle} handleKill={handleKill} />
    </OrderBookContainer>
  );
}
