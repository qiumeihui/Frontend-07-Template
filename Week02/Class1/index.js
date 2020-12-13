// 逻辑起始数据结构
const data = localStorage["map"]
  ? JSON.parse(localStorage["map"])
  : Array(10000).fill(0);

let globalDowning = false;
let ifClear = false;

const container = document.getElementById("container");

for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 100; j++) {
    const item = document.createElement("div");
    item.classList.add("grey");

    if (data[i * 100 + j] === 1) {
      item.style.backgroundColor = "#000";
    }
    item.addEventListener("mousemove", () => {
      if (globalDowning) {
        if (ifClear) {
          item.style.backgroundColor = "";
          data[i * 100 + j] = 0;
        } else {
          item.style.backgroundColor = "#000";
          data[i * 100 + j] = 1; // 如果鼠标划过，设置为1
        }
      }
    });
    container.appendChild(item);
  }
}

container.addEventListener("mousedown", (e) => {
  globalDowning = true;
  // 判断点击的为右键
  if (e.button === 2) ifClear = true;
});

container.addEventListener("mouseup", () => {
  globalDowning = false;
  ifClear = false;
});

container.addEventListener("contextmenu", (e) => e.preventDefault());
