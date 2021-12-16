<template>
  <div>
    <canvas ref="cs" :id="canvasId" class="canvas-style"/>
  </div>
</template>


<script>
import paper from "paper";
import algoTools from "../algorithm/AlgoTools";
import grahamScan from "../algorithm/GrahamScan";

const complete = "#ee9a33";

export default {
  name: "HelloCanvas",
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
    clicked: false,
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
      }
    },
    init() {
      let fourCornerPoint = [{x: 400, y: 590}, {x: 401, y: 10}, {x: 10, y: 300}, {x: 790, y: 301}];
      this.points.push.apply(this.points, fourCornerPoint);
      for (let i = 0; i < this.points.length; i++) {
        let point = this.points[i];
        this.pointPathMap[point.x + "," + point.y] = this.drawPoint(this.scope, this.p2c(point), 10);
      }
      this.randomGeneratePoints(100, 275, 525, 175, 425);
      this.tool.onMouseDown = (event) => {
        if(this.clicked) {
          return;
        }
        this.clicked = true;
        let clickPoint = this.p2c(event.point);
        let nearestPoint = algoTools.getNearestPoint(clickPoint, this.points);
        if (nearestPoint) {
          let flag = false;
          for (let i = 0; i < fourCornerPoint.length; i++) {
            if (nearestPoint.x === fourCornerPoint[i].x && nearestPoint.y === fourCornerPoint[i].y) {
              flag = true;
              break;
            }
          }
          if (flag) {
            this.sendMessage("Great! Indeed, those 4 points are on a convex hull which includes all other points.");
          } else {
            this.sendMessage("What about these 4 points? It looks like they are on a convex hull which includes all other points.");
          }
          let convexHull = grahamScan.exec(this.points);
          for (let i = 0; i < convexHull.length; i++) {
            let point = convexHull[i];
            this.getPointPath(point).fillColor = complete;
            this.displayPath.add(this.p2c(point));
          }
          this.displayPath.add(this.p2c(convexHull[0]));
        }
      }
    }
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
