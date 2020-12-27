/**
 * KMP匹配算法
 */

function KMP(source, pattern) {
  // 依据pattern计算table
  let table = new Array(pattern.length).fill(0);
  {
    // i:开始下标、j：已重复字符数
    let i = 1;
    let j = 0;

    while (i < pattern.length) {
      if (pattern[i] === pattern[j]) {
        ++j, ++i;
        table[i] = j; // table的i下标位置重复数为j
      } else {
        if (j > 0) j = table[j];
        else {
          ++i;
        }
      }
    }
  }

  console.log(table);
  // 匹配联系
  {
    let i = 0;
    let j = 0;
    while (i < source.length) {
      if (pattern[j] === source[i]) {
        ++i;
        ++j;
      } else {
        if (j > 0) {
          j = table[j];
        } else {
          ++i;
        }
      }
      if (j === pattern.length) return true;
    }

    return false;
  }
}
