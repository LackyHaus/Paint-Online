<template>
    <div class="settings-bar">
        <label style="margin-left: 10px;" for="line-width">Толщина линии</label>
        <input 
            @input="handleLineWidthInput"
            style="margin: 0 10px;" 
            id="line-width" 
            type="number" value="1" min="1" max="50"/>
        
        <label for="line-color">Цвет обводки</label>
        <input
            @input="handleLineColorInput"
            style="margin: 0 10px;" 
            id="line-color" 
            type="color"/>            
    </div>
</template>

<script>
import toolstate from '@/store/toolstate';
export default {
    name: "SettingsBar",
    data() {
        return {
            toolstate,
        }
    },
    methods: {
        handleLineWidthInput(e) {
            toolstate.setLineWidth(e.target.value);
        },
        handleLineColorInput(e) {
            toolstate.setStrokeColor(e.target.value)
        },
    },
};
</script>

<style scoped>
    @import "../styles/toolbar.css";
</style>
