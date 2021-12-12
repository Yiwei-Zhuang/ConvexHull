<template>
  <div>
    <canvas ref="cs" :id="canvasId" class="canvas-style" v-on:mousedown="mouseDown"/>
  </div>
</template>

<script>
const paper = require("paper")

export default {
  name: "PaperCanvas",
  props: ['canvasId'],
  data: () => ({
    path: null,
    scope: null,
    paths: [],
    GLOBAL_CANVAS_WIDTH: 800,
    GLOBAL_CANVAS_HEIGHT: 600,
  }),
  created() {

  },
  mounted() {
    this.scope = new paper.PaperScope();
    this.scope.setup(this.canvasId);
    this.drawPoint(this.scope, this.p2c(new paper.Point(400, 590)), 5);
    this.drawPoint(this.scope, this.p2c(new paper.Point(400, 10)), 5);
    this.drawPoint(this.scope, this.p2c(new paper.Point(10, 200)), 5);
    this.drawPoint(this.scope, this.p2c(new paper.Point(790, 200)), 5);

  },
  methods: {
    createTool(scope) {
      scope.activate();
      return new paper.Tool();
    },
    pathCreate(scope) {
      scope.activate();
      return new paper.Path({
        strokeColor: "#000000",
        strokeJoin: 'round',
        strokeWidth: 1.5
      })
    },
    drawPoint(scope, p, r, c = "#000000") {
      scope.activate();
      let path = new paper.Path.Circle(p, r);
      path.fillColor = c;
      return path;
    },
    mouseDown() {
      this.tool = this.createTool(this.scope);
      // this.tool.onMouseDown = (event) => {
      //   // init path
      //   this.path = this.pathCreate(this.scope);
      //   // add point to path
      //   this.path.add(event.point);
      // };
      // this.tool.onMouseDrag = (event) => {
      //   this.path.add(event);
      // };
      this.tool.onMouseUp = (event) => {
        // line completed
        // this.path.add(event.point);
        // this.paths.push(this.path);
        this.drawPoint(this.scope, event.point, 10);
      }
    },
    reset() {
      let temp = this.paths.pop();
      while (temp) {
        temp.remove();
        temp = this.paths.pop();
      }
      this.path = null;
      this.paths = [];
    },
    p2c(p) {
      return new paper.Point(p.x, this.GLOBAL_CANVAS_HEIGHT - p.y);
    }
  }
}
</script>

<style scoped>
.canvas-style {
  cursor: crosshair;
  width: 800px !important;
  height: 600px !important;
  border: 5px solid black;
  border-radius: 10px;
  display: block;
  margin: auto;
  box-shadow: 0 10px 8px -8px black;
  background-color: white;
}
</style>
