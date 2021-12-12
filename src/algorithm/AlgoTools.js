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
    }
}

