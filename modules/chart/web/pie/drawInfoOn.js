/**
 * 绘制扇形上的文字
 * @param  {[type]}  ctx      [description]
 * @param  {[type]}  pie      [description]
 * @param  {[type]}  radius   [description]
 * @param  {[type]}  point    [description]
 * @param  {[type]}  fontSize [description]
 * @param  {Boolean} isClear  [description]
 * @return {[type]}           [description]
 */
module.exports = function(ctx, pie, pies, radius, point, fontSize, isClear) {
    var x = point.x + (radius - 20) * Math.cos(pie.middle);
    var y = point.y + (radius - 20) * Math.sin(pie.middle);
    var inRight = Math.cos(pie.middle) >= 0 ? true : false;
    var fontFamily = ctx.font.split("px ")[1].trim();
    if (pie.showInfo) {
        ctx.beginPath();
        ctx.save();
        // debugger;
        ctx.font = fontSize + "px " + fontFamily;
        ctx.textBaseline = "middle";
        if (inRight) {
            ctx.textAlign = "start";
        } else {
            ctx.textAlign = "end";
        }
        if (!!isClear) { //清除（整片清除， 再写上出目标以外的文字）
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            for (var i = 0, len = pies.length; i < len; i++) {
                //重写除目标以外的所有文字
                if (pies[i].id !== pie.id) {
                    var tempIn = Math.cos(pies[i].middle) >= 0 ? true : false;
                    if (tempIn) {
                        ctx.textAlign = "start";
                    } else {
                        ctx.textAlign = "end";
                    }
                    var tempX = point.x + (radius - 20) * Math.cos(pies[i].middle);
                    var tempY = point.y + (radius - 20) * Math.sin(pies[i].middle);
                    ctx.fillText(pies[i].info, tempX, tempY);
                }
            }
        } else {
            ctx.fillText(pie.info, x, y);
        }
        ctx.restore();
    }

}
