/* 
用状态机实现：字符串“abcabx”的解析
*/
function find(str) {
  // state: 状态机的当前状态
  let state = start;
  for (let i of str) {
    state = state(i);
  }
  return state === end;
}

function start(i) {
  if (i === "a") {
    return foundA;
  }
  // 这里不可使用start(i)，否则当前后字符串相等时，陷入死循环.如aa/bb
  return start;
}
// 找B
function foundA(i) {
  if (i === "b") {
    return foundB;
  }
  return start(i);
}

// 找C
function foundB(i) {
  if (i === "c") {
    return foundC;
  }
  return start(i);
}

// C后找A
function foundC(i) {
  if (i === "a") {
    return foundA1;
  }
  return start(i);
}

// 找B
function foundA1(i) {
  if (i === "b") {
    return foundB1;
  }
  return start(i);
}

// 找X
function foundB1(i) {
  if (i === "x") {
    return end;
  }
  // 这里要返回foundB，因为除了x，可能是c、a
  return foundB(i);
}

// end,来让状态始终走入end，不对之后的input进行处理
function end() {
  return end;
}

/* 
 用状态机实现：字符串“abababx”的解析
 */
function find(str) {
  // state: 状态机的当前状态
  let state = start;
  for (let i of str) {
    state = state(i);
  }
  return state === end;
}

function start(i) {
  if (i === "a") {
    return foundA;
  }
  // 这里不可使用start(i)，否则当前后字符串相等时，陷入死循环.如aa/bb
  return start;
}
// 找B
function foundA(i) {
  if (i === "b") {
    return foundB;
  }
  return start(i);
}

// ab*
function foundB(i) {
  if (i === "a") {
    return foundA2;
  }
  // abb, 重开
  return start(i);
}

//aba*
function foundA2(i) {
  // abab
  if (i === "b") {
    return foundB2;
  }
  // abaa, 重开
  return start(i);
}

// abab*
function foundB2(i) {
  // ababa
  if (i === "a") {
    return foundA3;
  }
  // ababb, 重开
  return start(i);
}

// ababa*
function foundA3(i) {
  // ababab
  if (i === "b") {
    return foundB3;
  }
  // ababaa，重开
  return start(i);
}

// ababab*
function foundB3(i) {
  // abababx
  if (i === "x") return end;
  // abababb
  if (i === "b") return start(i);
  // abababa,可重复使用的为前面的ab，所以从foundB开始
  return foundB(i);
}

// end,来让状态始终走入end，不对之后的input进行处理
function end() {
  return end;
}
