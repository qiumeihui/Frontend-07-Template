/**
 * Proxy与双向绑定：模仿reactive实现原理。
 * 优化之：解决effect中的回调访问objPro.a.b如此格式时，当objPro.a.b（出现深层对象时）变化，监听不到的问题。
 */
/**
 * 其callbacks数据结构如下：
 * {
 *  {a:1,b:2}:{ a:callbackA, b: callbackB }
 * }
 *  */
let callbacks = new Map();
let reactivities = new Map();

let usedReactivities = [];
const mock = {
  a: { c: 4 },
  b: 2,
};
let objPro = reactive(mock);

// 使用effect
effect(() => {
  console.log(objPro.a.c);
});

/* 底层实现 */
// 接收一个想被代理的对象
function reactive(obj) {
  console.log(reactivities);
  // 如果命中缓存，不生成新的Proxy对象
  if (reactivities.has(obj)) {
    return reactivities.get(obj);
  }

  let resProxy = new Proxy(obj, {
    set(obj, property, val) {
      obj[property] = val;
      const mapProperty = callbacks.get(obj);
      // 精准添加回调
      if (mapProperty) {
        if (mapProperty.get(property)) {
          for (let itemCallback of mapProperty.get(property)) {
            itemCallback();
          }
        }
      }

      return obj[property];
    },
    get(obj, property) {
      // 在effect函数中，一旦调用objPro上值，便会向内添加使用到的值
      usedReactivities.push([obj, property]);
      // 如果属性的值仍为对象，则返回reactive(obj[property])
      if (typeof obj[property] === "object") return reactive(obj[property]);
      return obj[property];
    },
  });

  //  生成Proxy对象时设置缓存
  reactivities.set(obj, resProxy);

  return resProxy;
}
// effect函数：监听objPro上的属性变化,发生set行为时被触发。接受一个回调函数作为参数
function effect(callback) {
  usedReactivities = [];
  callback();

  // 每次遍历访问过的属性，仅对其添➕其相应的callbacks。
  for (let item of usedReactivities) {
    if (!callbacks.has(item[0])) {
      callbacks.set(item[0], new Map());
    }

    // 判断是否对应的对象上有此属性
    if (!callbacks.get(item[0]).has(item[1])) {
      callbacks.get(item[0]).set(item[1], []);
    }

    callbacks.get(item[0]).get(item[1]).push(callback);
  }
}
