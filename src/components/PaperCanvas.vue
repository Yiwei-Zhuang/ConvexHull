<template>
  <div>
    <canvas ref="cs" :id="canvasId" class="canvas-style"/>
  </div>
</template>

<script>
const paper = require("paper");
import grahamScan from "../algorithm/GrahamScan";
import mergeHull from "../algorithm/MergeHull";
import algoTools from "../algorithm/AlgoTools";

const primary = "#00d1b2";
const link = "#3273dc";
const complete = "#ee9a33";

export default {
  name: "PaperCanvas",
  props: ['canvasId', 'type'],
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
    type2Counter: 0,
    type3LowestPoint: null,
    type3TangentLines: [],
    type4PointIndex: 0,
    type5LeftPath: null,
    type5RightPath: null,
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
      for (const [, value] of Object.entries(this.pointPathMap)) {
        value.remove();
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
      if (this.type5LeftPath != null) {
        this.type5LeftPath.removeSegments();
        this.type5LeftPath = null;
      }
      if (this.type5RightPath != null) {
        this.type5RightPath.removeSegments();
        this.type5RightPath = null;
      }
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
    getPointPath(point) {
      return this.pointPathMap[point.x + "," + point.y];
    },
    currentTurn() {
      if (this.displayPointList.length < 2) {
        return -1;
      }
      let p1 = this.displayPointList[this.displayPointList.length - 2];
      let p2 = this.displayPointList[this.displayPointList.length - 1];
      let p3 = this.sortedPoints[this.type4PointIndex];
      return algoTools.orient(p1, p2, p3);
    },
    endOfCheck() {
      return this.sortedPoints.length > 0 && this.type4PointIndex >= this.sortedPoints.length;
    },
    printStates() {
      for (let i = 0; i < this.states.length; i++) {
        let state = this.states[i];
        console.log({
          color: state.pointsColor,
          index: state.index,
          type4PointIndex: state.type4PointIndex,
          displayPathPoints: state.displayPathPoints,
        });
      }
    },
    saveState(index, message) {
      let pointsColor = [];
      let displayPathPoints = [];
      for (let i = 0; i < this.points.length; i++) {
        pointsColor.push(this.getPointPath(this.points[i]).fillColor);
      }
      let segments = this.displayPath.segments;
      for (let i = 0; i < segments.length; i++) {
        displayPathPoints.push({x: segments[i].point.x, y: segments[i].point.y});
      }
      this.states.push({
        message: message,
        index: index,
        type4PointIndex: this.type4PointIndex,
        pointsColor: pointsColor,
        displayPointList: this.displayPointList,
        displayPathPoints: displayPathPoints,
      });
    },
    readState(step) {
      let state = this.states[step];
      if (!state) {
        return;
      }
      this.resetDisplay();
      this.type4PointIndex = state.type4PointIndex;
      let pointsColor = state.pointsColor;
      for (let i = 0; i < this.points.length; i++) {
        this.getPointPath(this.points[i]).fillColor = pointsColor[i];
      }
      let displayPathPoints = state.displayPathPoints;
      for (let i = 0; i < displayPathPoints.length; i++) {
        this.displayPath.add(displayPathPoints[i]);
      }
      this.displayPointList = state.displayPointList;
      this.sendMessage(state.message);
      return state.index;
    },
    nextState() {
      if (this.step + 1 < this.states.length) {
        this.step++;
        return this.readState(this.step);
      } else {
        return null;
      }
    },
    lastState() {
      if (this.step - 1 >= 0) {
        this.step--;
        return this.readState(this.step);
      } else {
        return null;
      }
    },
    type5ReadState() {
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
      } else if (state.type === 3) {
        // Conquer
        let left = state.left;
        let right = state.right;
        let leftColor = primary;
        let rightColor = link;
        this.type5LeftPath = new paper.Path({
          strokeColor: "#000000",
        });
        this.type5RightPath = new paper.Path({
          strokeColor: "#000000",
        });
        for (let j = 0; j < left.length; j++) {
          this.getPointPath(left[j]).fillColor = leftColor;
          this.type5LeftPath.add(this.p2c(left[j]));
        }
        this.type5LeftPath.add(this.p2c(left[0]));
        for (let j = 0; j < right.length; j++) {
          this.getPointPath(right[j]).fillColor = rightColor;
          this.type5RightPath.add(this.p2c(right[j]));
        }
        this.type5RightPath.add(this.p2c(right[0]));
      } else if (state.type === 4) {
        // Find and connect tangent line
        for (let j = 0; j < state.points.length; j++) {
          this.displayPath.add(this.p2c(state.points[j]));
          this.getPointPath(state.points[j]).fillColor = complete;
        }
        this.displayPath.add(this.p2c(state.points[0]));
      }
      return state.type;
    },
    type5NextState() {
      if (this.step + 1 < this.states.length) {
        this.step++;
        return this.type5ReadState();
      } else {
        return null;
      }
    },
    type5LastState() {
      if (this.step - 1 >= 0) {
        this.step--;
        return this.type5ReadState();
      } else {
        return null;
      }
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
            circle.fillColor = complete;
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
          circle.fillColor = complete;
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
              checkCircle.fillColor = complete;
            } else {
              if (checkPoint.y < minPoint.y) {
                let tempCircle = this.pointPathMap[minPoint.x + "," + minPoint.y];
                minPoint = checkPoint;
                tempCircle.fillColor = "#000000";
                checkCircle.fillColor = complete;
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
        let message = "";
        this.addPoints = false;
        if (this.convexHullList.length < 3) {
          this.convexHullList = grahamScan.exec(this.points);
        }
        this.step++;
        if (this.step < this.states.length) {
          this.readState(this.step);
        } else {
          this.readState(this.step - 1); // Load the newest state.
          if (index === 0) {
            message = "Point color becomes darker as its x coordinate increasing.";
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
          } else if (index === 1) {
            message = "Initialize lower hull by adding first two points from sorted point list to lower hull path."
            let point1 = this.p2c(this.sortedPoints[0]);
            let point2 = this.p2c(this.sortedPoints[1]);
            this.displayPath.add(new paper.Point(point1.x, point1.y));
            this.displayPath.add(new paper.Point(point2.x, point2.y));
            this.displayPointList.push(this.sortedPoints[0], this.sortedPoints[1]);
            this.type4PointIndex = 2;
          } else if (index === 2) {
            if (this.displayPointList.length < 2) {
              message = "Because there are only one point in lower hull path," +
                  " we can directly add P3 to the lower hull path and check next point.";
              this.displayPointList.push(this.sortedPoints[this.type4PointIndex]);
              this.displayPath.add(this.p2c(this.sortedPoints[this.type4PointIndex]));
              this.type4PointIndex++;
            } else {
              message = "Yellow points are P1, P2; Red point is P3.";
            }
            let p1 = this.displayPointList[this.displayPointList.length - 2];
            let p2 = this.displayPointList[this.displayPointList.length - 1];
            this.getPointPath(p1).fillColor = complete;
            this.getPointPath(p2).fillColor = complete;
            if (this.endOfCheck()) {
              message = "There are only two possible points could be on lower hull, so we have nothing need to do" +
                  " but connect them.";
            } else {
              let p3 = this.sortedPoints[this.type4PointIndex];
              this.getPointPath(p3).fillColor = "#FF0000";
            }
          } else if (index === 3) {
            message = "Connect P1 P2 P3 in order.";
            let p3 = this.sortedPoints[this.type4PointIndex];
            this.displayPath.add(this.p2c(p3));
          } else if (index === 4) {
            message = "Here is partial lower hull.";
            let p3 = this.sortedPoints[this.type4PointIndex];
            this.getPointPath(p3).fillColor = complete;
            this.displayPointList.push(p3);
            this.type4PointIndex++;
          } else if (index === 5) {
            message = "Remove P2 in convex hull path for the reason it is above line segment P1P3.";
            let p2 = this.displayPointList.pop();
            this.getPointPath(p2).fillColor = "#000000";
            this.displayPath.removeSegment(this.displayPath.segments.length - 1);
            this.displayPath.removeSegment(this.displayPath.segments.length - 1);
          } else if (index === 6) {
            message = "The algorithm has almost been finished since the algorithm for lower hull can be used for upper" +
                " hull if we rotate the whole graph 180 degree.";
          } else if (index === 7) {
            message = "Great! We found all points on convex hull in CCW order."
            this.resetDisplay();
            for (let i = 0; i < this.convexHullList.length; i++) {
              this.getPointPath(this.convexHullList[i]).fillColor = complete;
              this.displayPath.add(this.p2c(this.convexHullList[i]));
            }
            this.displayPath.add(this.p2c(this.convexHullList[0]));
          }
          this.sendMessage(message);
          this.saveState(index, message);
        }
      } else if (this.type === 5) {
        let message = "";
        this.addPoints = false;
        if (this.convexHullList.length < 3) {
          let mergeHullResult = mergeHull.exec(this.points);
          this.states = mergeHullResult.process;
          this.convexHullList = mergeHullResult.result;
        }
        if (index === 0) {
          this.resetDisplay();
          message = "Point color becomes darker as its x coordinate increasing.";
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
        }
        this.sendMessage(message);
      }
      this.$emit("unlock");
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
