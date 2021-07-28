import React, { Profiler } from "react";
import { Order } from "../types";
import {
  BookTable,
  BookTh,
  DataTd,
  DataTr,
  DepthVisualizerTd,
  TableHeaderDiv,
  WrapperTr,
} from "./styles";

interface Props {
  bids: Order;
  decimalPlace: number;
  bidsTotal: number;
}

const Bids = React.memo(({ bids, decimalPlace, bidsTotal }: Props) => {
  const onRenderCallback = (
    id: any, // the "id" prop of the Profiler tree that has just committed
    phase: any, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration: any, // time spent rendering the committed update
    baseDuration: any, // estimated time to render the entire subtree without memoization
    startTime: any, // when React began rendering this update
    commitTime: any, // when React committed this update
    interactions: any // the Set of interactions belonging to this update
  ) => {
    console.log({
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
      interactions,
    });
  };
  return (
    <BookTable>
      {/* <TableHeaderDiv> */}
      <thead>
        <tr>
          <BookTh>Total</BookTh>
          <BookTh>Size</BookTh>
          <BookTh>Price</BookTh>
        </tr>
      </thead>
      {/* </TableHeaderDiv> */}
      <tbody>
        {Object.values(bids)
          .sort((a, b) => {
            return a.price - b.price;
          })
          .map((d) => (
            <WrapperTr key={d.price}>
              <tr>
                <DepthVisualizerTd
                  type="bids"
                  /**
                   * @description
                   passing this magnitude of change to js-in-css (styled components) breaks the UI, inline style fixes it
                   */
                  style={{ width: `${(d.total / bidsTotal) * 100}%` }}
                />
              </tr>
              <DataTr>
                <DataTd>{d?.total.toLocaleString()}</DataTd>
                <DataTd>{d?.size.toLocaleString()}</DataTd>
                <DataTd type="bids">
                  {d?.price.toFixed(decimalPlace).toLocaleString()}
                </DataTd>
              </DataTr>
            </WrapperTr>
          ))}
      </tbody>
    </BookTable>
  );
});

Bids.displayName = "Bids";

export default Bids;
