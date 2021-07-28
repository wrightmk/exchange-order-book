import React from "react";
import Dropdown from "./Dropdown";
import { Default } from "./Responsive";
import Spread from "./Spread";
import {
  HeaderBarWrapper,
  HeaderColumnDiv,
  OrderBookH2,
} from "./styles";

interface Props {
  market: string;
  tickSize: number;
  handleTicker: (arg0: number) => void;
  asksLowestPrice: number;
  bidsLowestPrice: number;
}
export default function DisplayBar({
  tickSize,
  market,
  handleTicker,
  asksLowestPrice,
  bidsLowestPrice,
}: Props) {
  const handleDropdownOptions = () => {
    if (market === "PI_XBTUSD") {
      return [0.5, 1, 2.5];
    } else {
      return [0.05, 0.1, 0.25];
    }
  };

  return (
    <HeaderBarWrapper>
      <HeaderColumnDiv start>
        <OrderBookH2>Order Book</OrderBookH2>
      </HeaderColumnDiv>
      <Default>
        <Spread
          asksLowestPrice={asksLowestPrice}
          bidsLowestPrice={bidsLowestPrice}
        />
      </Default>
      <HeaderColumnDiv end>
        <Dropdown
          onChange={handleTicker}
          value={tickSize}
          options={handleDropdownOptions()}
        />
      </HeaderColumnDiv>
    </HeaderBarWrapper>
  );
}
