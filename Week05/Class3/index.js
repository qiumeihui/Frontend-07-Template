/**
 * Proxy与双向绑定：模仿reactive实现原理，set属性时设置回调事件
 */
const mock = {
  a: 1,
  b: 2,
};
// 给reactive传递一个想被代理的对象
function reactive(obj) {
  return new Proxy(obj, {
    get(obj, property) {
      console.log("get 行为");
      return obj[property];
    },
    set(obj, property, val) {
      obj[property] = val;
      console.log("set 行为");
      for (let callback of callbacks) {
        callback();
      }
      return obj[property];
    },
  });
}
// 创建一个被代理的对象
let objPro = reactive(mock);
let callbacks = []; // 设定一个全局存储回调函数的地方

function effect(callback) {
  console.log("effect 执行");
  callbacks.push(callback);
}

// 调用effect函数时，即往callbacks中添加回调
effect(() => {
  console.log("effect 回调");
  console.log(objPro);
});

/**
 * 执行顺序：set-->effect
 */
