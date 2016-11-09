var drawPie = require('./drawPie');
var drawInfo = require('./drawInfo');
var drawInfoOn = require('./drawInfoOn');

/**
 * 饼块弹出
 * @param  {[type]} ctx    绘制上文
 * @param  {[type]} obj    进行弹出的饼块对象
 * @param  {[type]} point  饼块原点
 * @param  {[type]} radius 饼块半径
 * @return {[type]}        无返回
 */
module.exports = function(ctx, ctx2, obj, point, radius, ySpace, onPie) {
    var pieStartDegree = obj.start;
    var pieEndDegree = obj.end;
    var pieMiddleDegree = (pieStartDegree + pieEndDegree) / 2;
    var fontSize = ctx2.font.split("px ")[0]*1;
    drawPie(ctx, point, radius + 10, pieStartDegree, pieEndDegree, "white");
    if(onPie){
        drawInfoOn(ctx2, obj, radius, point, fontSize, true);
    }else{//清除字
        drawInfo(ctx, obj, radius, point, ySpace, 3);
    }
    drawPie(ctx, {
        x: point.x + 5 * Math.cos(pieMiddleDegree),
        y: point.y + 5 * Math.sin(pieMiddleDegree)
    }, radius + 10, pieStartDegree, pieEndDegree, obj.color);

    drawPie(ctx, {
        x: point.x + 5 * Math.cos(pieMiddleDegree),
        y: point.y + 5 * Math.sin(pieMiddleDegree)
    }, radius + 5, pieStartDegree, pieEndDegree, "white", true);

    drawPie(ctx, {
        x: point.x + 5 * Math.cos(pieMiddleDegree),
        y: point.y + 5 * Math.sin(pieMiddleDegree)
    }, radius, pieStartDegree, pieEndDegree, obj.color);

    if (onPie) {
        drawInfoOn(ctx2, obj, radius+5, point, fontSize+4);
    }else{//写字
        drawInfo(ctx, obj, radius, point, ySpace, 1);
    }
}
