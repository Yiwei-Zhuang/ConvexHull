<template>
  <div>
    <canvas ref="cs" :id="canvasId" class="canvas-style"/>
  </div>
</template>

<script>
const paper = require("paper");
import grahamScan from "../algorithm/GrahamScan";

export default {
  name: "PaperCanvas",
  props: ['canvasId', 'type'],
  data: () => ({
    path: null,
    scope: null,
    tool: null,
    paths: [],
    GLOBAL_CANVAS_WIDTH: 800,
    GLOBAL_CANVAS_HEIGHT: 600,
    points: [],
    pointPathMap: {},
    addPoints: false,
  }),
  created() {

  },
  mounted() {
    this.scope = new paper.PaperScope();
    this.scope.setup(this.canvasId);
    this.tool = this.createTool(this.scope);
    if (this.type === 1) {
      let fourCornerPoint = [{x: 400, y: 590}, {x: 400, y: 10}, {x: 10, y: 300}, {x: 790, y: 300}];
      this.points.push.apply(this.points, fourCornerPoint);
      for (let i = 0; i < this.points.length; i++) {
        let point = this.points[i];
        this.pointPathMap[point.x + "," + point.y] = this.drawPoint(this.scope, this.p2c(point), 10);
      }
      for (let i = 0; i < 30; i++) {
        let tempX = this.getRandomArbitrary(200, 600);
        let tempY = this.getRandomArbitrary(100, 450);
        let key = tempX + "," + tempY;
        if (key in this.pointPathMap) {
          i--;
        } else {
          this.points.push({x: tempX, y: tempY});
          this.pointPathMap[key] = this.drawPoint(this.scope, this.p2c({x: tempX, y: tempY}), 10);
        }
      }

      this.tool.onMouseDown = (event) => {
        let clickPoint = this.p2c(event.point);
        if (this.type === 1) {
          let minDis = 1000000000;
          let minPoint = null;
          // let minIndex = -1;
          for (let i = 0; i < this.points.length; i++) {
            let tempPoint = this.points[i];
            let tempDis = this.getDistance(clickPoint, tempPoint);
            if (tempDis < minDis) {
              minDis = tempDis;
              minPoint = tempPoint;
              // minIndex = i
            }
          }
          if (minDis < 20) {
            // let key = minPoint.x + "," + minPoint.y;
            // this.pointPathMap[key].remove();
            // delete this.pointPathMap[key];
            // this.points.splice(minIndex, 1);
            let flag = false;
            for (let i = 0; i < fourCornerPoint.length; i++) {
              if (minPoint.x === fourCornerPoint[i].x && minPoint.y === fourCornerPoint[i].y) {
                flag = true;
                break;
              }
            }
            if (flag) {
              this.sendMessage("Great! It looks like those 4 points are on a convex hull which include all other points.");
            } else {
              this.sendMessage("What about these four points? It looks like they are on a convex hull which include all other points.");
            }
            let convexHull = grahamScan.exec(this.points);
            this.drawPolygon(null, convexHull);
          }
        } else {
          this.drawPoint(this.scope, event.point, 10);
        }
      }
    }

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
      let path = new paper.Path.Circle(new paper.Point(p.x, p.y), r);
      path.fillColor = c;
      return path;
    },
    drawPolygon(path, pointList, c = "#000000") {
      if (!path) {
        path = new paper.Path();
      }
      path.removeSegments();
      path.strokeColor = c;
      for (let i = 0; i < pointList.length; i++) {
        let point = this.p2c(pointList[i]);
        path.add(new paper.Point(point.x, point.y));
      }
      path.selected = true;
      path.closed = true;
      // for (let i = 0; i < pointList.length - 1; i++) {
      //     drawLine(pointList[i], pointList[i + 1], c);
      // }
      // drawLine(pointList[pointList.length - 1], pointList[0], c);
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
    },
    getRandomArbitrary(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    getDistance(p1, p2) {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    },
    sendMessage(msg) {
      this.$emit("message", msg);
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
