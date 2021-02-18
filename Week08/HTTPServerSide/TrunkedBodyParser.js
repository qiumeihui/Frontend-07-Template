/**
 * 用于解析以方式返回的数据。
 * chunked: 数据以一系列分块的形式进行发送
 * 1.在每一个分块的开头需要添加当前分块的长度，以十六进制的形式表示，后面紧跟着 '\r\n' ，之后是分块本身，后面也是'\r\n' 。
 * 2.终止块是一个常规的分块，不同之处在于其长度为0
 */
class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;

    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;

    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.currentState = this.WAITING_LENGTH;
  }

  receiveChar(char) {
    const currentState = this.currentState;

    if (currentState === this.WAITING_LENGTH) {
      if (char === "\r") {
        if (this.length === 0) this.isFinished = true;
        this.currentState = this.WAITING_LENGTH_LINE_END;
      } else {
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    } else if (currentState === this.WAITING_LENGTH_LINE_END) {
      if (char === "\n") this.currentState = this.READING_TRUNK;
    } else if (currentState === this.READING_TRUNK) {
      this.content.push(char);
      this.length--;
      if (this.length === 0) this.currentState = this.WAITING_NEW_LINE;
    } else if (currentState === this.WAITING_NEW_LINE) {
      if (char === "\r") this.currentState = this.WAITING_NEW_LINE_END;
    } else if (currentState === this.WAITING_NEW_LINE_END) {
      if (char === "\n") this.currentState = this.WAITING_LENGTH;
    }
  }
}

module.exports = TrunkedBodyParser;
