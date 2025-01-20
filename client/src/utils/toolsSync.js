import canvasState from "@/store/canvasState";
import toolstate from "@/store/toolstate";

export default class ToolsSync {
  constructor(msg, socket, id) {
    this.msg = msg;
    this.socket = socket;
    this.id = id;
    this.ctx = canvasState.ctx;

    this.saveStatus();

    this.ctx.strokeStyle = msg.figure.strokeStyle;
    this.ctx.fillStyle = msg.figure.fillStyle;
    this.ctx.lineWidth = msg.figure.lineWidth;
    this.handleDraw();
  }

  handleDraw() {
    const { figure } = this.msg;

    switch (figure.type) {
      case "brush":
        this.drawBrush(figure.x, figure.y);
        break;

      case "rect":
        this.drawRect(figure.x, figure.y, figure.width, figure.height);
        break;

      case "circle":
        this.drawCircle(figure.x, figure.y, figure.radius);
        break;

      case "line":
        this.drawLine(figure.x, figure.y, figure.x2, figure.y2);
        break;

      case "up": {
        this.ctx.beginPath();
        this.sendCanvasState(this.socket, this.id);
        break;
      }

      case "undo":
      case "redo":
      case "canvasState": {
        if (figure.canvasState === "") {
          return;
        }
        const img = new Image();
        img.src = figure.canvasState;
        img.onload = () => {
          this.ctx.clearRect(0, 0, canvasState.canvas.width, canvasState.canvas.height);
          this.ctx.drawImage(img, 0, 0);
        };
        toolstate.tool.paintUp();
        break;
      }

      default:
        console.log("Unknown figure type:", figure.type);
    }
    this.restoreStatus();
  }

  drawLine(x, y, x2, y2) { // Рисуем линию
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  drawBrush(x, y) { // Рисуем кисть
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  drawRect(x, y, w, h) { // Рисуем прямоугольник
    console.log("Draw server!", x, y, w, h, this.ctx.fillStyle, this.ctx.lineWidth, this.ctx.strokeStyle);
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawCircle(x, y, r) { // Рисуем круг
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    this.ctx.fill();
    this.ctx.stroke();
  }

// eslint-disable-next-line
  sendCanvasState(socket, id) {
    socket.send(
      JSON.stringify({
        id,
        method: "save",
        figure: {
          type: "canvasState",
          canvasState: canvasState.canvas.toDataURL(),
        },
      })
    );
  }


  saveStatus() {
    this.temp_strokeStyle = this.ctx.strokeStyle;
    this.temp_fillStyle = this.ctx.fillStyle;
    this.temp_lineWidth = this.ctx.lineWidth;
  }

  restoreStatus() {
    this.ctx.strokeStyle = this.temp_strokeStyle;
    this.ctx.fillStyle = this.temp_fillStyle;
    this.ctx.lineWidth = this.temp_lineWidth;
  }
}