// 绘制单个指标
module.exports = function(ctx, pie, radius, point, ySpace, onlyLine) {
    var top = point.y - radius - 20;
    var isNegative = Math.cos(pie.middle) / Math.abs(Math.cos(pie.middle));
    var BeginX = point.x + (radius) * Math.cos(pie.middle);
    var BeginY = point.y + (radius) * Math.sin(pie.middle);
    var MiddleX = point.x + (radius) * Math.cos(pie.middle) + 15 * isNegative;
    var MiddleY = top + pie.yIndex * ySpace;
    var EndX = MiddleX + 20 * isNegative;
    var EndY = top + pie.yIndex * ySpace;

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#666";
    ctx.font = "12px";
    ctx.textAlign = Math.cos(pie.middle) > 0 ? "start" : "end";
    ctx.textBaseline = "middle";
    if (!onlyLine) {
        ctx.fillText(pie.name, EndX + (Math.cos(pie.middle) > 0 ? 5 : -5), EndY);
        ctx.fillStyle = pie.color;
        ctx.arc(EndX + isNegative * 2, EndY, 2, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.moveTo(BeginX, BeginY);
        ctx.lineTo(MiddleX, MiddleY);
        ctx.lineTo(EndX, EndY);
        ctx.stroke();
    }
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.strokeStyle = pie.color;
    ctx.moveTo(BeginX, BeginY);
    ctx.lineTo(MiddleX, MiddleY);
    ctx.lineTo(EndX, EndY);
    ctx.stroke();
    ctx.restore();
}
