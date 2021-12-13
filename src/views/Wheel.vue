<template>
  <div>
    <Nav ref="nav"/>
    <h1 class="title">{{ msg }}</h1>
    <PaperCanvas :type="2" :canvasId="'canvas-one'" ref="pc" @message="getMessage"/>
  </div>
</template>

<script>
import PaperCanvas from "../components/PaperCanvas";
import Nav from "../components/Nav";

export default {
  name: "Wheel",
  components: {PaperCanvas, Nav},
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
