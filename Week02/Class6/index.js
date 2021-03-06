// 逻辑起始数据结构
const data = localStorage["map"]
  ? JSON.parse(localStorage["map"])
  : Array(10000).fill(0);

let globalDowning = false;
let ifClear = false;

/**
 * 启发式搜索应用：
 * 每次取出的都是每次当前点拓展的最优解
 */

/**
 * 寻路时的路径存储数据结构，能以一定优先级提供离终点最近的点
 */
class Sorted {
  // data：传入的数据，compare：排序规则函数由外部传入
  constructor(data, compare) {
    this.data = data.slice();
    this.compare = compare || ((a, b) => a - b);
  }
  // 获取当前路径集合里的离终点距离最优点
  take() {
    if (!this.data.length) return;

    // 记录最小值和最小值的索引。默认为第一个位置
    let min = this.data[0];
    let minIndex = 0;

    // 计算最小值，因为前面选取了0位置，所以这里从1开始
    for (let i = 1; i < this.data.length; i++) {
      // 这里借鉴了sort机制，如果函数返回结果<0 ，则a在b前面。a<b
      if (this.compare(this.data[i], min) < 0) {
        minIndex = i;
        min = this.data[i];
      }
    }

    // 取走最小的数---这里使用了小tip：不使用效率较低下的splice，而是将要删除的和最后一位数交换，然后直接pop
    this.data[minIndex] = this.data[this.data.length - 1];
    this.data.pop();

    return min;
  }

  add(value) {
    this.data.push(value);
  }
}

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
// 返回结果：一个路径集合
async function findPath(mapData, start, aim) {
  let cloneMapData = Object.create(mapData);
  let queue = new Sorted([start], (a, b) => distance(a) - distance(b)); //  (a, b) => distance(a) - distance(b)) 规则在Sorted类中传实参

  // 计算距离终点距离(乘方运算符)，通过传入的值和终点坐标相互计算得出
  function distance(coordinate) {
    return (coordinate[0] - aim[0]) ** 2 + (coordinate[1] - aim[1]) ** 2;
  }

  async function insert(x, y, pre) {
    // 根据一维数组的特性，计算当前点
    const currentCoordinate = y * 100 + x;
    // 边界条件1: 当前点超出最大范围
    // 边界条件2: 当前点为墙或者已经走过
    if (x < 0 || x >= 100 || y < 0 || y >= 100) return;

    if (cloneMapData[currentCoordinate]) return;

    await sleep(10); // 设置少许延迟，便于直观看到每次insert函数
    container.children[currentCoordinate].style.backgroundColor = "orange";
    cloneMapData[currentCoordinate] = pre; // 将已经走过的标记为其前驱节点

    queue.add([x, y]); // 先加入当前点到路径数据结构集合中，此后从queue中取的时候再取最优解即可
  }

  // 当路径结构中data长度不为空时
  while (queue.data.length) {
    let [x, y] = queue.take(); // 取出比较规则下的返回距离最优点
    console.log("x=", x, "y", y);
    // 判断此点是否为目标点
    if (x === aim[0] && y === aim[1]) {
      // 一个从终点返回起点的坐标路径集合
      const successPath = [];

      // 键：[20,20]，值：mapData[20 * 100 + 20]
      while (x !== start[0] || y !== start[1]) {
        successPath.push(mapData[y * 100 + x]);
        [x, y] = cloneMapData[y * 100 + x];

        await sleep(30);
        container.children[y * 100 + x].style.backgroundColor = "green";
      }
      return successPath;
    }

    /* 对此点的八个方向扩展, 并记录其前驱路径坐标 */
    // 上下左右
    await insert(x - 1, y, [x, y]);
    await insert(x + 1, y, [x, y]);
    await insert(x, y - 1, [x, y]);
    await insert(x, y + 1, [x, y]);
    // 斜向四个方向
    await insert(x - 1, y - 1, [x, y]);
    await insert(x + 1, y - 1, [x, y]);
    await insert(x - 1, y + 1, [x, y]);
    await insert(x + 1, y + 1, [x, y]);
  }

  return false;
}

// 作用：让程序休息delay间隔。
function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
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
