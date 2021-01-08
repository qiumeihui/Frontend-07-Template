/**
 * Proxy与双向绑定：模仿reactive实现原理
 */
const mock = {
  a: 1,
  b: 2,
};
// 需要使用Proxy实例进行操作，才会触发hook
function reactive(obj) {
  return new Proxy(obj, {
    get(obj, property) {
      console.log(obj, property);
    },
    set(obj, property, val) {
      console.log(obj, property, val);
      obj[property] = val;
    },
  });
}

let objPro = reactive(mock);
