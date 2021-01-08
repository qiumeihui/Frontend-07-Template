/**
 * Proxy的基本用法
 */
const obj = {
  a: 1,
  b: 2,
};
// 需要使用Proxy实例进行操作，才会触发hook
const objPro = new Proxy(obj, {
  get(obj, property) {
    console.log(obj);
    console.log(property);
  },
  set(obj, property, val) {
    console.log(obj);
    console.log(property);
    console.log(val);
  },
});
