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
  width: 13rem;
  border-radius: 0.75rem;
  color: ${ghost};
  font-size: 1.8rem;
  cursor: pointer;
  background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position-x: 100%;
  background-position-y: 0.8rem;
  padding: 1rem;
  -moz-appearance: none;
  -webkit-appearance: none;
`;

// Orderbook.tsx
export const OrderBookContainer = styled.div`
  background-color: ${mirage};
  margin: auto;
  min-height: 56rem;
  /* width: 80%; */
  @media screen and (max-width: 767px) {
    width: 100%;
    min-height: 112rem;
  }
`;
export const OrderBookWrapper = styled.div`
  @media screen and (min-width: 768px) {
    display: flex;
  }
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
  text-align: center;
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
    `};
`;

// Bids.tsx
// Asks.tsx
export const TableHeadTr = styled.tr`
  height: 30px;
  border-bottom: 1px solid rgb(71, 78, 93, 0.3);
  display: flex; //Strictly for Opera
`;

export const Table = styled.table`
  width: 50%;
  display: flex; //Strictly for Opera
  flex-direction: column; //Strictly for Opera
  > tr {
    display: flex;
    width: 95%;
  }
  @media screen and (max-width: 767px) {
    width: 100%;
  }
`;

export const Th = styled.th`
  width: 31.3%;
  color: ${riverBed};
  font-size: 1.5rem;
  text-align: right;
  text-transform: uppercase;
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
  display: flex; //Strictly for Opera
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
  width: 95%;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1;
`;

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

export const Loading = styled.h1`
  color: ${ghost};
`;
