/**
 * LL语法分析
 */
const rulePattern = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\+)|(\-)|(\*)|(\/)/g;
const dictionary = [
  "Number",
  "Whitespace",
  "LineTerminator",
  "+",
  "-",
  "*",
  "/",
];

function* tokenize(source) {
  let result = null;
  let lastIndex = 0;
  while (true) {
    lastIndex = rulePattern.lastIndex; // lastIndex是正则表达式一个可读可写的整形属性，表示下次正则匹配的起始索引s
    result = rulePattern.exec(source);
    debugger;
    if (!result) break;
    if (rulePattern.lastIndex - lastIndex > result[0].length) break;

    let token = { type: null, value: null };

    for (var i = 1; i <= dictionary.length; i++) {
      if (result[i]) token.type = dictionary[i - 1];
    }
    token.value = result[0];
    yield token;
  }
  yield { type: "EOF" };
}

let source = [];
for (let token of tokenize("150 + 9 * 25")) {
  console.log("token", token);
  // 只针对Number和四则运算
  if (token.type !== "Whitespace" && token.type !== "LineTerminator")
    source.push(token);
}

// 最终Expression
function Expression(source) {
  if (
    source[0].type === "AdditiveExpression" &&
    source[1] &&
    source[1].type === "EOF"
  ) {
    let node = {
      type: "Expression",
      children: [source.shift(), source.shift()],
    };
    source.unshift(node);

    return node;
  }
  AdditiveExpression(source);
  return Expression(source);
}

// 加法表达式
function AdditiveExpression(source) {
  if (source[0].type === "MultiplicativeExpression") {
    let node = {
      type: "AdditiveExpression",
      children: [source[0]],
    };
    source[0] = node;
    return AdditiveExpression(source);
  }
  // ➕法
  if (
    source[0].type === "AdditiveExpression" &&
    source[1] &&
    source[1].type === "+"
  ) {
    let node = {
      type: "AdditiveExpression",
      operator: "+",
      children: [],
    };
    node.children.push(source.shift());
    node.children.push(source.shift());
    MultiplicativeExpression(source);
    node.children.push(source.shift());

    source.unshift(node);

    return AdditiveExpression(source);
  }
  // 减法
  if (
    source[0].type === "AdditiveExpression" &&
    source[1] &&
    source[1].type === "-"
  ) {
    let node = {
      type: "AdditiveExpression",
      operator: "-",
      children: [],
    };
    node.children.push(source.shift());
    node.children.push(source.shift());
    MultiplicativeExpression(source);
    node.children.push(source.shift());

    source.unshift(node);

    return AdditiveExpression(source);
  }
  if (source[0].type === "AdditiveExpression") return source[0];
  MultiplicativeExpression(source);
  return AdditiveExpression(source);
}

// 乘法表达式
function MultiplicativeExpression(source) {
  if (source[0].type === "Number") {
    let node = {
      type: "MultiplicativeExpression",
      children: source[0],
    };
    source[0] = node;
    return MultiplicativeExpression(source);
  }
  // 乘法
  if (
    source[0].type === "MultiplicativeExpression" &&
    source[1] &&
    source[1].type === "*"
  ) {
    let node = {
      type: "MultiplicativeExpression",
      operator: "*",
      children: [],
    };
    node.children.push(source.shift());
    node.children.push(source.shift());
    node.children.push(source.shift());

    source.unshift(node);

    return MultiplicativeExpression(source);
  }
  // 除法
  if (
    source[0].type === "MultiplicativeExpression" &&
    source[1] &&
    source[1].type === "/"
  ) {
    let node = {
      type: "MultiplicativeExpression",
      operator: "/",
      children: [],
    };
    node.children.push(source.shift());
    node.children.push(source.shift());
    node.children.push(source.shift());

    source.unshift(node);

    return MultiplicativeExpression(source);
  }
  // 递归终止情况
  if (source[0].type === "MultiplicativeExpression") return source[0];

  return MultiplicativeExpression(source);
}
