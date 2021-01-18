// webWorker.js
const worker = (self) => {
  function generateBigArray() {
    let arr = [];
    arr.length = 1000000;
    for (let i = 0; i < arr.length; i++) arr[i] = i;
    return arr;
  }

  function sum(arr) {
    return arr.reduce((e, prev) => e + prev, 0);
  }

  function factorial(num) {
    if (num == 1) return 1;
    return num * factorial(num - 1);
  }

  self.addEventListener("message", (evt) => {
    const num = evt.data;
    const arr = generateBigArray();
    postMessage(sum(arr));
  });
};
export default worker;
