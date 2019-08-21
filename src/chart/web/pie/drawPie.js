/**
 * 绘制单个饼块
 * @param  {[type]}  ctx     绘制上下文
 * @param  {[type]}  point   绘制的饼块的原点
 * @param  {[type]}  radius  绘制的饼块的半径
 * @param  {[type]}  start   绘制的饼块的开始弧度
 * @param  {[type]}  end     绘制的饼块的结束弧度
 * @param  {[type]}  color   绘制饼块的颜色
 * @param  {Boolean} isClear 是否只是做清除处理（保证不会出现脏图）
 * @return {[type]}          [description]
 */
module.exports = function (ctx, point, radius, start, end, color, isClear) {
    //绘制饼块
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color || "white";
    ctx.strokeStyle = "white";
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(point.x + radius * Math.cos(start), point.y + radius * Math.sin(start));
    ctx.arc(point.x, point.y, radius, start, end, false);
    ctx.lineTo(point.x, point.y);
    if (isClear) {
        ctx.stroke();
    }
    ctx.fill();
    ctx.restore();
}
