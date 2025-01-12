import Brush from './Brush';
/**
 * @class Eraser
 * Класс для стирания.
 */
export default class Eraser extends Brush {
    /**
     * @param {HTMLCanvasElement} canvas - HTML-элемент canvas для рисования.
     */
    constructor(canvas) {
        super(canvas);
    }

    draw(x, y) {
        let tempStrokeStyle = this.ctx.strokeStyle

        this.ctx.strokeStyle = "white"
        this.ctx.lineTo(x, y);
        this.ctx.stroke();

        this.ctx.strokeStyle = tempStrokeStyle
    }

}
