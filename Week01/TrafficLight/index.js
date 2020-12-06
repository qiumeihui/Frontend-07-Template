const lightElement = document.getElementsByClassName("light")[0];

function goGreen() {
  lightElement.classList.add("green");
}

function goYellow() {
  lightElement.classList.replace("green", "yellow");
}

function goRed() {
  lightElement.classList.replace("yellow", "red");
}

/**
 * 回调地狱版
 */
// function start() {
//   goGreen();
//   setTimeout(() => {
//     goYellow();
//     setTimeout(() => {
//       goRed();
//       setTimeout(() => {
//         start();
//       }, 5000);
//     }, 2000);
//   }, 10000);
// }

/**
 * promise版
 */
// function transfer(delay) {
//   return new Promise((resolve, reject) => {
//     setTimeout(resolve, delay);
//   });
// }

// function start() {
//   goGreen();
//   transfer(10000)
//     .then(() => {
//       goYellow();
//       return transfer(2000);
//     })
//     .then(() => {
//       goRed();
//       return transfer(5000);
//     })
//     .then(() => start()); // 最后记得递归，才能无限循环
// }

/**
 * async 版
 */

function transfer(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay);
  });
}
async function start() {
  while (true) {
    goGreen();
    await transfer(1000);
    goYellow();
    await transfer(200);
    goRed();
    await transfer(500);
  }
}

// init start
start();
