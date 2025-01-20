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

        const canvas = document.createElement('canvas');
        canvas.width = this.canvas.width;
        canvas.height = this.canvas.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.canvas, 0, 0);
        this.undoList.push(canvas);
    }

    pushToRedo() {
        if (this.redoList.length > 50) {
            this.redoList.shift()
        }

        this.canvas = canvasState.canvas
        this.ctx = canvasState.ctx

        const canvas = document.createElement('canvas');
        canvas.width = this.canvas.width;
        canvas.height = this.canvas.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.canvas, 0, 0);

        this.redoList.push(canvas)
    }

    

    Undo() {
        if (this.undoList.length == 0) { return }

        this.pushToRedo()
        this.ptReplase = this.undoList.pop()


        canvasState.socket.send(
              JSON.stringify({
                id: canvasState.sessionid,
                method: "draw",
                figure: {
                  type: "undo",
                  canvasState: this.ptReplase.toDataURL(),
                },
              }
            )
        );
    }

    Redo() {
        if (this.redoList.length == 0) { return }

        this.pushToUndo()
        this.ptReplase = this.redoList.pop()
        canvasState.socket.send(
            JSON.stringify({
              id: canvasState.sessionid,
              method: "draw",
              figure: {
                type: "undo",
                canvasState: this.ptReplase.toDataURL(),
              },
            }
        )
      );
    }
}

export default new History()