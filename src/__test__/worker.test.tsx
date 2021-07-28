import { Order } from "../types";
import { countDecimals, getFlooredFixed, WebSocketStream } from "../worker";

describe("WebSocketStream Class", () => {
  const dataStream = new WebSocketStream();
  it("PI_XBTUSD pair should return values grouped by 1", () => {
    const orderBook: Order = {
      40017.5: { size: 1200, price: 40017.5, total: 1200 },
      40018: { size: 12050, price: 40018, total: 13250 },
      40021.5: { size: 3999, price: 40021.5, total: 0 },
      40022.5: { size: 30000, price: 40022.5, total: 0 },
      40026.5: { size: 450, price: 40026.5, total: 47699 },
      40028.5: { size: 1, price: 40028.5, total: 0 },
      40033.5: { size: 67807, price: 40033.5, total: 0 },
      40034: { size: 185803, price: 40034, total: 0 },
      40034.5: { size: 9449, price: 40034.5, total: 0 },
      40035: { size: 52072, price: 40035, total: 173329 },
      40036.5: { size: 1979, price: 40036.5, total: 0 },
    };
    const resultsArr: Array<number[]> = [
      [40017, 1200],
      [40018, 12050],
      [40021, 3999],
      [40022, 30000],
      [40026, 450],
      [40028, 1],
      [40033, 67807],
      [40034, 195252],
      [40035, 52072],
      [40036, 1979],
    ];
    expect(dataStream.groupByTickSize(1, orderBook)).toEqual(resultsArr);
  });

  it("PI_ETHUSD pair should return price grouped by 0.25", () => {
    const orderBook: Order = {
      2293.85: { size: 59569, price: 2293.85, total: 0 },
      2293.94: { size: 12072, price: 2293.94, total: 457923 },
      2294: { size: 25266, price: 2294, total: 0 },
      2294.6: { size: 3808, price: 2294.6, total: 0 },
      2294.15: { size: 5203, price: 2294.15, total: 0 },
      2294.25: { size: 6526, price: 2294.25, total: 0 },
      2294.65: { size: 60, price: 2294.65, total: 390639 },
      2294.69: { size: 128115, price: 2294.69, total: 0 },
      2294.75: { size: 3884, price: 2294.75, total: 0 },
      2295: { size: 23862, price: 2295, total: 0 },
      2295.05: { size: 4405, price: 2295.05, total: 242207 },
      2295.4: { size: 11909, price: 2295.4, total: 0 },
    };
    const resultsArr: Array<number[]> = [
      [2293.75, 71641],
      [2294, 30469],
      [2294.25, 6526],
      [2294.5, 131983],
      [2294.75, 3884],
      [2295, 28267],
      [2295.25, 11909],
    ];
    expect(dataStream.groupByTickSize(0.25, orderBook)).toEqual(resultsArr);
  });
});

describe("Utility Functions", () => {
  it("should count decimals", () => {
    expect(countDecimals(1000.25)).toEqual(2);
  });

  it("round value down to fixed decimal", () => {
    expect(getFlooredFixed(1000.29999999997, 2)).toEqual("1000.29");
  });
});
