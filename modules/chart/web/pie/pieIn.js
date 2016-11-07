var drawPie = require('./drawPie');
var drawInfo = require('./drawInfo');
var drawInfoOn = require('./drawInfoOn');

/**
 * 饼块缩进去，重绘的一系列操作
 * @param  {[type]} ctx    绘制上文
 * @param  {[type]} obj    饼块对象
 * @param  {[type]} point  饼状图圆点
 * @param  {[type]} radius 饼状图半径
 * @param  {[type]} ySpace 饼状图文字间距
 * @return {[type]}        无返回
 */
module.exports = function(ctx, obj, point, radius, ySpace, onPie) {
    var pieStartDegree = obj.start;
    var pieEndDegree = obj.end;
    var pieMiddleDegree = (pieStartDegree + pieEndDegree) / 2;
    drawPie(ctx, point, radius + 16, pieStartDegree, pieEndDegree, "white");
    if (onPie) {
        drawInfoOn(ctx, obj, radius, point, 16, true);
    }
    drawPie(ctx, point, radius, pieStartDegree, pieEndDegree, obj.color);
    if (onPie) {
        drawInfoOn(ctx, obj, radius, point, 12);
    } else {
        drawInfo(ctx, obj, radius, point, ySpace);
    }
}
