<template>
  <div>
    <canvas ref="cs" :id="canvasId" class="canvas-style"/>
  </div>
</template>

<script>
import paper from "paper";
import mergeHull from "../algorithm/MergeHull";
import algoTools from "../algorithm/AlgoTools";

const primary = "#00d1b2";
const link = "#3273dc";
const complete = "#ee9a33";
const danger = "#ff3860";


export default {
  name: "MergeHullCanvas",
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
    searchAreaPath: null,
    states: [],
    step: -1,
    leftPath: null,
    rightPath: null,
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
    },
    p2c(p) {
      return new paper.Point(p.x, Math.floor(this.GLOBAL_CANVAS_HEIGHT - p.y));
    },
    displaySearchArea(xMin, xMax) {
      this.searchAreaPath = new paper.Path({
        strokeColor: danger,
        strokeWidth: 3,
      });
      this.searchAreaPath.add({x: xMin, y: 0});
      this.searchAreaPath.add({x: xMin, y: this.GLOBAL_CANVAS_HEIGHT});
      this.searchAreaPath.add({x: xMax, y: this.GLOBAL_CANVAS_HEIGHT});
      this.searchAreaPath.add({x: xMax, y: 0});
      this.searchAreaPath.add({x: xMin, y: 0});
    },
    sendMessage(msg) {
      this.$emit("message", msg);
    },
    randomGeneratePoints(pointsNum, xMin, xMax, yMin, yMax) {
      // X and Y coordinates are without repetitions.
      if (this.addPoints) {
        let xArray = [];
        let yArray = [];
        if (xMax > this.GLOBAL_CANVAS_WIDTH) {
          xMax = this.GLOBAL_CANVAS_WIDTH;
        }
        if (yMax > this.GLOBAL_CANVAS_HEIGHT) {
          yMax = this.GLOBAL_CANVAS_HEIGHT;
        }
        for (let i = xMin; i < xMax; i++) {
          xArray.push(i);
        }
        for (let i = yMin; i < yMax; i++) {
          yArray.push(i);
        }
        for (let i = 0; i < this.points.length; i++) {
          let xIndex = xArray.indexOf(this.points[i].x);
          let yIndex = yArray.indexOf(this.points[i].y);
          if (xIndex !== -1) {
            xArray.splice(xIndex, 1);
          }
          if (yIndex !== -1) {
            yArray.splice(yIndex, 1);
          }
        }
        for (let i = 0; i < pointsNum; i++) {
          let tempXIndex = algoTools.getRandomArbitrary(0, xArray.length - 1);
          let tempYIndex = algoTools.getRandomArbitrary(0, yArray.length - 1);
          let tempX = xArray[tempXIndex];
          let tempY = yArray[tempYIndex];
          xArray.splice(tempXIndex, 1);
          yArray.splice(tempYIndex, 1);
          let key = tempX + "," + tempY;
          this.points.push({x: tempX, y: tempY});
          this.pointPathMap[key] = this.drawPoint(this.scope, this.p2c({x: tempX, y: tempY}), 10);
        }
        return true;
      } else {
        return false;
      }
    },
    pointNum() {
      return this.points.length;
    },
    getPointPath(point) {
      return this.pointPathMap[point.x + "," + point.y];
    },
    readState() {
      this.resetDisplay();
      let state = this.states[this.step];
      if (state.type === 1) {
        // Divide
        let left = state.left;
        let right = state.right;
        let leftColor = primary;
        let rightColor = link;
        for (let j = 0; j < left.length; j++) {
          this.getPointPath(left[j]).fillColor = leftColor;
        }
        for (let j = 0; j < right.length; j++) {
          this.getPointPath(right[j]).fillColor = rightColor;
        }
        this.displaySearchArea(state.xMin, state.xMax);
      } else if (state.type === 2) {
        // Brutal force compute convex hull
        let color = primary;
        if (state.part === 1) {
          color = link;
        }
        for (let j = 0; j < state.points.length; j++) {
          this.displayPath.add(this.p2c(state.points[j]));
          this.getPointPath(state.points[j]).fillColor = color;
        }
        this.displayPath.add(this.p2c(state.points[0]));
        this.displaySearchArea(state.xMin, state.xMax);
      } else if (state.type === 3) {
        // Merge
        let left = state.left;
        let right = state.right;
        let leftColor = primary;
        let rightColor = link;
        this.leftPath = new paper.Path({
          strokeColor: "#000000",
        });
        this.rightPath = new paper.Path({
          strokeColor: "#000000",
        });
        for (let j = 0; j < left.length; j++) {
          this.getPointPath(left[j]).fillColor = leftColor;
          this.leftPath.add(this.p2c(left[j]));
        }
        this.leftPath.add(this.p2c(left[0]));
        for (let j = 0; j < right.length; j++) {
          this.getPointPath(right[j]).fillColor = rightColor;
          this.rightPath.add(this.p2c(right[j]));
        }
        this.rightPath.add(this.p2c(right[0]));
        this.displaySearchArea(state.xMin, state.xMax);
      } else if (state.type === 4) {
        // Find and connect tangent line
        for (let j = 0; j < state.points.length; j++) {
          this.displayPath.add(this.p2c(state.points[j]));
          this.getPointPath(state.points[j]).fillColor = complete;
        }
        this.displayPath.add(this.p2c(state.points[0]));
        this.displaySearchArea(state.xMin, state.xMax);
      }
      this.sendMessage(state.message);
      return state.type;
    },
    nextState() {
      if (this.step + 1 < this.states.length) {
        this.step++;
        return this.readState();
      } else {
        return null;
      }
    },
    lastState() {
      if (this.step - 1 >= 0) {
        this.step--;
        return this.readState();
      } else {
        return null;
      }
    },
    prepare() {
      this.addPoints = false;
      if (this.convexHullList.length < 3) {
        let mergeHullResult = mergeHull.exec(this.points);
        this.states = mergeHullResult.process;
        this.convexHullList = mergeHullResult.result;
      }
      this.resetDisplay();
      let pointList = this.points.slice();
      pointList.sort(function (p1, p2) {
        let x1 = p1.x
        let x2 = p2.x;
        if (x1 === x2) {
          p2.x += 0.00001; // Impossible!
        }
        if (x1 < x2) {
          return -1;
        }
        if (x1 > x2) {
          return 1;
        }
      });
      this.sortedPoints = pointList.slice();
      for (let i = 0; i < pointList.length; i++) {
        let circle = this.pointPathMap[pointList[i].x + "," + pointList[i].y];
        circle.opacity = (1 - (pointList.length - i) / pointList.length) / 2 + 0.3;
      }
      this.sendMessage("Point color becomes darker as its x coordinate increasing.");
    },
  },
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
