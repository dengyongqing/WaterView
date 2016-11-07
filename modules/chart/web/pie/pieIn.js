var drawPie = require('./drawPie');
var drawInfo = require('./drawInfo');
/**
 * 饼块缩进去，重绘的一系列操作
 * @param  {[type]} ctx    绘制上文
 * @param  {[type]} obj    饼块对象
 * @param  {[type]} point  饼状图圆点
 * @param  {[type]} radius 饼状图半径
 * @param  {[type]} ySpace 饼状图文字间距
 * @return {[type]}        无返回
 */
module.exports = function (ctx, obj, point, radius, ySpace) {
    var pieStartDegree = obj.start;
    var pieEndDegree = obj.end;
    var pieMiddleDegree = (pieStartDegree + pieEndDegree) / 2;
    drawPie(ctx, point, radius + 21, pieStartDegree, pieEndDegree, "white");
    drawPie(ctx, point, radius, pieStartDegree, pieEndDegree, obj.color);
    drawInfo(ctx, obj, radius, point, ySpace, true);
}
