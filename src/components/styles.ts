import styled, { css } from "styled-components";

// Colors normally in theme.ts file if a bigger project

const white = "white"; // black
const mirage = "#111724"; // black
const cocoaBean = "#411C28"; // depth chart red
const deepTeal = "#003634"; // depth chart green
const guardsmanRed = "#C9000A"; // red
const purpleHeart = "#6035E1"; // purple
const oxfordBlue = "#2E3948"; // dropdown background
const riverBed = "#474E5D"; // table titles
const frenchGray = "#BDC1C8"; // table content
const ghost = "#C8CBD1"; //table content
const deepSea = "#008A5B"; // green orderbook numbers
const crimson = "#DA1E2E"; // red orderbook numbers

// Button.tsx
export const ButtonWrapper = styled.button<{ toggleFeed?: boolean }>`
  background-color: ${(props) =>
    props.toggleFeed ? purpleHeart : guardsmanRed};
  width: 14rem;
  height: 4rem;
  border-radius: 0.5rem;
  padding: 0;
  color: ${white};
  font-size: 1.8rem;
  cursor: pointer;
`;

// Dropdown.tsx
export const DropdownSelect = styled.select`
  background-color: ${oxfordBlue};
  height: 4rem;
  width: 11rem;
  border-radius: 0.75rem;
  color: ${ghost};
  font-size: 1.8rem;
  cursor: pointer;
`;

// Orderbook.tsx
export const OrderBookContainer = styled.div`
  background-color: ${mirage};
  min-height: 60rem;
  /* width: 90rem; */
`;
export const OrderBookWrapper = styled.div`
  display: flex;
  /* border-top: 1px solid ${riverBed};
  border-bottom: 1px solid ${riverBed}; */
`;

// HeaderBar.tsx
export const HeaderBarWrapper = styled.div`
  display: flex;
`;

export const OrderBookH2 = styled.h2`
  font-size: 1.8rem;
  color: ${ghost};
`;

export const OrderBookH3 = styled.h3`
  font-size: 1.5rem;
  color: ${riverBed};
`;

export const HeaderColumnDiv = styled.div<{ start?: boolean; end?: boolean }>`
  flex: 1;
  ${(props) =>
    props.start &&
    css`
      > h2 {
        display: flex;
        padding-left: 2rem;
      }
    `}
  ${(props) =>
    props.end &&
    css`
      > div {
        display: flex;
        padding-right: 2rem;
        justify-content: flex-end;
      }
    `}
`;

// Book.tsx
export const BookTable = styled.table`
  width: 50%;
  /* table-layout: fixed; */
`;

export const BookTh = styled.th`
  color: ${riverBed};
  font-size: 1.5rem;
  text-align: right;
  /* width: 100%; */

  /* background-color: tomato; */
`;

// Bids.tsx
// Asks.tsx
export const TableHeaderDiv = styled.div`
  border-top: 1px solid ${riverBed};
  border-bottom: 1px solid ${riverBed};
`;

const handleTdColor = (type?: string) => {
  switch (type) {
    case "bids":
      return deepSea;
    case "asks":
      return crimson;
    default:
      return ghost;
  }
};

export const WrapperTr = styled.tr`
  position: relative;
  height: 15px;
`;

export const DataTd = styled.td<{ type?: string }>`
  color: ${(props) => handleTdColor(props.type)};
  font-size: 1.4rem;
  font-weight: bold;
  text-align: right;
  width: 100%;
`;

export const DataTr = styled.tr`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1;
`;

// export const DepthVisualizerTr = styled.tr`
//   background-color: tomato;
//   width: 100%;
// `;

export const DepthVisualizerTd = styled.td<{
  type: string;
  // totalWidth: number;
  style: { width: string };
}>`
  will-change: width;

  min-height: 100%;
  background-color: ${(props) =>
    props.type === "bids" ? deepTeal : cocoaBean};
  position: absolute;
  border-width: 0;
  right: 0;
  left: ${(props) => (props.type === "bids" ? "unset" : 0)};
`;
// /* width: ${(props) => props.totalWidth}%; */
