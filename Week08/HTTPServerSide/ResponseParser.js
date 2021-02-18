// import TrunkedBodyParser from "./TrunkedBodyParser";

const TrunkedBodyParser = require("./TrunkedBodyParser");

class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1; // 接收到\r\n时切换到此状态

    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;

    this.WAITING_HEADER_BLOCK_END = 6; // headers之后要再等待一个空白行
    this.WAITING_BODY = 7;

    this.currentState = this.WAITING_STATUS_LINE; // currentState记录当前状态
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParser = null;
  }

  // 接收并处理服务端返回的data
  receive(string) {
    for (let i = 0, len = string.length; i < len; i++) {
      // 利用状态机处理+变更状态
      this.receiveChar(string.charAt(i));
    }
  }

  receiveChar(char) {
    const currentState = this.currentState;
    if (currentState === this.WAITING_STATUS_LINE) {
      if (char === "\r") {
        this.currentState = this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (currentState === this.WAITING_STATUS_LINE_END) {
      if (char === "\n") {
        // 进入等待header信息的状态
        this.currentState = this.WAITING_HEADER_NAME;
      }
    } else if (currentState === this.WAITING_HEADER_NAME) {
      if (char === ":") {
        this.currentState = this.WAITING_HEADER_SPACE;
      } else if (char === "\r") {
        debugger;
        // 遇到空行则进入WAITING_HEADER_BLOCK_END，此时表示所有的信息都已经收到
        this.currentState = this.WAITING_HEADER_BLOCK_END;
        if (this.headers["Transfer-Encoding"] === "chunked")
          this.bodyParser = new TrunkedBodyParser(); // 返回头Transfer-Encoding为chunked时启用分段解析
      } else {
        this.headerName += char;
      }
    } else if (currentState === this.WAITING_HEADER_SPACE) {
      if (char === " ") {
        this.currentState = this.WAITING_HEADER_VALUE;
      }
    } else if (currentState === this.WAITING_HEADER_VALUE) {
      if (char === "\r") {
        this.currentState = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = "";
        this.headerValue = "";
      } else {
        this.headerValue += char;
      }
    } else if (currentState === this.WAITING_HEADER_LINE_END) {
      if (char === "\n") {
        this.currentState = this.WAITING_HEADER_NAME;
      }
    } else if ((currentState = this.WAITING_HEADER_BLOCK_END)) {
      if (char === "\n") {
        this.currentState = this.WAITING_BODY;
      }
    } else if (currentState === this.WAITING_BODY) {
      console.log(char);
      // 交给bodyParser去处理
      this.bodyParser.receiveChar(char);
    }
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }

  //  组装返回值
  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(""),
    };
  }
}

module.exports = ResponseParser;
