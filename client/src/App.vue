<template>
  <ToolBar></ToolBar>
  <SettingBar></SettingBar>
  <PaintCanvas></PaintCanvas>
</template>


<script>
import PaintCanvas from "./components/PaintCanvas.vue";
import SettingBar from "./components/SettingBar.vue";
import ToolBar from "./components/ToolBar.vue";
export default {
  name: "App",
  components: {
    PaintCanvas,
    ToolBar,
    SettingBar,
  }
}
</script>

<style>
  @import "./styles/app.css";
</style>
