import { makeAutoObservable } from "mobx";
import canvasState from "@/store/canvasState";

class History {
    undoList = []
    redoList = []


    
    constructor() {
        makeAutoObservable(this);
    }

    saveCanvasState() {
        this.savedImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    restoreCanvasState(imageData) {
        if (imageData) {
            this.ctx.putImageData(imageData, 0, 0);
        }
    }

    pushToUndo() {
        if (this.undoList.length > 50) {
            this.undoList.shift();
        }

        this.canvas = canvasState.canvas;
        this.ctx = canvasState.ctx;

        this.saveCanvasState();
        this.undoList.push(this.savedImageData);
    }

    pushToRedo() {
        if (this.redoList.length > 50) {
            this.redoList.shift();
        }

        this.canvas = canvasState.canvas;
        this.ctx = canvasState.ctx;

        this.saveCanvasState();
        this.redoList.push(this.savedImageData);
    }

    Undo() {
        if (this.undoList.length == 0) { return; }

        this.pushToRedo();
        const imageData = this.undoList.pop();
        this.restoreCanvasState(imageData);

        canvasState.socket.send(
            JSON.stringify({
                id: canvasState.sessionid,
                method: "draw",
                figure: {
                    type: "undo",
                    canvasState: this.canvas.toDataURL(),
                },
            })
        );
    }

    Redo() {
        if (this.redoList.length == 0) { return; }

        this.pushToUndo();
        const imageData = this.redoList.pop();
        this.restoreCanvasState(imageData);

        canvasState.socket.send(
            JSON.stringify({
                id: canvasState.sessionid,
                method: "draw",
                figure: {
                    type: "redo",
                    canvasState: this.canvas.toDataURL(),
                },
            })
        );
    }
}

export default new History()