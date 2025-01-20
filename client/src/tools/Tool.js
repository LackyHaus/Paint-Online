/**
 * @class Tool
 * Основной класс всех инструментов
 */
export default class Tool {



    /**
     * @param {HTMLCanvasElement} canvas - HTML-элемент canvas для рисования.
     */
    constructor(canvas, socket, id) {
        this.canvas = canvas
        this.socket = socket
        this.id = id



        /**
         * @type {CanvasRenderingContext2D} - 2D-контекст для рисования.
        */
        this.ctx = canvas.getContext('2d')
        this.destroyEvents()

        this.tempCanvas = new OffscreenCanvas(canvas.width, canvas.height);
        this.tempCtx = this.tempCanvas.getContext('2d');
    }

    set fillColor(color) {
        this.ctx.fillStyle = color
    }

    set strokeColor(color) {
        this.ctx.strokeStyle = color
    }

    set lineWidth(width) {
        this.ctx.lineWidth = width
    }

    destroyEvents() {
        this.canvas.onmouseup = null
        this.canvas.onmousedown = null
        this.canvas.onmousemove = null
    }
}