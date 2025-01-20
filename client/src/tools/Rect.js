import Tool from './Tool';
/**
 * @class Rect
 * Класс для рисования прямоугольников.
 */
export default class Rect extends Tool {
    /**
     * @param {HTMLCanvasElement} canvas - HTML-элемент canvas для рисования.
     */
    constructor(canvas, socket, id) {
        super(canvas , socket, id);
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

        if (this.width > 0 || this.height > 0) {
        this.socket.send(
            JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'rect',
                    x: this.startX,
                    y: this.startY,
                    width: this.width,
                    height: this.height,
                    strokeStyle: this.ctx.strokeStyle,
                    lineWidth: this.ctx.lineWidth,
                    fillStyle: this.ctx.fillStyle,
                },
            }));

        this.socket.send(
            JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'up'
                },
            }));
        }
        
        this.width = 0;
        this.height = 0;
        this.startX = 0;
        this.startY = 0;
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
            let currentX = e.pageX - e.target.offsetLeft
            let currentY = e.pageY - e.target.offsetTop
            this.width = currentX - this.startX
            this.height = currentY - this.startY

            this.draw(this.startX, this.startY, this.width, this.height);
        }
    }

    draw(x, y, w, h) {
        console.log("Draw client!", x, y, w, h, this.ctx.fillStyle, this.ctx.lineWidth, this.ctx.strokeStyle);
        this.restoreCanvasState();
        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        this.ctx.fill();
        this.ctx.stroke();
    }
}
