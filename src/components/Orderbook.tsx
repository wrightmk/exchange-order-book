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
  const highestTotalInBook = Math.max(data.asksTotal, data.bidsTotal);

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
            highestTotalInBook={highestTotalInBook}
          />
          <Asks
            asks={data.asks}
            decimalPlace={decimalPlace}
            highestTotalInBook={highestTotalInBook}
          />
        </Default>
        <Mobile>
          <Asks
            asks={data.asks}
            decimalPlace={decimalPlace}
            highestTotalInBook={highestTotalInBook}
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
            highestTotalInBook={highestTotalInBook}
          />
        </Mobile>
      </OrderBookWrapper>
      <FooterBar handleToggle={handleToggle} handleKill={handleKill} />
    </OrderBookContainer>
  );
}
