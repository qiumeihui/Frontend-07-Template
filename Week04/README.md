学习笔记

#### 这周主要学习了字符串匹配算法。了解了字典树Trie、KMP字符串模式匹配算法(重要)。

### 字典树
> 主要用于寻找出现次数最多的字符串。

- 字典树是哈希树的一种特例
- 哈希树在字符串领域的表现就是字典树
### KMP算法
> 在一个原串里寻找是否存在某指定串。
#### 对比：
- 当一个原串自身没有重复的子串时（如abcdef），那么当检测到有一个不匹配时，需要改变起始点重头开始检测。
- 当一个原串自身有重复的子串时，当检测到当前字符与目标字符不匹配时，可以复用之前的结果，不必跳转回头部。

#### 流程
1. 根据模式串算出跳转表格(表格用来表示自重复的特性)；
2. 拿跳转表格，填写原串和模式串的关系。