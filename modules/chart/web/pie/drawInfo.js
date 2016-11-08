/**
 * 绘制单个饼块的索引
 * @param  {[type]} ctx      绘制的上下文
 * @param  {[type]} pie      绘制的饼块对象
 * @param  {[type]} radius   冰块的半径
 * @param  {[type]} point    冰块的圆心
 * @param  {[type]} ySpace   索引文字的间距
 * @param  {[type]} onlyLine 是否只画触角
 * @return {[type]}          [description]
 */
module.exports = function(ctx, pie, radius, point, ySpace, onlyLine) {
    var top = point.y - radius - 20;
    var isNegative = Math.cos(pie.middle) / Math.abs(Math.cos(pie.middle));
    var BeginX = point.x + (radius) * Math.cos(pie.middle);
    var BeginY = point.y + (radius) * Math.sin(pie.middle);
    var MiddleX = point.x + (radius) * Math.cos(pie.middle) + 15 * isNegative;
    var MiddleY = top + pie.yIndex * ySpace;
    var EndX = MiddleX + 20 * isNegative;
    var EndY = top + pie.yIndex * ySpace;
    var textWidth = ctx.measureText(pie.name).width;
    var textHeight = 12;

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#666";
    ctx.font = "12px";
    ctx.textAlign = Math.cos(pie.middle) > 0 ? "start" : "end";
    ctx.textBaseline = "middle";
    if (!onlyLine) {//不只画触角
        // ctx.clearRect(EndX + (Math.cos(pie.middle) > 0 ? 5 : -5), EndY - textHeight/2, textWidth, textHeight);
        ctx.fillText(pie.info, EndX + (Math.cos(pie.middle) > 0 ? 5 : -5), EndY);
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
