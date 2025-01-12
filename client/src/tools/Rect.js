import Tool from './Tool';
/**
 * @class Rect
 * Класс для рисования прямоугольников.
 */
export default class Rect extends Tool {
    /**
     * @param {HTMLCanvasElement} canvas - HTML-элемент canvas для рисования.
     */
    constructor(canvas) {
        super(canvas);
        this.listen();
        
    }

    listen() {
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    }

    mouseUpHandler() {
        this.mouseDown = false;
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
    
        this.tempCtx.drawImage(this.canvas, 0, 0);
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            let currentX = e.pageX - e.target.offsetLeft
            let currentY = e.pageY - e.target.offsetTop
            let width = currentX - this.startX
            let height = currentY - this.startY

            this.draw(this.startX, this.startY, width, height);
        }
    }

    draw(x, y, w, h) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.tempCanvas, 0, 0);
        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        this.ctx.fill();
        this.ctx.stroke();
    }
}
