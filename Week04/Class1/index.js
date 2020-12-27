/**
 * 字典树 Trie
 */

let $ = new Symbol("$");
class Trie {
  constructor() {
    this.root = Object.create(null);
  }
  insert(word) {
    let node = this.root;
    for (let c of word) {
      if (!node[c]) {
        node[c] = Object.create(null);
      }

      node = node[c];
    }
    if (!("$" in code)) node["$"] = 0;

    node["$"]++;
  }
  // 找出出现最多的随机字符串
  most() {
    let max = 0;
    let maxWord = null;
    let visit = (node, word) => {
      if (node[$] && node[$] > max) {
        max = node[$];
        maxWord = word;
      }
      for (let p in node) {
        visit(node[p], word + p);
      }
    };

    visit(this.root, "");
    console.log(maxWord);
  }
}

function randomWord(length) {
  let s = "";
  for (let i = 0; i < length; i++) {
    s += String.fromCharCode(Math.random() * 26 + "a".charCodeAt(0));
  }
  return s;
}

let trie = new Trie();

// 以随机字符串生成字典树
for (let i = 0; i < 100000; i++) {
  trie.insert(randomWord(4));
}
// 打印出现最多的字符串
console.log(trie.most());
