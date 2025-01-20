import Brush from './Brush';
/**
 * @class Eraser
 * Класс для стирания.
 */
export default class Eraser extends Brush {
    /**
     * @param {HTMLCanvasElement} canvas - HTML-элемент canvas для рисования.
     */
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.socket.send(
                JSON.stringify({
                    method: 'draw',
                    id: this.id,
                    figure: {
                        type: 'brush',
                        x: e.pageX - e.target.offsetLeft,
                        y: e.pageY - e.target.offsetTop,
                        strokeStyle: "#ffffff",
                        lineWidth: this.ctx.lineWidth,
                    },
                }));
                
        }
    }
}
