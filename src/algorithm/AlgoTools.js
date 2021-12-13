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
    }
}

