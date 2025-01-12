import Tool from './Tool';
/**
 * @class Brush
 * Класс для рисования.
 */
export default class Brush extends Tool {
    /**
     * @param {HTMLCanvasElement} canvas - HTML-элемент canvas для рисования.
     */
    constructor(canvas, soket, id) {
        super(canvas, soket, id);
        this.listen();
    }

    listen() {
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    }

    mouseUpHandler() {
        this.mouseDown = false;
        this.soket.send(
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
        this.ctx.beginPath();
        this.ctx.moveTo(
            e.pageX - e.target.offsetLeft,
            e.pageY - e.target.offsetTop
        );
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            // this.draw(
            //     e.pageX - e.target.offsetLeft,
            //     e.pageY - e.target.offsetTop
            // );
            this.soket.send(
                JSON.stringify({
                    method: 'draw',
                    id: this.id,
                    figure: {
                        type: 'brush',
                        x: e.pageX - e.target.offsetLeft,
                        y: e.pageY - e.target.offsetTop,
                        color: this.ctx.strokeStyle,
                        lineWidth: this.ctx.lineWidth,
                    },
                }));
        }
    }

    static draw(ctx, x, y) {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}
