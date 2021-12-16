<template>
  <div>
    <Nav ref="nav"/>
    <h1 class="subtitle">{{ msg }}</h1>
    <WheelCanvas :canvasId="'canvas-one'" ref="pc" @message="getMessage"/>
  </div>
</template>

<script>
import WheelCanvas from "../components/WheelCanvas";
import Nav from "../components/Nav";

export default {
  name: "Wheel",
  components: {WheelCanvas, Nav},
  data() {
    return {
      msg: "What about this point set? Click on a point you think it should be on the convex hull."
    }
  },
  methods: {
    getMessage(msg) {
      this.msg = msg;
    }
  }
}
</script>

<style scoped>

</style>
