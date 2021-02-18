# Week08

## 浏览器工作原理总览

1. 发起**HTTP请求**等待服务器响应，接收到返回时把**HTML**从返回的字符串中**解析**出来
1. 对文本HTML进行**解析parse**，变成DOM🌲
1. 对纯净的DOM🌲进行**CSS渲染**（CSS computing）生成带CSS属性的DOM🌲
1. 对DOM with CSS进行**Layout布局**
1. 最后一步：渲染。将DOM树挂到一张**Bit Map**上，由计算机底层硬件和驱动生成人眼可识别的图片。

## 有限状态机

有限状态机一般用来处理字符串。

#### 每一个状态都是一个机器

- 在每一个机器里，都可以进行**计算、存储、输出**
- 每一个状态接收的输入**完全一致**，**不能存在不同**。
- 状态机的每一个机器本身没有自己的状态，用函数来表示的话则是**无副作用**的纯函数

#### 每一个机器知道下一个状态

- Moore型: 每一个机器都有**固定的**下一个状态，**不由输入决定****。**
- Mealy型：每一个机器**根据输入**的状态来**决定输出**的状态。更为强大。

#### JS中实现状态机的方式--函数

```javascript
// 每个函数是一个状态，一个机器
/* 声明状态机（Moore型） */
function state(input){ // 接收输入
	... // 自由地处理状态、逻辑
  return next；// 返回值作为下一个状态
}

/* 使用 */
while(input){
      state = state(input); // state不断被更新为下一个状态，由每个state的返回值决定。
}
```


## HTTP协议解析

#### 七层OSI网络模型

低-->高：物理层、数据链路层、网络层、传输层、会话层、表示层、应用层

- 物理层+数据链路层：点对点传输，必须要有一个直接相连的东西才能进行传输。俗称的4G、wifi
- 网络层：最流行的属**Internet协议（IP协议）**
- 传输层：最流行的属**TCP**、**UDP**
- 会话层+表示层+应用层：**HTTP**层

#### TCP、IP基础知识

TCP：通过**端口**将接收的数据包分配给各自的软件。传输数据格式为流，采用全双工模式。相当于require(''net'')这个包。
IP：传输数据格式为包。以唯一的IP地址为参照，寻找传输的终点。

>  ！具体TCP、IP、HTTP协议的详细知识参考《谢希仁计算机网络第7版》。

HTTP：由**Request**和**Response**的过程组成的。必须得先由客户端发起一个Request，然后服务端相应一个Response而不是全双工模式。⚠️**一个Request只能对应一个Response。**

## 实现HTTP请求

### 设计一个HTTP请求的类

- 从使用角度出发
- Content-Type是必需字段，需要有默认值
- body请求头为key-value格式
- 不同的Content-Type决定body的不同格式

### 设计一个send函数

- 将Request请求发送到服务器
- send函数应该是异步的，所以返回Promise

### send函数内部实现

- 应支持已有的connection，若无自己支持新建一个connection
- 收到数据传给parser处理
- 根据parser的处理结果resolve Promise

### ResponserParser的实现

- Response必须**分段构造**，所以必须使用一个ResponseParser来逐步装配
- ResponseParser**分段处理**ResponseText，所以用**状态机**来分析并逐个处理文本
- 在进入**WAITING_BODY的状态**时去调用BodyParser处理各种可能的Body格式。

### BodyParser的实现

- Response的body可能根据**Content-Type**有**不同的结构**，所以需要用子parser的结构去分别处理
- 以TrunkedBodyParser为例，同样用**状态机**来处理body的格式
