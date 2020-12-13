/**
* 三子棋数据结构：二维数组
  [
    [1,0,0],
    [0,2,0],
    [1,0,0],
  ]
  支持功能：实现落子、判断胜负、当前胜负提示
*/
let SHAPE_TYPE = {
  EMPTY: 0,
  CIRCLE: 1,
  FORK: 2,
};
let SHAPE_MAP = {
  [SHAPE_TYPE.EMPTY]: "",
  [SHAPE_TYPE.CIRCLE]: " ⭕️ ",
  [SHAPE_TYPE.FORK]: " ❌ ",
};
const pattern = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
let areaPanel = document.getElementById("board");
let shape = SHAPE_TYPE.CIRCLE;

// 渲染逻辑
function render(data) {
  // 保证不会出现多个棋盘
  areaPanel.innerHTML = "";

  // 循环显示出数组
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let newItem = document.createElement("div");
      let emoji = SHAPE_MAP[data[i][j]];

      // 增加监听事件
      newItem.addEventListener("click", () => userPlay(i, j));
      newItem.innerText = emoji;
      // add class
      newItem.classList.add("item");
      areaPanel.appendChild(newItem);
    }
    // 决定3个换行
    areaPanel.appendChild(document.createElement("br"));
  }
}

// 人落子
function userPlay(i, j) {
  // 如果已经有值，不做处理
  if (pattern[i][j]) return;
  pattern[i][j] = shape;

  // 判定当前落子导致的胜负
  if (checkWin(pattern, shape)) {
    alert(`${SHAPE_MAP[shape]}方 获胜！！游戏结束`);
  }
  // tip: 利用加法交换律让shape在1/2之间不停变换
  shape = 3 - shape;
  render(pattern);
  computerPlay();

  // 会打印 每一方的结果。
  console.log(bestChoice(pattern, shape));

  // 一方落子结束后
  if (willWin(pattern, shape)) {
    alert(`${SHAPE_MAP[shape]}方将获胜！！游戏即将结束`);
  }
}

// 电脑落子
function computerPlay() {
  let choiceObj = bestChoice(pattern, shape);
  const { point } = choiceObj;

  if (Array.isArray(point)) {
    console.log("computer should--", point);
    pattern[point[0]][point[1]] = shape;
  }

  if (checkWin(pattern, shape)) {
    alert(`${SHAPE_MAP[shape]}方 获胜！！游戏结束`);
  }

  shape = 3 - shape;
  render(pattern);
}

// 判定胜负
function checkWin(pattern, shape) {
  // 遍历每行
  for (let i = 0; i < 3; i++) {
    let win = true;
    for (let j = 0; j < 3; j++) {
      if (pattern[i][j] !== shape) win = false;
    }
    if (win) return win;
  }
  // 遍历每列
  for (let i = 0; i < 3; i++) {
    let win = true;
    for (let j = 0; j < 3; j++) {
      if (pattern[j][i] !== shape) win = false;
    }
    if (win) return win;
  }
  {
    // 遍历斜纵行1 [0,0][1,1][2,2]
    let win = true;
    for (let i = 0; i < 3; i++) {
      if (pattern[i][i] !== shape) win = false;
    }
    if (win) return true;
  }
  {
    let win = true;
    // 遍历斜纵行2 [0,2][1,1][2,0]
    for (let i = 0; i < 3; i++) {
      if (pattern[i][2 - i] !== shape) win = false;
    }
    if (win) return true;
  }

  return false;
}

// 判断下一步落子方是否必会获胜, 返回一个落子坐标，
function willWin(pattern, nextShape) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // 只检查能下的空地方
      if (pattern[i][j]) continue;
      // 模拟落子然后检查结果
      const clonePattern = clone(pattern);
      clonePattern[i][j] = nextShape;
      // 将当前棋盘和下一步的子 送入检查
      if (checkWin(clonePattern, nextShape)) return [i, j];
    }
  }

  return null;
}

// 深拷贝
function clone(origin) {
  return JSON.parse(JSON.stringify(origin));
}

// 获取对己方最有利的落子位置
function bestChoice(pattern, shape) {
  // 需要return 一个point坐标，一个棋局结果
  const RESULT_TYPE = {
    OWN_WIN: 1, // 己方赢
    PEACE: 0,
    FAIL: -1, // 己方输
  };

  // 这里为了不调用两次willWin，将其赋给p
  let p = willWin(pattern, shape);
  // 特例, 离赢只差一步
  if (p) {
    return {
      point: p,
      result: RESULT_TYPE.OWN_WIN,
    };
  }

  // 初始结果
  let result = -2;
  let point = null;

  outer: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (pattern[i][j]) continue;

      let clonePattern = clone(pattern);
      clonePattern[i][j] = shape;

      let futureRes = bestChoice(clonePattern, 3 - shape).result;

      if (-futureRes > result) {
        result = -futureRes;
        point = [j, i];
      }

      // 胜负剪枝
      if (result == 1) break outer;
    }
  }
  // 最终return
  return {
    point,
    result: point ? `${SHAPE_MAP[shape]} 会 ${result}` : 0, // 无子可走时，即和棋
  };
}

render(pattern);
