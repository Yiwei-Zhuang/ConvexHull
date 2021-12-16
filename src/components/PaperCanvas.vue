<template>
  <div>
    <canvas ref="cs" :id="canvasId" class="canvas-style"/>
  </div>
</template>

<script>
const paper = require("paper");
import grahamScan from "../algorithm/GrahamScan";
import algoTools from "../algorithm/AlgoTools";

// const primary = "#00d1b2";
// const link = "#3273dc";
const complete = "#ee9a33";
const danger = "#ff3860";

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
    searchAreaPath: null,
    states: [],
    step: -1,
    type4PointIndex: 0,
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
    if (this.type === 4) {
      this.initType4();
    } else {
      alert("E-Doz");
    }
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
      this.type4PointIndex = 0;
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
      if (this.searchAreaPath != null) {
        this.searchAreaPath.removeSegments();
        this.searchAreaPath = null;
      }
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
    }
    ,
    initType4() {
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
    }
    ,
    async show(index) {
      this.$emit("lock");
      if (this.type === 4) {
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
              this.getPointPath(p3).fillColor = danger;
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
