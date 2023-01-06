//ランダムな整数を返すメソッド
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//ランダムな偶数を返すメソッド
const getRandomEven = (num1: number, num2: number) => {
  //偶数の配列
  const evens = new Array(num2 - num1);
  let even = num1;
  for (let i = 0; i < evens.length; i++) {
    evens[i] = even;
    even += 2;
  }
  const randomIndex = getRandomInt(0, evens.length);
  return evens[randomIndex];
};

//ランダムな奇数を返すメソッド
const getRandomOdd = (num1: number, num2: number) => {
  //奇数の配列
  const odds = new Array(num2 - num1);
  let odd = num1;
  for (let i = 0; i < odds.length; i++) {
    odds[i] = odd;
    odd += 2;
  }
  const randomIndex = getRandomInt(0, odds.length);
  return odds[randomIndex];
};
export { getRandomInt, getRandomEven, getRandomOdd };
