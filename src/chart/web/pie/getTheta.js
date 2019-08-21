module.exports = function(x, y, startOffset) {
    var theta = 0;
    if (y > 0) {
        theta = Math.acos(x / Math.sqrt(x * x + y * y));
    } else if (y < 0) {
        theta = 2 * Math.PI - Math.acos(x / Math.sqrt(x * x + y * y));
    } else {
        theta = x > 0 ? 0 : 2 * Math.PI;
    }
    if (theta - startOffset < 0) {
        theta += 2 * Math.PI;
    }
    return theta;
}
