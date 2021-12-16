<template>
  <div>
    <canvas ref="cs" :id="canvasId" class="canvas-style"/>
  </div>
</template>

<script>
import paper from "paper";
import grahamScan from "../algorithm/GrahamScan";
import algoTools from "../algorithm/AlgoTools";

const complete = "#ee9a33";

export default {
  name: "WheelCanvas",
  props: ['canvasId'],
  data: () => ({
    path: null,
    scope: null,
    tool: null,
    GLOBAL_CANVAS_WIDTH: 800,
    GLOBAL_CANVAS_HEIGHT: 600,
    points: [],
    pointPathMap: {},
    pointTangentPathMap: {},
    sortedPoints: [],
    addPoints: true,
    clickedPoints: [],
    convexHullList: [],
    convexHullPath: null,
    displayPath: null,
    displayPointList: [],
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
    init() {
      let centerX = 400;
      let centerY = 300;
      let r = 200;
      let pointNum = 10;
      let angleInterval = 360 / pointNum;
      let xList = [];
      let yList = [];
      for (let i = 0; i < pointNum; i++) {
        let x = Math.floor(centerX + r * Math.cos(angleInterval * i * Math.PI / 180));
        let y = Math.floor(centerY + r * Math.sin(angleInterval * i * Math.PI / 180));
        if (y - centerY === 0) {
          y++;
        }
        while (xList.includes(x)) {
          x += 1;
        }
        while (yList.includes(y)) {
          y += 1;
        }
        xList.push(x);
        yList.push(y);
        this.points.push({x: x, y: y});
        this.pointPathMap[x + "," + y] = this.drawPoint(this.scope, this.p2c({x: x, y: y}), 10);
      }
      this.convexHullList = grahamScan.exec(this.points.slice());
      this.tool.onMouseDown = async (event) => {
        let clickPoint = this.p2c(event.point);
        let nearestPoint = algoTools.getNearestPoint(clickPoint, this.points);
        if (nearestPoint == null) {
          return;
        }
        let pointKey = nearestPoint.x + "," + nearestPoint.y;
        if (!this.clickedPoints.includes(pointKey)) {
          let nextPoint = algoTools.getNextPoint(nearestPoint, this.convexHullList);
          this.clickedPoints.push(pointKey);
          this.getPointPath(nearestPoint).fillColor = complete;
          // Draw tangent line for the point.
          if (nearestPoint.y - centerY === 0) {
            // For vertical line
            // Important: We avoid this situation when we initialize our points on a ring.
          } else {
            // For line's slope !== infinite
            let x1 = 0;
            let y1 = (-1 * (x1 - nearestPoint.x) * (nearestPoint.x - centerX)) / (nearestPoint.y - centerY) + nearestPoint.y;
            let x2 = this.GLOBAL_CANVAS_WIDTH;
            let y2 = (-1 * (x2 - nearestPoint.x) * (nearestPoint.x - centerX)) / (nearestPoint.y - centerY) + nearestPoint.y;
            let slope = (y2 - y1) / (x2 - x1);
            let theta = Math.atan(slope) * 180 / Math.PI;
            let path = new paper.Path({
              strokeColor: "#000000",
            });
            path.add(this.p2c({x: x1, y: y1}));
            path.add(this.p2c({x: x2, y: y2}));
            this.pointTangentPathMap[pointKey] = path;
            let b = nearestPoint.y - slope * nearestPoint.x;
            while (slope === slope) {
              theta += 1;
              slope = Math.tan(theta * Math.PI / 180);
              b = nearestPoint.y - slope * nearestPoint.x;
              x1 = 0;
              y1 = b;
              x2 = this.GLOBAL_CANVAS_WIDTH;
              y2 = x2 * slope + b;
              let tempY = nextPoint.x * slope + b;
              if (algoTools.orient(nearestPoint, {x: nextPoint.x, y: tempY}, nextPoint) > 0) {
                break;
              }
              this.pointTangentPathMap[pointKey].removeSegments();
              let path = new paper.Path({
                strokeColor: "#000000",
              });
              path.add(this.p2c({x: x1, y: y1}));
              path.add(this.p2c({x: x2, y: y2}));
              this.pointTangentPathMap[pointKey] = path;
              await new Promise(r => setTimeout(r, 20));
            }
          }
          if (Object.keys(this.pointTangentPathMap).length === this.points.length) {
            this.sendMessage("It seems like \"tangent lines\" could bound the convex hull.");
          }
        }
      }
    },
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
