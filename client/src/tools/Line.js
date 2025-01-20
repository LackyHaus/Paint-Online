import Tool from './Tool';
/**
 * @class Line
 * Класс для рисования прямых линий.
 */
export default class Line extends Tool {
    /**
     * @param {HTMLCanvasElement} canvas - HTML-элемент canvas для рисования.
     */
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen();
    }

    listen() {
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    }

    mouseUpHandler() {
        this.mouseDown = false;
        this.restoreCanvasState();
        
        this.socket.send(
            JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'line',
                    x: this.startX,
                    y: this.startY,
                    x2: this.currentX,
                    y2: this.currentY,
                    strokeStyle: this.ctx.strokeStyle,
                    lineWidth: this.ctx.lineWidth,
                },
            }));
        this.paintUp();
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        this.saveCanvasState();
    }

    saveCanvasState() {
        this.savedImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    restoreCanvasState() {
        if (this.savedImageData) {
            this.ctx.putImageData(this.savedImageData, 0, 0);
        }
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.currentX = e.pageX - e.target.offsetLeft
            this.currentY = e.pageY - e.target.offsetTop

            this.draw(this.currentX, this.currentY);
        }
    }

    draw(x, y) {
        this.restoreCanvasState();
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(x, y);
        this.ctx.fill();
        this.ctx.stroke();
    }
}