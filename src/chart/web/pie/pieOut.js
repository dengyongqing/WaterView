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
    var fontSize = ctx2.font.split("px ")[0] * 1;
    var baseHeight = radius / 50;
    var offSet = baseHeight;
    if (Math.sin((pieEndDegree - pieStartDegree) / 2) <= 0.0001) {
        offSet = baseHeight;//防止除数为零
    } else {
        offSet = baseHeight / Math.sin((pieEndDegree - pieStartDegree) / 2);
        if(offSet > radius/3){//防止半径为负
            offSet = radius/3;
        }
    }
    drawPie(ctx, point, radius + radius / 20, pieStartDegree, pieEndDegree, "white");
    //清除字
    if (onPie) {
        drawInfoOn(ctx2, obj, pies, radius, point, fontSize, true);
    } else {
        drawInfo(ctx2, obj, pies, radius, point, ySpace, 3);
    }
    drawPie(ctx, { //3/40
        x: point.x + offSet * Math.cos(pieMiddleDegree),
        y: point.y + offSet * Math.sin(pieMiddleDegree)
    }, (radius * 43 / 40 - offSet), pieStartDegree, pieEndDegree, obj.color);

    drawPie(ctx, { //2/40
        x: point.x + offSet * Math.cos(pieMiddleDegree),
        y: point.y + offSet * Math.sin(pieMiddleDegree)
    }, radius * 42 / 40 - offSet, pieStartDegree, pieEndDegree, "white", true);

    drawPie(ctx, { //1/40
        x: point.x + offSet * Math.cos(pieMiddleDegree),
        y: point.y + offSet * Math.sin(pieMiddleDegree)
    }, radius * 41 / 40 - offSet, pieStartDegree, pieEndDegree, obj.color);

    if (onPie) {
        drawInfoOn(ctx2, obj, pies, radius + radius / 40, point, fontSize + 4);
    } else { //写字
        drawInfo(ctx2, obj, radius, point, ySpace, 1);
    }
}
