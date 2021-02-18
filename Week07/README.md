# Week07

### 一、JavaScript运算符和表达式

### 运算符：

有优先级之分，所以构造语法🌲时**乘除法会优先构成一个较小级**的语法结构。而**加减法会形成一个较高一级**的语法结构。

### 表达式：

表达式语句实际上就是一个表达式，它是由运算符连接变量或者直接量构成的

### 运算符的优先级：

> 可参考mdn：[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#table](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#table)

#### 1、Member类型：

- a.b：成员属性访问
- a[b]：成员属性访问，**可在运行时使用**
- foo`string`（不常见）：foo为函数名，后面跟一个反引号的字符串形式，等于把这个反引号的内容作为函数参数传递进去。
  - code示意：

```javascript
function test(str){
    console.log('hello, '+str)
}
test`qmh`
```


- super.b：仅class时可以使用
- super['b']：仅class时可以使用
- new.target（不常见）：允许你检测函数或构造方法是否是通过[new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)运算符被调用的。在通过[new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)运算符被初始化的函数或构造方法中，`new.target`返回一个指向构造方法或函数的引用。在普通的函数调用中，`new.target` 的值是[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)。

```javascript
function Foo() {
  if (!new.target) throw "Foo() must be called with new";
  console.log("Foo instantiated with new");
}
Foo(); // throws "Foo() must be called with new"
new Foo(); // logs "Foo instantiated with new"
```

- new Foo()：new后面带括号调用

#### 2、new调用类型（省略括号时）

为什么有这样子的运算符，因为new调用构造函数时后面的括号是可以省略的。
所以当出现**一种特殊情况**：`new new Foo()`时，会产生一个疑问，运算符到底怎样执行的。由于上面我们解释了new后面带括号的运算符会被优先调用，所以后面的`new Foo()`会先计算。

#### 3、Call调用

- foo()
- super()
- foo()['b']
- foo().b
- foo()`123`

### 左右手运算符

#### Left HandSide

只有Left HandSide Expression**才能出现在“=”的 左边**。所以这也是左右手运算符的区分标准。
如a.b为左手运算符。能够a.b=1。而a+b=1 则是错误的写法，因为a+b不是左手运算符。

#### Right HandSide

- Update Expressions
  - a++、a--
  - ++a、--a

### 单目运算符（Unary）

- delete：后面必须跟Reference类型，比如delete a.b
- void foo()：void后面不管跟什么都会被变成undefined值。
- typeof
- +/- ：一元正/负值符，会发生隐式的类型转换，被试图转换为Number。
- !：**逻辑非运算符，把一个任何类型的数强制转换为布尔类型。**
- ～：位运算符，将整数按位取反，如果不是整数则**强制转为整数**后再取反。
- await：对后续语法结构造成影响。

### 特殊运算符（JavaScript唯一后结合的运算符，从后面算起）

#### exponentiation operator: 求幂运算符

例子：2**3 = 8. 3**2**3 = 3**8

### 二、类型转换

#### +

a+b这样的加号运算符一定要用于两个字符串或者是两个数字，不然就会发生类型转换。

#### ==

双等号是最为复杂的一个类型转换机制，如果**两边类型不一致**，基本上是把**两边各自转换为number类型**之后再比较。

#### a[b]

访问成员属性时，方括号这样的形式也会发生类型转换。因为非字符串对象不能用来作为一个对象属性的键，所以任何非字符串对象包括 Number，都会通过 [toString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) 方法，被转换成一个字符串。

#### 转换规则

![类型转换.png](https://cdn.nlark.com/yuque/0/2021/png/631773/1613404959899-c0190085-ad69-4724-af36-215dcddedfe8.png#align=left&display=inline&height=488&margin=%5Bobject%20Object%5D&name=%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2.png&originHeight=488&originWidth=1412&size=326315&status=done&style=none&width=1412)

#### Unboxing（拆箱转换）

拆箱转换：将**对象**类型转换**基本**类型的过程。

```javascript
const obj = {
	valueOf(){ return 1 };
  toString(){ return 'str' };
	[Symbol.toPrimitive](hint){ return 3 }; // 该函数被调用时，会被传递一个字符串参数 hint ，表示要转换到的原始值的预期类型。 hint 参数的取值是 "number"、"string" 和 "default" 中的任意一个
}
// 关于Symbol.toPrimitive的用法参照：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive#%E7%A4%BA%E4%BE%8B
```

1、ToPrimitive：
一个对象类型，本身自带三种方法来决定其被转换为基本类型值的结果。
分别为：valueOf、toString、Symbol.toPrimitive。其中优先级**Symbol.toPrimitive最高，****定义了它则会忽略其他2个。**
2、**toString** VS **valueOf**：(在未定义Symbol.toPrimitive时)
这两个方法的优先级取决于周围的调用环境。这里举例说明两个场景：

- +法运算（先调用valueOf）：`"2"+ obj（上文定义); // "21"`
- obj作为属性名时（先调用toString）：`const x = {}; x[obj] = 100; // x的str属性被设为1`

3、总结：
当我们对**需要字符串**的对象进行操作时，优先调用toString。
当我们进行**数学运算**时，优先调用valueOf。

#### Boxing (装箱转换)

> **在JavaScript和其他语言中，基本值没有方法或属性，因此，如果要使用它们，则需要使用包装器**

当我们使用基本类型上的属性方法时，其实基本类型本身是不含这些东西的，当访问时会进行**装箱转换**把基本类型转换成对象类型。
**定义**：所谓的**装箱**，是指将基本数据类型转换为对应的引用类型的操作。
![boxing.png](https://cdn.nlark.com/yuque/0/2021/png/631773/1613452343387-579c151d-5c06-4f5b-a7ea-b84d4af3b0be.png#align=left&display=inline&height=238&margin=%5Bobject%20Object%5D&name=boxing.png&originHeight=238&originWidth=1036&size=133721&status=done&style=none&width=1036)

### 三、运行时相关概念

#### Completion Record：

储存执行结果的这样的数据结构。决定我们的语句是向下执行还是停止执行，包含下列三种属性。

- [[type]]: normal/break/continue/return/throw
- [[value]]: 基本类型
- [[target]]: label



### 四、简单语句和复合语句

#### 简单语句：里面不会再容纳其他语句的语句。

分类如下：

- **Expression Statement表达式语句：语句后面加一个分号，完全由表达式组成。**
- Empty Statement 空语句：单独的一个分号。`;`
- Debugger Statement 调试语句：专调试运行，触发断点。一般上线前会将其移除。
- Throw Statement：抛出异常
- Continue Statement：和循环语句相匹配。结束当前次循环，之后语句不执行。后续循环继续执行。
- Break Statement：和循环语句相匹配。终止循环，后续循环不执行。
- Return Statement：一定得在函数里使用。返回函数的值。



#### 复合语句：

分类如下：

- Block：一对花括号中间一个语句的列表。非常重要。
- If：分支结构，条件语句。
- Switch：多分支结构。在C和C++里性能明显好于连续If，但JS中性能无差异，且写起来较为复杂，容易写错。
- Iteration：循环类句型。do while/while/for家族
  - `for( ; ;){xxx}`: for语句会产生一个独立作用域，在其花括号内作用域的外层。
- With：_!! JS编程规范拒绝避免使用。_后面跟一个对象，然后把这个对象的属性直接放进一个作用域。通常难以准确预测。
- Label：在任何语句（简单/复合）前➕一个表达式和分号`<表达式> :`。相当于给语句取了名字，在循环语句中配合break、continue使用非常有用。可以获取到终止的那一次label。
- Try：自身必须要携带一个block包裹。



### 五、声明

#### FunctionDeclaration: 函数声明4种

> 函数声明会被永远当作函数体的第一条执行。即所谓的提升。

- `function xx()`：普通函数声明
- `function* xx()`：genarator声明
- `async functionxx()`：异步函数声明
- `async function* xx()`：异步产生器。（未懂）



#### VariableStatement：变量声明

var声明作用相当于出现在函数头部，但是赋值操作并没有发生。


#### ClassDeclaration：类声明（较新）

当你在声明之前去调用它，会报错。


#### LexcialDeclaration：词法声明，含const、let声明（较新）

当你在声明之前去调用它，会报错。


#### 预处理：在代码之前，js引擎会预先对代码本身进行预先处理。

- 会提前找到所有var声明的变量，将其声明执行，赋值并不执行。
- 所有的声明都是有预处理机制的。
- const/let在其声明之前运行的话，会抛出错误。此错误🉑️被try catch捕获。

#### 作用域：代码从哪里到哪里起作用。是一个比较久远的概念。新的const/let/class在其声明之前使用会报错，更加精准。

### 六、宏任务和微任务

#### 按照JS执行的粒度在运行时的表示可分为以下几类：

- 宏任务：传给javascript引擎的任务。指一段代码传给JS引擎并进行执行的整个过程称为macroTask。
- 微任务：在javascript引擎**内部**的任务。由**Promise**产生的，在JS里只有Promise能产生微 
- 表达式（Expression）
- 直接量/变量/this

#### 事件循环：告诉JS引擎何时去执行代码。来源于node里的概念。

详细参考**知识库-学习笔记-事件循环**
掰开说只有3个流程：获取代码---->执行代码----->等待（等待时间/事件）。


### 七、JS函数调用

#### 执行上下文

在JavaScript中，执行上下文是一个抽象概念，其中包含执行当前代码的环境有关信息

- 保存Execution Context的数据结构称为**Execution Context Stack 执行上下文栈**。
- 执行上下文栈的栈顶元素为Running Execution Context，是**当前正在运行的函数**的上下文，是当前能够访问到的所有信息。

#### 执行上下文的组成部分

由7个部分组成，但不是每个上下文都能找到7个部分。

1. code  evaluation state：用于async 和 generator函数，记录代码执行到哪里
1. Function
1. Script or Module
1. Generator：只有Generator函数有
1. Realm：保存着我们所有使用的内置对象的领域
1. LecialEnvironment：词法作用域
1. VariableEnvironment