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
  width: 12rem;
  border-radius: 0.75rem;
  color: ${ghost};
  font-size: 1.8rem;
  cursor: pointer;
`;

// Orderbook.tsx
export const OrderBookContainer = styled.div`
  background-color: ${mirage};
  margin: auto;
  min-height: 56rem;
  width: 80%;
  @media screen and (max-width: 767px) {
    width: 100%;
    min-height: 112rem;
  }
`;
export const OrderBookWrapper = styled.div`
  @media screen and (min-width: 768px) {
    display: flex;
  }
  /* min-height: 56rem; */
  /* border-top: 1px solid ${riverBed};
  border-bottom: 1px solid ${riverBed}; */
`;

// HeaderBar.tsx
export const HeaderBarWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid ${riverBed};
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

// Bids.tsx
// Asks.tsx
export const TableHead = styled.thead`
  /* border-top: 1px solid ${riverBed}; */
  /* border-bottom: 1px solid ${riverBed}; */
`;
export const TableHeadTr = styled.tr`
  height: 30px;
  /* border-top: 1px solid ${riverBed}; */
  border-bottom: 1px solid ${riverBed};
`;

export const Table = styled.table`
  width: 50%;

  /* background: pink; */
  /* border: 0; */
  /* border-top: 1px solid ${riverBed}; */
  /* border-bottom: 1px solid ${riverBed}; */
  /* border-collapse: separate; */
  /* border-spacing: 0 5px; */
  > tr {
    display: flex;
    width: 95%;
    /* border-top: 1px solid ${riverBed};
    border-bottom: 1px solid ${riverBed}; */
    > th {
      /* border-collapse: separate;
      border-spacing: 5px 5px; */
      /* border-top: 1px solid ${riverBed};
      border-bottom: 1px solid ${riverBed}; */
      /* border-bottom: 1px solid red; */
    }
  }
  /* table-layout: fixed; */
  @media screen and (max-width: 767px) {
    width: 100%;
  }
`;

export const Th = styled.th`
  border-bottom: 1px solid rgb(71, 78, 93, 0.3);

  color: ${riverBed};
  font-size: 1.5rem;
  text-align: right;
  text-transform: uppercase;
  /* flex: 0.8; */
  /* 
  display: flex; */

  /* width: 100%; */
  /* 

  background-color: tomato; */
`;

export const TableHeaderDiv = styled.div`
  /* border-top: 1px solid ${riverBed};
  border-bottom: 1px solid ${riverBed}; */
  /* display: flex;
  justify-content: flex-end; */
  /* width: 100%; */
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
  height: 25px;
`;

export const DataTd = styled.td<{ type?: string }>`
  color: ${(props) => handleTdColor(props.type)};
  font-size: 1.4rem;
  font-weight: bold;
  text-align: right;
  width: 100%;
`;

export const DataTr = styled.tr`
  /* height: 10px; */
  position: absolute;
  display: flex;
  flex-direction: row;
  width: 95%;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1;
`;

// export const DepthVisualizerTr = styled.tr`
//   background-color: tomato;
//   width: 100%;
// `;
// export const TestTd = styled.td<{ first?: boolean }>`
//   ${(props) =>
//     props.first &&
//     css`
//       border-top: 3px solid #4d4d4d;
//       border-collapse: separate;
//       border-spacing: 5px 5px;
//       width: 100%;
//     `}
// `;

export const DepthVisualizerTd = styled.td<{
  type: string;
  style: { width: string };
  isMobile?: boolean;
}>`
  will-change: width;

  min-height: 100%;
  background-color: ${(props) =>
    props.type === "bids" ? deepTeal : cocoaBean};
  position: absolute;
  border-width: 0;
  right: 0;
  left: ${(props) => (props.type === "bids" && !props.isMobile ? "unset" : 0)};
`;

export const FooterBarWrapper = styled.div`
  margin-top: 2rem;
  padding-bottom: 2rem;
  display: flex;
  width: 100%;
  justify-content: center;
`;

export const FooterBarWrapperButtonWrapper = styled.div<{ right?: boolean }>`
  ${(props) =>
    props.right &&
    css`
      margin-right: 1rem;
    `};
  ${(props) =>
    !props.right &&
    css`
      margin-left: 1rem;
    `};
`;
