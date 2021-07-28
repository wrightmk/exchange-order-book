// import React from "react";
// import { Order } from "../types";
// import { BookTh, DataTd, DepthVisualizerTd, WrapperTr } from "./styles";

// interface Props {
//   asks: Order;
//   decimalPlace: number;
//   asksTotal: number;
// }

// export default function Asks({ asks, decimalPlace, asksTotal }: Props) {
//   return (
//     <>
//       <thead>
//         <tr>
//           <BookTh>Price</BookTh>
//           <BookTh>Size</BookTh>
//           <BookTh>Total</BookTh>
//         </tr>
//       </thead>
//       <tbody>
//         {Object.values(asks)
//           .sort((a, b) => {
//             return a.price - b.price;
//           })
//           .map((d) => (
//             <tr key={d.price}>
//               <DataTd type="asks">
//                 {d?.price.toFixed(decimalPlace).toLocaleString()}
//               </DataTd>
//               <DataTd>{d?.size.toLocaleString()}</DataTd>
//               <DataTd>{d?.total.toLocaleString()}</DataTd>
//             </tr>
//           ))}
//       </tbody>
//     </>
//   );
// }

import React, { Profiler } from "react";
import { Order } from "../types";
import {
  BookTable,
  BookTh,
  DataTd,
  DataTr,
  DepthVisualizerTd,
  WrapperTr,
} from "./styles";

interface Props {
  asks: Order;
  decimalPlace: number;
  asksTotal: number;
}

const Asks = React.memo(({ asks, decimalPlace, asksTotal }: Props) => {
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
      <thead>
        <tr>
          <BookTh>Price</BookTh>
          <BookTh>Size</BookTh>
          <BookTh>Total</BookTh>
        </tr>
      </thead>
      <tbody>
        {Object.values(asks)
          .sort((a, b) => {
            return a.price - b.price;
          })
          .map((d) => (
            <WrapperTr key={d.price}>
              <tr>
                <DepthVisualizerTd
                  type="asks"
                  /**
                   * @description
                   passing this magnitude of change to js-in-css (styled components) breaks the UI, inline style fixes it
                   */
                  style={{ width: `${(d.total / asksTotal) * 100}%` }}
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
          ))}
      </tbody>
    </BookTable>
  );
});

Asks.displayName = "Asks";

export default Asks;
