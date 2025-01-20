import canvasState from "@/store/canvasState";
import Brush from "@/tools/Brush";

export default class ToolsSync {
  constructor(msg, socket, id) {
    this.msg = msg;
    this.socket = socket;
    this.id = id;
    this.ctx = canvasState.ctx;
    this.ctx.strokeStyle = msg.figure.strokeStyle;
    this.ctx.fillStyle = msg.figure.fillStyle;
    this.ctx.lineWidth = msg.figure.lineWidth;
    this.handleDraw();
  }

  handleDraw() {
    const { figure } = this.msg;

    switch (figure.type) {
      case "brush":
        Brush.draw(this.ctx, figure.x, figure.y);
        break;

      case "rect":
        this.drawRect(figure.x, figure.y, figure.width, figure.height);
        break;

      case "circle":
        this.drawCircle(figure.x, figure.y, figure.radius);
        break;

      case "eraser":
        // Добавьте логику для ластика
        break;

      case "line":
        // Добавьте логику для рисования линии
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
        break;
      }

      default:
        console.log("Unknown figure type:", figure.type);
    }
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
}