const ResponseParser = require("./ResponseParser");
const net = require("net"); // 引入node自己的net模块

class Request {
  constructor(configs) {
    // 将传入的配置存入类本身
    this.method = configs.method || "GET";
    this.path = configs.path || "/";
    this.host = configs.host;
    this.port = configs.port || 80;
    this.headers = configs.headers || {};
    this.body = configs.body || {};
    this.headers["Content-Type"] =
      this.headers["Content-Type"] || "application/x-www-form-urlencoded";

    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (
      this.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ) {
      // 将表单数据编码，用&连接
      this.bodyText = Object.keys(this.body)
        .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
        .join("&");
    }

    // 一定在自身控制Content-Length，非传入。不然Content-length不对会导致违反HTTP协议，请求失败
    this.headers["Content-Length"] = this.bodyText.length;
  }

  requestToString() {
    const encodeHeaders = Object.keys(this.headers)
      .map((key) => `${key}: ${this.headers[key]}`)
      .join("\r\n");

    const formatHeaders = `${this.method} ${this.path} HTTP/1.1\r
      ${encodeHeaders}\r
      \r
      ${this.bodyText}`;
    return formatHeaders;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      // 请求过程中是逐步的收集信息，故需要构造ResponseParser类去逐步保存信息
      const parser = new ResponseParser();
      if (!connection) {
        // 创立新的tcp连接
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            connection.write(this.requestToString()); // 发送请求数据
          }
        );
      } else {
        // connection.write("hello test");
        connection.write(this.requestToString()); // 发送请求数据
      }

      /* 接收到服务端消息的处理 */
      connection.on("data", (data) => {
        console.log(data.toString());

        parser.receive(data.toString()); // 让parser去接收数据字符串

        if (parser.isFinished) {
          resolve(parser.response);
          connection.end(); // 关闭tcp连接
        }
      });

      /* 错误处理 */
      connection.on("error", (err) => {
        reject(err);
        console.log("failed");
        connection.end(); // 关闭错误连接
      });
    });
  }
}

module.exports = Request;
