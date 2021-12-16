export default {
    getVector(p1, p2) {
        // Reverse Y
        return {x: p2.x - p1.x, y: p1.y - p2.y};
    },
    crossProduct(v1, v2) {
        return v1.x * v2.y - v2.x * v1.y
    },
    orient(p1, p2, p3) {
        let v1 = this.getVector(p1, p2);
        let v2 = this.getVector(p2, p3);
        return this.crossProduct(v1, v2);
    },
    getDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    },
    printPointList(points) {
        let list = [];
        for (let i = 0; i < points.length; i++) {
            list.push({x: points[i].x, y: points[i].y});
        }
        console.log(list);
    },
    getLineSlopeAndB(p1, p2) {
        let slope = (p2.y - p1.y) / (p2.x - p1.x);
        let b = p2.y - p2.x * slope;
        return [slope, b];
    },
    getNearestPoint(clickPoint, points) {
        let minDis = 10000000000;
        let minPoint = null;
        for (let i = 0; i < points.length; i++) {
            let tempPoint = points[i];
            let tempDis = this.getDistance(clickPoint, tempPoint);
            if (tempDis < minDis) {
                minDis = tempDis;
                minPoint = tempPoint;
            }
        }
        if (minDis < 20) {
            return minPoint;
        }
        return null;
    },
    getNextPoint(point, pointList) {
        for (let i = 0; i < pointList.length; i++) {
            if (point.x === pointList[i].x && point.y === pointList[i].y) {
                i = i + 1;
                if (i === pointList.length) {
                    return {x: pointList[0].x, y: pointList[0].y};
                } else {
                    return {x: pointList[i].x, y: pointList[i].y};
                }
            }
        }
    },
    getLastPoint(point, pointList) {
        for (let i = 0; i < pointList.length; i++) {
            if (point.x === pointList[i].x && point.y === pointList[i].y) {
                i = i - 1;
                if (i < 0) {
                    return {x: pointList[pointList.length - 1].x, y: pointList[pointList.length - 1].y};
                } else {
                    return {x: pointList[i].x, y: pointList[i].y};
                }
            }
        }
    },
    getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
}

