<template>
  <div class="canvas">
    <canvas @mousedown="mouseDownHandler" ref="canvasElement" width="600" height="400"></canvas>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import canvasState from "@/store/canvasState"; // Подключаем canvasState
import toolstate from "@/store/toolstate";
import Brush from "@/tools/Brush";

export default {
  name: "PaintCanvas",
  setup() {
    const canvasElement = ref(null);
    onMounted(() => {
      canvasState.setCanvas(canvasElement.value); // Передаем ссылку на canvas в state
      webSocketConnection(); // Подключаемся к вебсокету при монтировании компонента
      
    });

    const webSocketConnection = () => {
      const ws = new WebSocket("ws://localhost:5000/ws");

      canvasState.setSessionId(window.location.pathname.split("/").pop());
      canvasState.setSocket(ws);

      toolstate.setTool(new Brush(canvasElement.value, ws, canvasState.sessionid));

      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: window.location.pathname.split("/").pop(), 
          method: "connection",
        }));


        // Принятие сообщений
        ws.onmessage = (event) => {
          let msg = JSON.parse(event.data);
          switch (msg.method) {
            case "connection":
              break;
            case "draw":
              drawHandler(msg);
              break;
          }
        };


        
      };
      
      const drawHandler = (msg) => {
        const { figure } = msg;
        const ctx = canvasElement.value.getContext("2d");
        ctx.strokeStyle = figure.color;
        ctx.fillStyle = figure.color;
        ctx.lineWidth = figure.width;
        switch (figure.type) {
          case "brush":
            Brush.draw(ctx, figure.x, figure.y);
            break;
          case "up":
            ctx.beginPath();
            break;
        }
      }
    };


    return {
      canvasElement, // Передаем ссылку в шаблон
    };
  },

  methods: {
    mouseDownHandler() {
      canvasState.pushToUndo();
    },

    keyupHandler(event) {
      if (event.ctrlKey && event.shiftKey && (event.key === "Z" || event.key === "Я")) {
        canvasState.Redo();
      } else if (event.ctrlKey && (event.key === "z" || event.key === "я")) {
        canvasState.Undo();
      }
    }



  },

  mounted () {
  document.addEventListener('keyup', this.keyupHandler)
  },
  unmounted () {
    document.removeEventListener('keyup', this.keyupHandler)
  },
};
</script>

<style scoped>
@import "../styles/canvas.css";
</style>
