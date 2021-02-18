## 课堂感悟

### LL算法构建AST：四则运算
#### 构建AST抽象语法树的过程叫做“语法分析”。最著名的语法分析算法思想为：LL算法、LR算法。
> 弄清LL算法概念及LL语法分析过程、四则运算详细概念。
#### 三条产生式规则：（关于产生式定义在后面week06🈶️笔记）

1. MultiplicativeExpression：乘法表达式。由*（乘号）或 /（除号）连接的Number的序列。
   - 自身单独的number可以看成是一个乘法表达式。（自身*1）
2. AdditiveExpression：加法表达式。
    - 基本单元为MultiplicativeExpression。
    - 为数个乘法/除法 通过 加号/减号连接在一起。
3. Expression：整体我们可处理的表达式。
    - 可看成是`<AdditiveExpression><EOF>`
    - EOF（End of File）：结束符号，并非真实可见的字符。标识我们所有源代码的结束。


####    正则表达式和正则表达式的捕获关系`exec()`经常被用于去处理一些词法。
        exec方法不常见，需要弄清。
####    yield后面的值用于作为其调用yield的函数的返回结果。调用yield的函数需要在function后加*声明。

> 备注：class1为概念课，无课后练习