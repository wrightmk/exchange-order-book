import { expose } from "comlink";

function testfn() {
  console.log("hi");
  return "HELLLO";
  // const obj = {
  //   counter: 0,
  //   inc() {
  //     this.counter++;
  //   },
  // };
  // return { obj };
}

const worker = {
  testfn,
};

export type TestWorker = typeof worker;

expose(worker);
