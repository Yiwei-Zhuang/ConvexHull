<template>
  <div>
    <canvas ref="cs" :id="canvasId" class="canvas-style"/>
  </div>
</template>

<script>
const paper = require("paper");
import grahamScan from "../algorithm/GrahamScan";
import algoTools from "../algorithm/AlgoTools";

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
    type2Counter: 0,
  }),
  created() {

  },
  mounted() {
    this.scope = new paper.PaperScope();
    this.scope.setup(this.canvasId);
    this.tool = this.createTool(this.scope);
    if (this.type === 1) {
      this.initType1();
    } else if (this.type === 2) {
      this.initType2();
    } else if (this.type === 3) {
      this.initType3();
    } else if (this.type === 4) {
      this.initType4();
    } else if (this.type === 5) {
      this.initType5();
    } else {
      alert("E-Doz");
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
    drawLineSegment(p1, p2, c = "#000000") {
      let path = new paper.Path();
      path.strokeColor = c;
      path.add(new paper.Point(p1.x, p1.y), new paper.Point(p2.x, p2.y));
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
      return new paper.Point(p.x, Math.floor(this.GLOBAL_CANVAS_HEIGHT - p.y));
    },
    getRandomArbitrary(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    getNearestPoint(clickPoint, points) {
      let minDis = 1000000000;
      let minPoint = null;
      // let minIndex = -1;
      for (let i = 0; i < points.length; i++) {
        let tempPoint = points[i];
        let tempDis = algoTools.getDistance(clickPoint, tempPoint);
        if (tempDis < minDis) {
          minDis = tempDis;
          minPoint = tempPoint;
          // minIndex = i
        }
      }
      if (minDis < 20) {
        return minPoint;
      }
      return null;
    },
    getNextPointPosOnConvexHull(point, convexHull) {
      for (let i = 0; i < convexHull.length; i++) {
        if (point.x === convexHull[i].x && point.y === convexHull[i].y) {
          i = i + 1;
          if (i === convexHull.length) {
            return {x: convexHull[0].x, y: convexHull[0].y};
          } else {
            return {x: convexHull[i].x, y: convexHull[i].y};
          }
        }
      }
    },
    sendMessage(msg) {
      this.$emit("message", msg);
    },
    initType1() {
      let fourCornerPoint = [{x: 400, y: 590}, {x: 401, y: 10}, {x: 10, y: 300}, {x: 790, y: 300}];
      this.points.push.apply(this.points, fourCornerPoint);
      for (let i = 0; i < this.points.length; i++) {
        let point = this.points[i];
        this.pointPathMap[point.x + "," + point.y] = this.drawPoint(this.scope, this.p2c(point), 10);
      }
      let xList = [400, 401, 10, 790];
      for (let i = 0; i < 50; i++) {
        let tempX = this.getRandomArbitrary(250, 550);
        let tempY = this.getRandomArbitrary(150, 450);
        let key = tempX + "," + tempY;
        if (xList.includes(tempX) || key in this.pointPathMap) {
          i--;
        } else {
          xList.push(tempX);
          this.points.push({x: tempX, y: tempY});
          this.pointPathMap[key] = this.drawPoint(this.scope, this.p2c({x: tempX, y: tempY}), 10);
        }
      }
      this.tool.onMouseDown = (event) => {
        let clickPoint = this.p2c(event.point);
        let nearestPoint = this.getNearestPoint(clickPoint, this.points);
        if (nearestPoint) {
          let flag = false;
          for (let i = 0; i < fourCornerPoint.length; i++) {
            if (nearestPoint.x === fourCornerPoint[i].x && nearestPoint.y === fourCornerPoint[i].y) {
              flag = true;
              break;
            }
          }
          if (flag) {
            this.sendMessage("Great! It looks like those 4 points are on a convex hull which include all other points.");
          } else {
            this.sendMessage("What about these 4 points? It looks like they are on a convex hull which include all other points.");
          }
          let convexHull = grahamScan.exec(this.points);
          for (let i = 0; i < convexHull.length; i++) {
            let point = convexHull[i];
            let circle = this.pointPathMap[point.x + "," + point.y];
            circle.fillColor = "#ee9a33";
          }
          let path = new paper.Path();
          this.drawPolygon(path, convexHull);
          console.log(convexHull);
        }
      }
    }
    ,
    initType2() {
      let centerX = 400;
      let centerY = 300;
      let r = 200;
      let pointNum = 8;
      let angleInterval = 360 / pointNum;
      let decagon = null;
      let clickedPoints = [];
      let xList = [];
      // decagon.fillColor = '#e9e9ff';
      for (let i = 0; i < pointNum; i++) {
        let x = Math.floor(centerX + r * Math.cos(angleInterval * i * Math.PI / 180));
        let y = Math.floor(centerY + r * Math.sin(angleInterval * i * Math.PI / 180));
        while (xList.includes(x)) {
          x += 1;
        }
        xList.push(x);
        this.points.push({x: x, y: y});
        this.pointPathMap[x + "," + y] = this.drawPoint(this.scope, this.p2c({x: x, y: y}), 10);
      }
      let newList = this.points.slice();
      let convexHull = grahamScan.exec(newList);
      algoTools.printPointList(this.points);
      algoTools.printPointList(convexHull);
      this.tool.onMouseDown = async (event) => {
        let clickPoint = this.p2c(event.point);
        let nearestPoint = this.getNearestPoint(clickPoint, this.points);
        if (nearestPoint && !clickedPoints.includes(nearestPoint.x + "," + nearestPoint.y)) {
          let nextPoint = this.getNextPointPosOnConvexHull(nearestPoint, convexHull);
          clickedPoints.push(nearestPoint.x + "," + nearestPoint.y);
          let circle = this.pointPathMap[nearestPoint.x + "," + nearestPoint.y];
          circle.fillColor = "#ee9a33";
          if (nearestPoint.y - centerY === 0) {
            this.drawLineSegment({x: nearestPoint.x, y: 0}, {
              x: nearestPoint.x,
              y: this.GLOBAL_CANVAS_HEIGHT
            });
          } else {
            let x1 = 0;
            let y1 = (-1 * (x1 - nearestPoint.x) * (nearestPoint.x - centerX)) / (nearestPoint.y - centerY) + nearestPoint.y;
            let x2 = this.GLOBAL_CANVAS_WIDTH;
            let y2 = (-1 * (x2 - nearestPoint.x) * (nearestPoint.x - centerX)) / (nearestPoint.y - centerY) + nearestPoint.y;
            let slope = (y2 - y1) / (x2 - x1);
            let lineSegment = this.drawLineSegment(this.p2c({x: x1, y: y1}), this.p2c({x: x2, y: y2}));
            let b = nearestPoint.y - slope * nearestPoint.x;
            while (slope === slope) {
              slope += 0.04;
              b = nearestPoint.y - slope * nearestPoint.x;
              x1 = 0;
              y1 = b;
              x2 = this.GLOBAL_CANVAS_WIDTH;
              y2 = x2 * slope + b;
              let tempY = nextPoint.x * slope + b;
              if (algoTools.orient(nearestPoint, {x: nextPoint.x, y: tempY}, nextPoint) > 0) {
                break;
              }
              lineSegment.remove();
              lineSegment = this.drawLineSegment(this.p2c({x: x1, y: y1}), this.p2c({x: x2, y: y2}));
              await new Promise(r => setTimeout(r, 20));
            }
          }
          this.type2Counter++;
          if (this.type2Counter === pointNum) {
            let path = new paper.Path();
            this.drawPolygon(path, this.points);
            this.sendMessage("It seems like \"tangent lines\" could bound the convex hull.");
            decagon = new paper.Path.RegularPolygon(new paper.Point(centerX, centerY), 8, 200);
            decagon.style = {
              fillColor: '#e9e9ff',
            };
            decagon.rotate(25);
            while (decagon) {
              decagon.rotate(1);
              await new Promise(r => setTimeout(r, 20));
            }
          }
        }
      }
    }
    ,
    initType3() {

    }
    ,
    initType4() {

    }
    ,
    initType5() {

    }
    ,
    initType6() {

    }
    ,
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
