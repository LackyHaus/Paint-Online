import { makeAutoObservable } from "mobx";
import canvasState from "@/store/canvasState";

class History {
    undoList = []
    redoList = []


    
    constructor() {
        makeAutoObservable(this);
    }

    pushToUndo() {
        if (this.undoList.length > 50) {
            this.undoList.shift()
        }

        this.canvas = canvasState.canvas
        this.ctx = canvasState.ctx

        const offscreenCanvas = new OffscreenCanvas(this.canvas.width, this.canvas.height);
        const ctx = offscreenCanvas.getContext('2d');
        ctx.drawImage(this.canvas, 0, 0);
        this.undoList.push(offscreenCanvas);

    }

    pushToRedo() {
        if (this.redoList.length > 50) {
            this.redoList.shift()
        }

        this.canvas = canvasState.canvas
        this.ctx = canvasState.ctx
        
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

export default new History()