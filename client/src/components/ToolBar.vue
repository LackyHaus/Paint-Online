<template>
    <div class="toolbar">
        <button class="toolbar__btn brush" @click="toolstate.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionid))"></button>
        <button class="toolbar__btn rect" @click="toolstate.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionid))"></button>
        <button class="toolbar__btn circle" @click="toolstate.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionid))"></button>
        <button class="toolbar__btn eraser" @click="toolstate.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionid))"></button>
        <button class="toolbar__btn line" @click="toolstate.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionid))"></button>
        <input @change="changeColor" style="margin-left: 10px;" type="color">
        <button class="toolbar__btn undo" @click="History.Undo()"></button>
        <button class="toolbar__btn redo" @click="History.Redo()"></button>
        <button class="toolbar__btn save" @click="saveImage()"></button>
    </div>
</template>

<script>
/* eslint-disable */
import canvasState from '@/store/canvasState';
import toolstate from '@/store/toolstate';
import History from '@/tools/History';
import Brush from '@/tools/Brush';
import Rect from '@/tools/Rect';
import Circle from '@/tools/Circle';
import Eraser from '@/tools/Eraser';
import Line from '@/tools/Line';

export default {
    name: "ToolBar",
    data() {
        return {
            toolstate,
            canvasState,
            Brush,
            Rect,
            Circle,
            Eraser,
            Line,
            History
        };
    },
    methods: {
        changeColor(e) {
            toolstate.setStrokeColor(e.target.value)
            toolstate.setFillColor(e.target.value)
        },
        saveImage() {
            const link = document.createElement('a');
            link.href = canvasState.canvas.toDataURL('image/png');
            link.download = 'canvas_image.png';
            link.click();
        }
    }
};
</script>

<style scoped>
    @import "../styles/toolbar.css";
</style>
