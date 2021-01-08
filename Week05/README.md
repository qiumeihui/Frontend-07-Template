## 学习笔记1-5周总结：

### week01
老师由井字棋引入，利用二维数组表示行和列，实现了棋盘3x3的存储结构。

### week02
老师主要讲了出现频率很高的广度优先搜索算法。而自己也忘记了这个算法，便去重新了解了广度优先搜索和深度优先搜索的思路。
- 广度优先BFS：主要用于解决最短路径问题。所借助的数据结构为队列，先进先出。
    将队头的周围所有能到达的点放入队尾，然后队头元素出队列，将新队头的周围所能到达的点放入队尾，依次循环操作。
- 深度优先DFS：主要用于解决连通性问题。所借助的数据结构为栈，先进后出。
    选定一个点放入栈，从此点周围任选一个点继续入栈，如此往复，直到发现不能走通，此时将栈尾弹出栈，从被弹出栈尾的周围新选取一个未标记过的点入栈...如此往复。当栈空时还没找到目的点，则得出联通失败的结果。
主要知识点：
- 通过在一张格子形成的地图上将寻路时所经之地以背景颜色标注。形象展示了寻路时的路径。添加类名方式：`item.classList.add("grey");`
- 基础暴力式搜索：
    - 每次从上下左右的四个方向扩展，并将走过的地方标记。`[x,y+1],[x,y-1],[x-1,y],[x+1,y]`
    - 边界条件判断：`x<0 || x>100 || y<0 || y>100`
    - 当队列被取完时，仍读取不到目标值，则寻找失败。
    - 若找到终点，回溯从起点到终点的路径。（实现：1.在insert方法中将可走的点打上前驱节点标记，并加入队列；）。
### week03 
老师主要讲了四则运算，以及大致实现了LL算法的语法解析过程。
主要知识点：
- 正则的`exec()`，利用参数以及返回结果。
- generator函数 + yield
- <EOF>为结束字符标志
### week04
老师主要讲了针对字符串的匹配算法。字典树Trie、KMP、wildcard
### week05
#### 一、reactive相关
- Proxy的基本使用以及如何根据Proxy来实现数据的监听
- 利用数据的监听reactive、effect方法和DOM的监听实现了数据和DOM的基本的双向绑定
- 根据双向绑定数据，通过改变DOM属性或者对象属性实现调色盘

##### 执行顺序：
初始：
- effect函数体执行，callback为`() => { console.log(objPro.a); }`
- effect函数体调用传入的callback，新开一个调用栈
- **进入get方法**，usedReactivities被push
- callback调用结束，执行再次进入effect函数体，此时usedReactivities不为空，进入for循环
- for循环遍历usedReactivities，为callbacks内加入对应属性a的callback

赋值：这里以objPro.a为例
- set方法执行，判断当前set的属性a是否被添加了callback，有的话依次执行。
- 于是又再次进入了初始定义的使用了objPro.a的effect回调：`() => { console.log(objPro.a); }`
- **进入get。**usedReactivities再次被push刚刚赋值的a相关东西。（注意这里其实会重复push。）
- 注意：赋值不会再次进入effect函数体内

#### 二、拖拽
1. `mousedown`事件监听
2. `mousemove`、`mouseup`事件监听(这里注意`move、up`时的监听对象要为整个`document`)
3. 鼠标松开时取消监听
4. 设置`div`的实时偏移量（1.这里用`transform`去实现;2.需要记录上次的偏移量）
##### 拖拽+range
> 基础知识
- `document.createRange()`创建range对象，表示包含节点与文本节点的一部分文档片段
- `range.setStart()`创建片段起始位置
- `range.setEnd()`创建片段结束位置
- `CSSOM API：getBoundingClientRect()` 此方法返回元素大小及相对于视口的位置

> 实现过程
- 遍历文本容器下的文本节点，一一创建他们的range片段。
- 写一个根据传入坐标去获取该坐标最近的range片段，并返回该range片段。
- 拿到最近的range片段后，去将拖拽的元素塞进去。
    - getNearest中取到最小range之后，获取此range的`getBoundingClientRect()`
    - `getNearest(x,y).insertNode(dragElement)`
- 优化：禁止页面的默认选中效果`document.addEventListener('selectstart',(event) => event.preventDefault());`

> 细节部分
- 获取div下文本节点集合: `document.getElementById('container').childNodes[0].textContent`
