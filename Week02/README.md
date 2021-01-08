学习笔记

### 算法练习

##### 复习了使用JS表示链表结构
> 参考文章：https://www.freecodecamp.org/news/implementing-a-linked-list-in-javascript/
- 一般链表每个node存储两项，自身数据和到下一个节点的链接🔗。
- js中链表数据结构如下表示：
    ```js
    const list = {
        head: {
            value: 6
            next: {
                value: 10                                             
                next: {
                    value: 12
                    next: {
                        value: 3
                        next: null	
                        }
                    }
                }
            }
        }
    ```
- js实现链表节点
```js
class LinkedNode{
    constructor(data){
        this.data = data;
        this.next = null;
    }
}
```

- js实现链表
```js
class LinkedList{
    constructor(head = null){
        this.head = head;
    }
}
``` 

- 创建链表
```js
const node1 = new LinkedNode(1);
const node2 = new LinkedNode(2);
node1.next = node2;

const list = new LinkedList(node1)
```

### 课堂感悟

#### 复习了广度优先搜索和深度优先搜索，新学习了启发式搜索算法。
- 广度优先搜索：
    - 每一步向外扩展每个点所能到的位置。对于有障碍的地方来说，速度较慢。不如启发式搜索效率较高。
    - js的数组天然可以加工成栈和队列，只需使用push、pop 及 push、shift
    - 获取最优路径办法：在insert时，我们需要记录下当前扩展点的前驱节点。最后找到终点时，根据终点的前驱节点逐渐反推回起点。就是一条可通的完整路径。

- 启发式搜索：
    - 预先设计结构，用来存储一个路径上的点的坐标集合。
    - 取最优解：每次从这个结构中取出距离终点最近的最优点，进行扩展。初始将起点设置为最优点。
    - 添加点：根据最优点，将其周围的可到达的点的坐标都放入存储结构中。

#### 数组的删除方法
- 不推荐使用splice，会挪动删除位置之后的元素，效率低下。
- 在未排序的数组里，可以将要删除位置的元素与末尾元素交换，再pop。