const http = require("http");

http
  .createServer((request, response) => {
    let body = [];
    request
      .on("error", (err) => {
        console.log("遇到错误了.....再接再厉");
        console.error(err);
      })
      .on("data", (chunk) => {
        console.log("server收到data,接下来打印chunk");
        console.log(chunk);
        body.push(chunk.toString());
      })
      .on("end", () => {
        // body = Buffer.concat(body).toString();

        body = Buffer.concat([Buffer.from(body.toString())]).toString();
        console.log("body===");
        console.log(body);
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(" Hello World!!\n");
      });
  })
  .listen(9000);

console.log("server started");
