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
module.exports = function(ctx, ctx2, obj, pies, point, radius, ySpace, onPie) {
    var pieStartDegree = obj.start;
    var pieEndDegree = obj.end;
    var pieMiddleDegree = (pieStartDegree + pieEndDegree) / 2;
    var fontSize = ctx2.font.split("px ")[0]*1;
    drawPie(ctx, point, radius + radius/20, pieStartDegree, pieEndDegree, "white");
    //清除字
    if(onPie){
        drawInfoOn(ctx2, obj, pies, radius, point, fontSize, true);
    }else{
        drawInfo(ctx, obj, pies, radius, point, ySpace, 3);
    }
    drawPie(ctx, {
        x: point.x + radius/40 * Math.cos(pieMiddleDegree),
        y: point.y + radius/40 * Math.sin(pieMiddleDegree)
    }, radius + radius/20, pieStartDegree, pieEndDegree, obj.color);

    drawPie(ctx, {
        x: point.x + radius/40 * Math.cos(pieMiddleDegree),
        y: point.y + radius/40 * Math.sin(pieMiddleDegree)
    }, radius + radius/40, pieStartDegree, pieEndDegree, "white", true);

    drawPie(ctx, {
        x: point.x + radius/40 * Math.cos(pieMiddleDegree),
        y: point.y + radius/40 * Math.sin(pieMiddleDegree)
    }, radius, pieStartDegree, pieEndDegree, obj.color);

    if (onPie) {
        drawInfoOn(ctx2, obj, pies, radius+radius/40, point, fontSize+4);
    }else{//写字
        drawInfo(ctx, obj, radius, point, ySpace, 1);
    }
}
