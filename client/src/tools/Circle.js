import Tool from './Tool';
/**
 * @class Circle
 * Класс для рисования кругов.
 */
export default class Circle extends Tool {
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
                    type: 'circle',
                    x: this.startX,
                    y: this.startY,
                    radius: this.radius,
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
            this.radius = Math.sqrt(this.width**2 + this.height**2)

            this.draw(this.startX, this.startY, this.radius);
        }
    }

    draw(x, y, r) {
        this.restoreCanvasState();
        this.ctx.beginPath();

        this.ctx.arc(x, y, r, 0, 2 * Math.PI, false)
        this.ctx.fill();
        this.ctx.stroke();
    }
}
