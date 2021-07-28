import React from "react";
import { Order } from "../types";
import { Default, Mobile } from "./Responsive";
import {
  Table,
  Th,
  DataTd,
  DataTr,
  DepthVisualizerTd,
  WrapperTr,
  TableHeadTr,
} from "./styles";

interface Props {
  asks: Order;
  decimalPlace: number;
  highestTotalInBook: number;
}

const Asks = React.memo(({ asks, decimalPlace, highestTotalInBook }: Props) => {
  const renderTbody = (isMobile?: boolean) =>
    Object.values(asks)
      .sort((a, b) => {
        if (isMobile) {
          return b.price - a.price;
        }
        return a.price - b.price;
      })
      .map((d) => (
        <WrapperTr key={d.price}>
          <tr>
            <DepthVisualizerTd
              type="asks"
              style={{ width: `${(d.total / highestTotalInBook) * 100}%` }}
              /**
               * @description
               passing this magnitude of change to js-in-css (styled components) breaks the UI, inline style fixes it
              */
            />
          </tr>
          <DataTr>
            <DataTd type="asks">
              {d?.price.toFixed(decimalPlace).toLocaleString()}
            </DataTd>
            <DataTd>{d?.size.toLocaleString()}</DataTd>
            <DataTd>{d?.total.toLocaleString()}</DataTd>
          </DataTr>
        </WrapperTr>
      ));

  return (
    <Table>
      <thead>
        <TableHeadTr>
          <Th>Price</Th>
          <Th>Size</Th>
          <Th>Total</Th>
        </TableHeadTr>
      </thead>
      <tbody>
        <Default>{renderTbody()}</Default>
        <Mobile>{renderTbody(true)}</Mobile>
      </tbody>
    </Table>
  );
});

Asks.displayName = "Asks";

export default Asks;
