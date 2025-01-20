import { makeAutoObservable } from "mobx";


class CanvasState {
    canvas = null;

    socket = null
    sessionid = null

    constructor() {
        makeAutoObservable(this);
    }

    setSessionId(id) {
        this.sessionid = id
    }

    setSocket(socket) {
        this.socket = socket
    }

    setCanvas(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
    }
}

export default new CanvasState()