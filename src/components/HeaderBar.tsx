import React from "react";
import Dropdown from "./Dropdown";
import {
  HeaderBarWrapper,
  HeaderColumnDiv,
  OrderBookH2,
  OrderBookH3,
} from "./styles";

interface Props {
  market: string;
  tickSize: number;
  handleTicker: (arg0: number) => void;
}
// TODO: fix border bottom
export default function DisplayBar({ tickSize, market, handleTicker }: Props) {
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
      <HeaderColumnDiv>
        <OrderBookH3>SPREAD STUFF TODO</OrderBookH3>
      </HeaderColumnDiv>
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
