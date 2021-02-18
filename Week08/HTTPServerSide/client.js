const Request = require("./Request");

void (async function () {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1", // ip协议要求
    port: "9000", // tcp协议要求，与server监听的端口需要一致
    path: "/",
    headers: {
      ["X-Foo2"]: "customed",
    },
    body: {
      name: "qmh",
    },
  });

  const res = await request.send();

  console.log(res);
})();
