import canvasState from "@/store/canvasState";
import Brush from "@/tools/Brush";

export default class ToolsSync {
  constructor(msg, socket, id) {
    this.msg = msg;
    this.socket = socket;
    this.id = id;
    this.ctx = canvasState.ctx;
    this.ctx.strokeStyle = msg.figure.color;
    this.ctx.fillStyle = msg.figure.color;
    this.ctx.lineWidth = msg.figure.width;
    this.handleDraw();
  }

  handleDraw() {
    const { figure } = this.msg;

    switch (figure.type) {
      case "brush":
        Brush.draw(this.ctx, figure.x, figure.y);
        break;

      case "rect":
        this.drawRect(figure.x, figure.y, figure.width, figure.height, figure.color, figure.lineWidth, figure.fillStyle);
        break;

      case "circle":
        // Добавьте логику для рисования круга
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

        // const buffer = JSON.parse(figure.canvasState);
        // const view = new DataView(buffer);
        // const width = view.getUint32(0, true);
        // const height = view.getUint32(4, true);
        // const imageData = new ImageData(new Uint8ClampedArray(buffer, 8), width, height);
        // const ctx = canvasState.canvas.getContext('2d');
        // ctx.putImageData(imageData, 0, 0);
        
        break;
      }

      default:
        console.log("Unknown figure type:", figure.type);
    }
  }

  drawRect(x, y, w, h, color, lineWidth, fillStyle) { // Рисуем прямоугольник
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = fillStyle;
    this.ctx.stroke();
    this.ctx.fill();
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

    // const ctx = canvasState.canvas.getContext('2d');
    // const width = canvasState.canvas.width;
    // const height = canvasState.canvas.height;
    // const imageData = ctx.getImageData(0, 0, width, height);
    // const data = imageData.data; // Uint8ClampedArray

    // // Создадим общий буфер:
    // //  4 байта под ширину
    // //  4 байта под высоту
    // //  остаток под сами пиксели
    // const buffer = new ArrayBuffer(8 + data.length);
    // const view = new DataView(buffer);

    // // Запишем ширину/высоту (Uint32, порядок little-endian)
    // view.setUint32(0, width, true);
    // view.setUint32(4, height, true);

    // // Копируем сами пиксели (начиная с 8-го байта буфера)
    // new Uint8Array(buffer, 8).set(data);

    // // Отправим буфер на сервер
    // socket.send(
    //   JSON.stringify({
    //     id,
    //     method: "save",
    //     figure: {
    //       type: "canvasState",
    //       canvasState: JSON.stringify(buffer),
    //     },
    //   })
    // );

  }
}