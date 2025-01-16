import canvasState from "@/store/canvasState";
import toolstate from "@/store/toolstate";
import Brush from "@/tools/Brush";

import ToolsSync from "@/utils/toolsSync";

export const webSocketConnection = (canvasElement) => {
    const ws = new WebSocket("ws://localhost:5000/ws");

    canvasState.setSessionId(window.location.pathname.split("/").pop());
    canvasState.setSocket(ws);

    toolstate.setTool(new Brush(canvasElement, ws, canvasState.sessionid));

    ws.onopen = () => {
    ws.send(JSON.stringify({
        id: window.location.pathname.split("/").pop(),
        method: "connection",
    }));
    };

    ws.onmessage = (event) => {
    let msg = JSON.parse(event.data);
    switch (msg.method) {
        case "connection":
        break;
        case "draw":
            new ToolsSync(msg, ws, canvasState.sessionid);
        break;
    }
    };
};

