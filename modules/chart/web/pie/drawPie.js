// 绘制单个饼块
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
