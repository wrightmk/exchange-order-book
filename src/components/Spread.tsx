import React from "react";
import { HeaderColumnDiv, OrderBookH3 } from "./styles";

interface Props {
  asksLowestPrice: number;
  bidsLowestPrice: number;
}

export default function Spread({ asksLowestPrice, bidsLowestPrice }: Props) {
  const spread = Math.abs(asksLowestPrice - bidsLowestPrice).toFixed(1);
  const percentSpread =
    (Number(spread) / (bidsLowestPrice + asksLowestPrice / 2)) * 100 || 0;
  return (
    <HeaderColumnDiv>
      <OrderBookH3>
        Spread: {spread} ({percentSpread.toFixed(2)}%)
      </OrderBookH3>
    </HeaderColumnDiv>
  );
}
