import algoTool from "./AlgoTools";
import grahamScan from "./GrahamScan";

let a = 1;
const DIVIDE = 1;
const BRUTAL = 2;
const MERGE = 3;
const CONNECT_TANGENT = 4;
const LEFT = 0;
const RIGHT = 1;

function nextPointIndex(pl, index) {
    let retIndex = index + 1;
    if (retIndex === pl.length) {
        retIndex = 0;
    }
    return retIndex;
}

function previousPointIndex(pl, index) {
    let retIndex = index - 1;
    if (retIndex === -1) {
        retIndex = pl.length - 1;
    }
    return retIndex;
}

function rightMostPointIndex(pl) {
    let rightMostX = -1; // Start at (0,0)
    let rightMostXIndex = -1;
    for (let i = 0; i < pl.length; i++) {
        if (pl[i].x > rightMostX) {
            rightMostX = pl[i].x;
            rightMostXIndex = i;
        }
    }
    return rightMostXIndex;
}

function leftMostPointIndex(pl) {
    let leftMostX = Number.MAX_VALUE;
    let leftMostXIndex = Number.MAX_VALUE;
    for (let i = 0; i < pl.length; i++) {
        if (pl[i].x < leftMostX) {
            leftMostX = pl[i].x;
            leftMostXIndex = i;
        }
    }
    return leftMostXIndex;
}

function mergeSubHull(pointList1, pointList2, process) {
    let pl1MinX = pointList1[leftMostPointIndex(pointList1)].x;
    let pl1MaxX = pointList1[rightMostPointIndex(pointList1)].x
    let pl2MinX = pointList2[leftMostPointIndex(pointList2)].x;
    let pl2MaxX = pointList2[rightMostPointIndex(pointList2)].x
    if (pointList1.length < 6) {
        pointList1 = grahamScan.exec(pointList1);
        process.push({
            type: BRUTAL,
            points: pointList1.slice(),
            part: LEFT,
            xMin: pl1MinX,
            xMax: pl2MaxX,
            message: "Use any way you like to find the convex hull for this small point set.",
        })
    } else {
        let mid = Math.floor(pointList1.length / 2);
        let leftPart = pointList1.slice(0, mid);
        let rightPart = pointList1.slice(mid, pointList1.length);
        process.push({
            type: DIVIDE,
            left: leftPart.slice(),
            right: rightPart.slice(),
            mid: pointList1[mid],
            xMin: pl1MinX,
            xMax: pl1MaxX,
            message: "Divide current sub-point set into left part and right part.",
        })
        pointList1 = mergeSubHull(leftPart, rightPart, process);
    }
    if (pointList2.length < 6) {
        pointList2 = grahamScan.exec(pointList2);
        process.push({
            type: BRUTAL,
            points: pointList2.slice(),
            part: RIGHT,
            xMin:pl1MinX,
            xMax: pl2MaxX,
            message: "Use any way you like to find the convex hull for this small point set.",
        })
    } else {
        let mid = Math.floor(pointList2.length / 2);
        let leftPart = pointList2.slice(0, mid);
        let rightPart = pointList2.slice(mid, pointList2.length);
        process.push({
            type: DIVIDE,
            left: leftPart.slice(),
            right: rightPart.slice(),
            mid: pointList2[mid],
            xMin: pl2MinX,
            xMax: pl2MaxX,
            message: "Divide current sub-point set into left part and right part.",
        })
        pointList2 = mergeSubHull(leftPart, rightPart, process);
    }
    let pl1RightMostIndex = rightMostPointIndex(pointList1);
    let pl2LeftMostIndex = leftMostPointIndex(pointList2);
    process.push({
        type: MERGE, // Ready to merge two parts
        left: pointList1.slice(),
        right: pointList2.slice(),
        xMin: pl1MinX,
        xMax: pl2MaxX,
        message: "Left and right parts' convex hull has been constructed.",
    })
    // Find upper tangent
    let upperTangentLeftIndex = pl1RightMostIndex;
    let upperTangentRightIndex = pl2LeftMostIndex;
    while (a === 1) {
        let nextLeftPointIndex = nextPointIndex(pointList1, upperTangentLeftIndex);
        while (algoTool.orient(pointList2[upperTangentRightIndex], pointList1[upperTangentLeftIndex], pointList1[nextLeftPointIndex]) > 0) {
            upperTangentLeftIndex = nextLeftPointIndex;
            nextLeftPointIndex = nextPointIndex(pointList1, upperTangentLeftIndex);
        }
        let previousRightPointIndex = previousPointIndex(pointList2, upperTangentRightIndex);
        while (algoTool.orient(pointList2[previousRightPointIndex], pointList2[upperTangentRightIndex], pointList1[upperTangentLeftIndex]) > 0) {
            upperTangentRightIndex = previousRightPointIndex;
            previousRightPointIndex = previousPointIndex(pointList2, upperTangentRightIndex);
        }
        if (algoTool.orient(pointList2[upperTangentRightIndex], pointList1[upperTangentLeftIndex], pointList1[nextLeftPointIndex]) < 0) {
            break;
        }
    }
    // Find lower tangent
    let lowerTangentLeftIndex = pl1RightMostIndex;
    let lowerTangentRightIndex = pl2LeftMostIndex;
    while (a === 1) {
        let nextRightPointIndex = nextPointIndex(pointList2, lowerTangentRightIndex);
        while (algoTool.orient(pointList1[lowerTangentLeftIndex], pointList2[lowerTangentRightIndex], pointList2[nextRightPointIndex]) > 0) {
            lowerTangentRightIndex = nextRightPointIndex;
            nextRightPointIndex = nextPointIndex(pointList2, lowerTangentRightIndex);
        }
        let previousLeftPointIndex = previousPointIndex(pointList1, lowerTangentLeftIndex);
        while (algoTool.orient(pointList1[previousLeftPointIndex], pointList1[lowerTangentLeftIndex], pointList2[lowerTangentRightIndex]) > 0) {
            lowerTangentLeftIndex = previousLeftPointIndex;
            previousLeftPointIndex = previousPointIndex(pointList1, lowerTangentLeftIndex);
        }
        if (algoTool.orient(pointList1[lowerTangentLeftIndex], pointList2[lowerTangentRightIndex], pointList2[nextRightPointIndex]) < 0) {
            break;
        }
    }
    // Merge two point lists
    let leftPointList = [];
    let rightPointList = [];
    let leftFlag = false;
    let rightFlag = false;
    for (let i = upperTangentLeftIndex; i < pointList1.length; i++) {
        leftPointList.push(pointList1[i]);
        if (i === lowerTangentLeftIndex) {
            leftFlag = true;
            break;
        }
    }
    if (!leftFlag) {
        for (let i = 0; i <= lowerTangentLeftIndex; i++) {
            leftPointList.push(pointList1[i]);
        }
    }
    for (let i = lowerTangentRightIndex; i < pointList2.length; i++) {
        rightPointList.push(pointList2[i]);
        if (i === upperTangentRightIndex) {
            rightFlag = true;
            break;
        }
    }
    if (!rightFlag) {
        for (let i = 0; i <= upperTangentRightIndex; i++) {
            rightPointList.push(pointList2[i]);
        }
    }
    leftPointList.push.apply(leftPointList, rightPointList);
    process[process.length - 1].whole = leftPointList.slice();
    process.push({
        type: CONNECT_TANGENT,
        points: leftPointList,
        xMin: pl1MinX,
        xMax: pl2MaxX,
        message: "Connect tangent lines in linear time.",
    })
    return leftPointList;
}

export default {
    exec(pointList) {
        if (pointList.length < 4) {
            return pointList;
        }
        // Sort point list by x-coordinate
        pointList.sort(function (p1, p2) {
            let x1 = p1.x
            let x2 = p2.x;
            if (x1 === x2) {
                p2.x += 0.00001;
            }
            if (x1 < x2) {
                return -1;
            }
            if (x1 > x2) {
                return 1;
            }
        });
        let mid = Math.floor(pointList.length / 2);
        let leftPart = pointList.slice(0, mid);
        let rightPart = pointList.slice(mid, pointList.length);
        let process = [{
            type: DIVIDE, // divide
            left: leftPart.slice(),
            right: rightPart.slice(),
            mid: pointList[mid],
            xMin: pointList[0].x,
            xMax: pointList[pointList.length - 1].x,
            message: "Divide current sub-point set into left part and right part.",
        }];
        let result = mergeSubHull(leftPart, rightPart, process)
        return {
            result: result,
            process: process
        };
    },
}
