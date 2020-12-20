/**
 * 使用LL算法构建AST语法树（正则表达式版）
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

function tokenize(source) {
  let result = null;
  while (true) {
    result = rulePattern.exec(source);
    if (!result) break;

    for (let i = 1; i <= dictionary.length; i++) {
      if (result[i]) console.log(dictionary[i - 1]);
    }

    console.log(result);
  }
}
tokenize("150 + 1 * 25");
