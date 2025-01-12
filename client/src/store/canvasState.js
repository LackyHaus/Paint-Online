import { makeAutoObservable } from "mobx";

class CanvasState {
    canvas = null;
    undoList = []
    redoList = []

    constructor() {
        makeAutoObservable(this);
    }

    setCanvas(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
    }

    pushToUndo() {
        if (this.undoList.length > 50) {
            this.undoList.shift()
        }

        const offscreenCanvas = new OffscreenCanvas(this.canvas.width, this.canvas.height);
        const ctx = offscreenCanvas.getContext('2d');
        ctx.drawImage(this.canvas, 0, 0);
        this.undoList.push(offscreenCanvas);

    }

    pushToRedo() {
        if (this.redoList.length > 50) {
            this.redoList.shift()
        }

        const offscreenCanvas = new OffscreenCanvas(this.canvas.width, this.canvas.height);
        const ctx = offscreenCanvas.getContext('2d');
        ctx.drawImage(this.canvas, 0, 0);

        this.redoList.push(offscreenCanvas)
    }


    Undo() {
        if (this.undoList.length == 0) { return }

        this.pushToRedo()
        this.ptReplase = this.undoList.pop()
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.drawImage(this.ptReplase, 0, 0)
    }

    Redo() {
        if (this.redoList.length == 0) { return }

        this.pushToUndo()
        this.ptReplase = this.redoList.pop()
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.drawImage(this.ptReplase, 0, 0)
    }
}

export default new CanvasState()