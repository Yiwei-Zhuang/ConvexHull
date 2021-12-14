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
    addPoints: true,
    convexHullList: [],
    convexHullPath: null,
    type2Counter: 0,
    type3LowestPoint: null,
    type3TangentLines: [],


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
      return path;
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
    pointNum() {
      return this.points.length;
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
            this.sendMessage("Great! Indeed, those 4 points are on a convex hull which includes all other points.");
          } else {
            this.sendMessage("What about these 4 points? It looks like they are on a convex hull which includes all other points.");
          }
          let convexHull = grahamScan.exec(this.points);
          for (let i = 0; i < convexHull.length; i++) {
            let point = convexHull[i];
            let circle = this.pointPathMap[point.x + "," + point.y];
            circle.fillColor = "#ee9a33";
          }
          let path = new paper.Path();
          this.drawPolygon(path, convexHull);
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
      // algoTools.printPointList(this.points);
      // algoTools.printPointList(convexHull);
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
      let xList = [];
      let tempX = this.getRandomArbitrary(700, 750);
      let tempY = this.getRandomArbitrary(500, 550);
      let key = tempX + "," + tempY;
      xList.push(tempX);
      this.points.push({x: tempX, y: tempY});
      this.pointPathMap[key] = this.drawPoint(this.scope, this.p2c({x: tempX, y: tempY}), 10);
      tempX = this.getRandomArbitrary(250, 350);
      tempY = this.getRandomArbitrary(50, 150);
      key = tempX + "," + tempY;
      xList.push(tempX);
      this.points.push({x: tempX, y: tempY});
      this.pointPathMap[key] = this.drawPoint(this.scope, this.p2c({x: tempX, y: tempY}), 10);
      for (let i = 0; i < 6; i++) {
        let tempX = this.getRandomArbitrary(50, 750);
        let tempY = this.getRandomArbitrary(50, 550);
        let key = tempX + "," + tempY;
        if (xList.includes(tempX) || key in this.pointPathMap) {
          i--;
        } else {
          xList.push(tempX);
          this.points.push({x: tempX, y: tempY});
          this.pointPathMap[key] = this.drawPoint(this.scope, this.p2c({x: tempX, y: tempY}), 10);
        }
      }
      this.convexHullList = grahamScan.exec(this.points);
    }
    ,
    initType4() {
      let xList = [];
      let yList = [];
      this.tool.onMouseDown = (event) => {
        if (this.addPoints) {
          let clickPoint = this.p2c(event.point);
          clickPoint.x = Math.floor(clickPoint.x);
          clickPoint.y = Math.floor(clickPoint.y);
          if (!xList.includes(clickPoint.x) && !yList.includes(clickPoint.y)) {
            this.points.push({x: clickPoint.x, y: clickPoint.y});
            this.pointPathMap[clickPoint.x + "," + clickPoint.y] = this.drawPoint(this.scope, this.p2c({
              x: clickPoint.x,
              y: clickPoint.y
            }), 10);
            xList.push(clickPoint.x);
            yList.push(clickPoint.y);
          }
        }
      }
    }
    ,
    initType5() {

    },
    async show(index) {
      this.$emit("lock");
      if (this.type === 3) {
        if (index === 0) {
          for (let i = 0; i < this.points.length; i++) {
            let tempCircle = this.pointPathMap[this.points[i].x + "," + this.points[i].y];
            tempCircle.fillColor = "#000000";
          }
          for (let i = 0; i < this.type3TangentLines.length; i++) {
            this.type3TangentLines[i].line.remove();
          }
          this.type3TangentLines = [];
          let minPoint = null;
          let lastPoint = null;
          for (let i = 0; i < this.points.length; i++) {
            if (lastPoint && lastPoint.x !== minPoint.x && lastPoint.y !== minPoint.y) {
              let tempCircle = this.pointPathMap[lastPoint.x + "," + lastPoint.y];
              tempCircle.fillColor = "#000000";
            }
            let checkPoint = this.points[i];
            let checkCircle = this.pointPathMap[checkPoint.x + "," + checkPoint.y];
            checkCircle.fillColor = "#FF0000";
            if (minPoint === null) {
              minPoint = checkPoint;
              checkCircle.fillColor = "#ee9a33";
            } else {
              if (checkPoint.y < minPoint.y) {
                let tempCircle = this.pointPathMap[minPoint.x + "," + minPoint.y];
                minPoint = checkPoint;
                tempCircle.fillColor = "#000000";
                checkCircle.fillColor = "#ee9a33";
              }
            }
            lastPoint = checkPoint;
            await new Promise(r => setTimeout(r, 500));
          }
          this.type3LowestPoint = minPoint;
          if (lastPoint && lastPoint.x !== minPoint.x && lastPoint.y !== minPoint.y) {
            let tempCircle = this.pointPathMap[lastPoint.x + "," + lastPoint.y];
            tempCircle.fillColor = "#000000";
          }
        } else if (index === 1) {
          this.sendMessage("The horizontal line could not pass the convex hull because all other points are above it.");
          for (let i = 0; i < this.type3TangentLines.length; i++) {
            this.type3TangentLines[i].line.remove();
          }
          this.type3TangentLines = [];
          this.type3TangentLines.push({
            p0: {x: this.type3LowestPoint.x, y: this.type3LowestPoint.y},
            p1: {x: 0, y: this.type3LowestPoint.y},
            p2: {x: 800, y: this.type3LowestPoint.y},
            line: this.drawLineSegment(this.p2c({x: 0, y: this.type3LowestPoint.y}), this.p2c({
              x: 800,
              y: this.type3LowestPoint.y
            })),
          });
        } else if (index === 2) {
          for (let i = 1; i < this.type3TangentLines.length; i++) {
            this.type3TangentLines[i].line.remove();
          }
          this.type3TangentLines = [this.type3TangentLines[0]];
          this.sendMessage("Although it looks like we can easily get it through rotation, we actually need O(n) to" +
              " compare lines' slopes that cross target point and all other points.");
          let x1 = this.type3LowestPoint.x;
          let y1 = this.type3LowestPoint.y;
          let nextPoint = this.getNextPointPosOnConvexHull(this.type3LowestPoint, this.convexHullList);
          let x2 = nextPoint.x;
          let y2 = nextPoint.y;
          let lineSegment = this.type3TangentLines[0].line;
          let passPoint = this.type3TangentLines[0].p0;
          let b = passPoint.y;
          let theta = 0;
          while (theta === theta) {
            theta += 1;
            if (theta === 90) {
              theta += 1;
            }
            let tanT = Math.tan(theta * Math.PI / 180);
            b = passPoint.y - tanT * passPoint.x;
            x1 = 0;
            y1 = b;
            x2 = this.GLOBAL_CANVAS_WIDTH;
            y2 = x2 * tanT + b;
            let tempY = nextPoint.x * tanT + b;
            let o = algoTools.orient(passPoint, {x: nextPoint.x, y: tempY}, nextPoint);
            if (o > 0) {
              break;
            }
            lineSegment.remove();
            lineSegment = this.drawLineSegment(this.p2c({x: x1, y: y1}), this.p2c({x: x2, y: y2}));
            this.type3TangentLines[0].line = lineSegment;
            await new Promise(r => setTimeout(r, 20));
          }
        } else if (index === 3) {
          this.sendMessage("Each step uses last step's slope and arriving point as start configuration");
          if (this.convexHullPath) {
            this.convexHullPath.removeSegments();
          }
          for (let i = 1; i < this.type3TangentLines.length; i++) {
            this.type3TangentLines[i].line.remove();
          }
          this.type3TangentLines = [this.type3TangentLines[0]];
          this.type3TangentLines[0].line.opacity = 1;
          await new Promise(r => setTimeout(r, 1000));
          let tempPoint = this.getNextPointPosOnConvexHull(this.type3TangentLines[0].p0, this.convexHullList);
          let tempNextPoint = this.getNextPointPosOnConvexHull(tempPoint, this.convexHullList);
          for (let i = 0; i < this.convexHullList.length - 1; i++) {
            let lineFunc = algoTools.getLineSlopeAndB(tempPoint, tempNextPoint);
            let x1 = 0;
            let y1 = lineFunc[1];
            let x2 = 800;
            let y2 = x2 * lineFunc[0] + lineFunc[1];
            this.type3TangentLines.push({
              p0: {x: tempPoint.x, y: tempPoint.y},
              line: this.drawLineSegment(this.p2c({x: x1, y: y1}), this.p2c({x: x2, y: y2})),
            })
            tempPoint = tempNextPoint;
            tempNextPoint = this.getNextPointPosOnConvexHull(tempPoint, this.convexHullList);
            await new Promise(r => setTimeout(r, 1000));
          }
        } else if (index === 4) {
          this.sendMessage("Here is the convex hull");
          for (let i = 0; i < this.type3TangentLines.length; i++) {
            this.type3TangentLines[i].line.opacity = 0;
          }
          this.convexHullPath = this.drawPolygon(this.convexHullPath, this.convexHullList);
        }
      } else if (this.type === 4) {
        console.log("here")
        this.addPoints = false;
        if (index === 0) {
          this.sendMessage("We are going to sort points by their x coordinate ascending.");
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
          for(let i = 0; i < pointList.length; i++) {
            let circle = this.pointPathMap[pointList[i].x+","+pointList[i].y];
            circle.opacity = (1 - (pointList.length - i) / pointList.length)/2+0.3;
          }
        } else if (index === 1) {
          alert("1");
        }
      }
      this.$emit("unlock");
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
