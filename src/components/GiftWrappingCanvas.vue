<template>
  <div>
    <canvas ref="cs" :id="canvasId" class="canvas-style"/>
  </div>
</template>


<script>
import paper from "paper";
import mergeHull from "../algorithm/MergeHull";
import algoTools from "../algorithm/AlgoTools";

const complete = "#ee9a33";

export default {
  name: "GiftWrappingCanvas",
  props: ['canvasId'],
  data: () => ({
    path: null,
    scope: null,
    tool: null,
    GLOBAL_CANVAS_WIDTH: 800,
    GLOBAL_CANVAS_HEIGHT: 600,
    points: [],
    pointPathMap: {},
    sortedPoints: [],
    addPoints: true,
    convexHullList: [],
    convexHullPath: null,
    displayPath: null,
    displayPointList: [],
    states: [],
    step: -1,
    rotateTangentLine: null,
  }),
  created() {

  },
  mounted() {
    this.scope = new paper.PaperScope();
    this.scope.setup(this.canvasId);
    this.tool = this.createTool(this.scope);
    this.displayPath = new paper.Path({
      strokeColor: "#000000",
    });
    this.init();
  },
  methods: {
    createTool(scope) {
      scope.activate();
      return new paper.Tool();
    },
    drawPoint(scope, p, r, c = "#000000") {
      scope.activate();
      let path = new paper.Path.Circle(new paper.Point(p.x, p.y), r);
      path.fillColor = c;
      return path;
    },
    pointNum() {
      return this.points.length;
    },
    getPointPath(point) {
      return this.pointPathMap[point.x + "," + point.y];
    },
    p2c(p) {
      return new paper.Point(p.x, Math.floor(this.GLOBAL_CANVAS_HEIGHT - p.y));
    },
    sendMessage(msg) {
      this.$emit("message", msg);
    },
    reset() {
      for (const [, value] of Object.entries(this.pointPathMap)) {
        value.removeSegments();
      }
      this.pointPathMap = {};
      this.points = [];
      this.sortedPoints = [];
      this.addPoints = true;
      this.convexHullList = [];
      if (this.convexHullPath) {
        this.convexHullPath.removeSegments();
      }
      this.convexHullPath = null;
      this.resetDisplay();
      this.states = [];
      this.step = -1;
    },
    resetDisplay() {
      for (let i = 0; i < this.points.length; i++) {
        this.getPointPath(this.points[i]).fillColor = "#000000";
      }
      if (this.displayPath) {
        this.displayPath.removeSegments();
      }
      this.displayPath = new paper.Path({
        strokeColor: "#000000",
      });
      this.displayPointList = [];
      if (this.leftPath != null) {
        this.leftPath.removeSegments();
        this.leftPath = null;
      }
      if (this.rightPath != null) {
        this.rightPath.removeSegments();
        this.rightPath = null;
      }
      if (this.searchAreaPath != null) {
        this.searchAreaPath.removeSegments();
        this.searchAreaPath = null;
      }
      if (this.rotateTangentLine != null) {
        this.rotateTangentLine.removeSegments();
        this.rotateTangentLine = null;
      }
    },
    init() {
      this.tool.onMouseDown = (event) => {
        if (this.addPoints) {
          if (this.pointNum() > 200) {
            this.sendMessage("Max point number has been set to 200.");
            return;
          }
          let clickPoint = this.p2c(event.point);
          clickPoint.x = Math.floor(clickPoint.x);
          clickPoint.y = Math.floor(clickPoint.y);
          for (let i = 0; i < this.points.length; i++) {
            if (this.points[i].x === clickPoint.x || this.points[i].y === clickPoint.y) {
              return;
            }
          }
          this.points.push({x: clickPoint.x, y: clickPoint.y});
          this.pointPathMap[clickPoint.x + "," + clickPoint.y] = this.drawPoint(this.scope, this.p2c({
            x: clickPoint.x,
            y: clickPoint.y
          }), 10);
        }
      }
    },
    prepare() {
      this.addPoints = false;
      if (this.convexHullList.length < 3) {
        let mergeHullResult = mergeHull.exec(this.points);
        this.convexHullList = mergeHullResult.result;
      }
      // Find lowest point
      let minPointIndex;
      let minPoint = 100000000;
      for (let i = 0; i < this.convexHullList.length; i++) {
        if (this.convexHullList[i].y < minPoint) {
          minPoint = this.convexHullList[i].y;
          minPointIndex = i;
        }
      }
      // Reorder convex hull list so that the lowest point become the first element.
      for (let i = 0; i < minPointIndex; i++) {
        this.convexHullList.push(this.convexHullList[i]);
      }
      this.convexHullList = this.convexHullList.slice(minPointIndex);
      this.states = this.convexHullList;
      this.resetDisplay();
      let btnPoint = this.convexHullList[0];
      this.getPointPath(btnPoint).fillColor = complete;
      this.sendMessage("The lowest point must be on convex hull.");
    },
    async readState() {
      this.resetDisplay();
      this.sendMessage("Although it looks like we can easily get next point by rotating tangent line CCW till" +
          " reaching another point, it actually needs O(n) to compare slopes for each point pair.");
      for (let i = 0; i <= this.step; i++) {
        this.displayPath.add(this.p2c(this.states[i]));
        this.getPointPath(this.states[i]).fillColor = complete;
      }
      let point = this.states[this.step];
      let nextPoint = algoTools.getNextPoint(point, this.states);
      let lastPoint = algoTools.getLastPoint(point, this.states);
      let slope = (lastPoint.y - point.y) / (lastPoint.x - point.x);
      let targetSlope = (nextPoint.y - point.y) / (nextPoint.x - point.x);
      let targetTheta = Math.floor(Math.atan(targetSlope) * 180 / Math.PI);
      if (this.step === 0) {
        slope = 0;
      }
      let b = point.y - slope * point.x;
      let x1 = 0;
      let y1 = b;
      let x2 = this.GLOBAL_CANVAS_WIDTH;
      let y2 = x2 * slope + b;
      let path = new paper.Path({
        strokeColor: "#000000",
      });
      path.add(this.p2c({x: x1, y: y1}));
      path.add(this.p2c({x: x2, y: y2}));
      this.rotateTangentLine = path;
      let theta = Math.floor(Math.atan(slope) * 180 / Math.PI);
      while (targetTheta !== theta && targetTheta + 180 !== theta) {
        slope = Math.tan(theta * Math.PI / 180);
        b = point.y - slope * point.x;
        x1 = 0;
        y1 = b;
        x2 = this.GLOBAL_CANVAS_WIDTH;
        y2 = x2 * slope + b;
        this.rotateTangentLine.removeSegments();
        let path = new paper.Path({
          strokeColor: "#000000",
        });
        path.add(this.p2c({x: x1, y: y1}));
        path.add(this.p2c({x: x2, y: y2}));
        this.rotateTangentLine = path;
        await new Promise(r => setTimeout(r, 20));
        theta++;
      }
      this.rotateTangentLine.removeSegments();
      this.displayPath.add(this.p2c(nextPoint));
      this.getPointPath(nextPoint).fillColor = complete;
      return this.step;
    },
    async nextState() {
      if (this.step + 1 < this.states.length) {
        this.step++;
        return await this.readState();
      } else {
        return null;
      }
    },
    async lastState() {
      if (this.step - 1 >= 0) {
        this.step--;
        return await this.readState();
      } else {
        return null;
      }
    }
  }
}
</script>

<style scoped>
.canvas-style {
  /*cursor: crosshair;*/
  cursor: pointer;
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

