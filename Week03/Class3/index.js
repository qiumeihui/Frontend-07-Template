/**
 * 使用LL算法构建AST语法树（LL词法分析）
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
  ga,
];

function* tokenize(source) {
  let result = null;
  let lastIndex = 0;
  while (true) {
    lastIndex = rulePattern.lastIndex; // lastIndex是正则表达式一个可读可写的整形属性，表示下次正则匹配的起始索引
    result = rulePattern.exec(source);
    if (!result) break;
    if (rulePattern.lastIndex - lastIndex > result[0].length) break;
    debugger;
    let token = { type: null, value: null };

    for (var i = 1; i <= dictionary.length; i++) {
      // 寻找当前字符匹配的底层类型
      if (result[i]) token.type = dictionary[i - 1];
    }
    token.value = result[0];
    yield token;
  }
  yield { type: "EOF" };
}

for (let token of tokenize("150 + 9 * 25")) {
  console.log("token", token);
}
