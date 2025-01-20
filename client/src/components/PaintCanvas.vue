<template>
  <div class="canvas">
    <canvas @mousedown="mouseDownHandler" ref="canvasElement" width="600" height="400"></canvas>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { webSocketConnection } from "@/utils/webSocket";
import canvasState from "@/store/canvasState"; // Подключаем canvasState
import History from "@/tools/History";

export default {
  name: "PaintCanvas",
  setup() {
    const canvasElement = ref(null);
    onMounted(() => {
      canvasState.setCanvas(canvasElement.value); // Передаем ссылку на canvas в state
      webSocketConnection(canvasElement.value); // Подключаемся к вебсокету при монтировании компонента
      
    });

    return {
      canvasElement, // Передаем ссылку в шаблон
    };
  },


  
  methods: {
    mouseDownHandler() {
      History.pushToUndo();
    },

    keyupHandler(event) {
      if (event.ctrlKey && event.shiftKey && (event.key === "Z" || event.key === "Я")) {
        History.Redo();
      } else if (event.ctrlKey && (event.key === "z" || event.key === "я")) {
        History.Undo();
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
