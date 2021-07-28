import React from "react";
import { OrderBook } from "../types";
import { BookTable, BookTh } from "./styles";

interface Props {
  bids?: OrderBook;
  data: OrderBook;
  children: React.ReactNode;
}

export default function Book({ bids, data, children }: Props) {
  //   console.log(Object.entries(data));
  return (
    <BookTable>
      {children}
      {/* <thead>
        <tr>
          {bids ? (
            <>
              <BookTh>Total</BookTh>
              <BookTh>Size</BookTh>
              <BookTh>Price</BookTh>
            </>
          ) : (
            <>
              <BookTh>Price</BookTh>
              <BookTh>Size</BookTh>
              <BookTh>Total</BookTh>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {Object.values(data).map((d) => {
          <tr>
            {bids ? (
              <>
                <td>{d?.bids?.total}</td>
                <td>{d?.bids?.size}</td>
                <td>{d?.bids?.price}</td>
              </>
            ) : (
              <>
                <td>{d?.asks?.price}</td>
                <td>{d?.asks?.size}</td>
                <td>{d?.asks?.total}</td>
              </>
            )}
          </tr>;
        })} */}
      {/* {displayRows.map((row) => {
          const { price, size, total } = row;
          const colorSpriteWidth = total / maxPriceSize;
          return (
            <tr
              key={`${askOrBid}-${price}-${ticker}`}
              className={styles.ghostRow}
            >
              {askOrBid === askOrBidOptions.ask.key ? (
                <tr className={styles.colorSprite}>
                  <td className={styles.uncolored(colorSpriteWidth)}></td>
                  <td
                    className={styles.colored(
                      colorSpriteWidth,
                      askOrBidOptions[askOrBid].color
                    )}
                  ></td>
                </tr>
              ) : (
                <tr className={styles.colorSprite}>
                  <td
                    className={styles.colored(
                      colorSpriteWidth,
                      askOrBidOptions[askOrBid].color
                    )}
                  ></td>
                  <td className={styles.uncolored(colorSpriteWidth)}></td>
                </tr>
              )}
              <tr className={styles.row}>
                <td className={styles.cell}>{price}</td>
                <td className={styles.cell}>{size}</td>
                <td className={styles.cell}>{total}</td>
              </tr>
            </tr>
          );
        })} */}
      {/* </tbody> */}
    </BookTable>
  );
}
