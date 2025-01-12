<template>
  <div>
    <ToolBar />
    <SettingBar />
    <PaintCanvas />
  </div>
</template>

<script>
import ToolBar from "./components/ToolBar.vue";
import SettingBar from "./components/SettingBar.vue";
import PaintCanvas from "./components/PaintCanvas.vue";

export default {
  name: "App",
  components: {
    ToolBar,
    SettingBar,
    PaintCanvas,
  },
  mounted() {
    if (!window.location.pathname || window.location.pathname === "/") {
      const newId = (+new Date()).toString(16);
      window.history.pushState({}, "", `/${newId}`);
    }
  },
};
</script>

<style>
@import "./styles/app.css";
</style>
