// 逻辑起始数据结构
const data = localStorage["map"]
  ? JSON.parse(localStorage["map"])
  : Array(10000).fill(0);

let globalDowning = false;
let ifClear = false;

const container = document.getElementById("container");

function renderMap() {
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
}
renderMap();

// 寻找是否存在一条通路结果，返回布尔值。广度优先搜索
// 参数start、aim格式: [x,y]坐标形式
function findPath(mapData, start, aim) {
  const queue = [start];

  // 当队列长度不为空时
  while (queue.length) {
    const [x, y] = queue.shift(); // 取出队头
    const [aimX, aimY] = aim;
    // 判断此点是否为目标点
    if (x === aimX && y === aimY) return true;
    // 对此点的四个方向扩展
    insert(x + 1, y);
    insert(x - 1, y);

    insert(x, y - 1);
    insert(x, y + 1);
  }

  function insert(x, y) {
    // 根据一维数组的特性，计算当前点
    const current = mapData[y * 100 + x];
    // 边界条件1: 当前点超出最大范围
    // 边界条件2: 当前点为墙或者已经走过
    if (x < 0 || x > 100 || y < 0 || y > 100) {
      return;
    } else if (current) {
      return;
    }
    mapData[current] = 2; // 标记已经走过
    queue.push([x, y]); // 入队列
  }

  return false;
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
