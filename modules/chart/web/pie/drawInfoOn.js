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
module.exports = function(ctx, pie, radius, point, fontSize, isClear) {
    var x = point.x + (radius - 20) * Math.cos(pie.middle);
    var y = point.y + (radius - 20) * Math.sin(pie.middle);
    var inRight = Math.cos(pie.middle) >= 0 ? true : false;
    if (pie.showInfo) {
        ctx.beginPath();
        ctx.save();
        ctx.font = fontSize + "px Arial";
        ctx.textBaseline = "middle";
        if (inRight) {
            ctx.textAlign = "start";
        } else {
            ctx.textAlign = "end";
        }
        if (isClear) {
            ctx.fillStyle = "white";
            ctx.fillText(pie.value, x, y);
            // if (!inRight) {
            //     x = x - ctx.measureText(pie.value).width;
            // }
            // ctx.clearRect(x, y - fontSize / 2, ctx.measureText(pie.value).width, fontSize);
        } else {
            ctx.fillText(pie.value, x, y);
        }
        ctx.restore();
    }

}
