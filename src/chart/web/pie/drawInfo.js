/**
 * 绘制单个饼块的索引
 * @param  {[type]} ctx      绘制的上下文
 * @param  {[type]} pie      绘制的饼块对象
 * @param  {[type]} radius   冰块的半径
 * @param  {[type]} point    冰块的圆心
 * @param  {[type]} ySpace   索引文字的间距
 * @param  {[type]} status   是否只画触角
 * @return {[type]}          [description]
 */
module.exports = function(ctx, pie, radius, point, ySpace, status) {
    var top = point.y - radius - radius/10;
    var isNegative = Math.cos(pie.middle) / Math.abs(Math.cos(pie.middle));
    var BeginX = point.x + (radius) * Math.cos(pie.middle);
    var BeginY = point.y + (radius) * Math.sin(pie.middle);
    // var MiddleX = point.x + (radius+radius/10) * Math.cos(pie.middle);
    // var MiddleY = point.y + (radius+radius/10) * Math.sin(pie.middle);
    // var EndY = top + pie.yIndex * ySpace;
    // var theta = Math.asin(( MiddleY-point.y )/(radius+radius/9));
    // var EndX = MiddleX + isNegative*( radius/9);
    // 此处会出现问题，问题来源是设计，解决方法
    // 1. 设计为用贝塞尔曲线绘制，不用直线
    // 2. 改变绘制方法，先沿着中间弧度方向绘制，再绘制到文字绘制处
    // 3. 在顶层绘制（会出现不能遮盖的问题）
    var MiddleY = top + pie.yIndex * ySpace;
    var theta = Math.asin(( MiddleY-point.y )/(radius+radius/10));
    var MiddleX = point.x + isNegative*(radius + radius/10) * Math.cos(theta);
    var EndX = MiddleX + radius/10 * isNegative;
    if(pie.yIndex === 0){
        var tempX = radius/10 > 3 ? radius/10 : 3;
        MiddleX = EndX + tempX * isNegative;
        EndX = MiddleX + tempX * isNegative;
    }
    MiddleY = MiddleY + Math.sin(pie.middle) / Math.abs(Math.sin(pie.middle))*ySpace/2;
    var EndY = MiddleY;
    var textWidth = ctx.measureText(pie.name).width;
    var fontSize = ctx.font.split("px ")[0] * 1;
    var textHeight = fontSize;

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#666";
    ctx.textAlign = Math.cos(pie.middle) > 0 ? "start" : "end";
    ctx.textBaseline = "middle";
    if (!status) { //绘制动作(默认)
        ctx.fillStyle = "#666";
        ctx.fillText(pie.info, EndX + (Math.cos(pie.middle) > 0 ? 5 : -5), EndY);
        ctx.fillStyle = pie.color;
        ctx.arc(EndX + isNegative * 2, EndY, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.strokeStyle = pie.color;
        ctx.moveTo(BeginX, BeginY);
        ctx.lineTo(MiddleX, MiddleY);
        ctx.lineTo(EndX, EndY);
        ctx.stroke();
    } else {
        switch (status) {
            case 1:
                //绘制文字
                ctx.fillStyle = "#666";
                ctx.fillText(pie.info, EndX + (Math.cos(pie.middle) > 0 ? 5 : -5), EndY);
                ctx.fillStyle = pie.color;
                break;
            case 2:
                //绘制线
                ctx.fillStyle = pie.color;
                ctx.arc(EndX, EndY, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.strokeStyle = pie.color;
                ctx.moveTo(BeginX, BeginY);
                ctx.lineTo(MiddleX, MiddleY);
                ctx.lineTo(EndX, EndY);
                ctx.stroke();
                break;
            case 3:
                //清除文字
                ctx.fillStyle = "#fff";
                ctx.fillRect(EndX + (Math.cos(pie.middle) > 0 ? 5 : -textWidth - 5), EndY - textHeight / 2, textWidth, textHeight);
                break;
            case 4:
                //清除线
                ctx.strokeStyle = "#fff";
                ctx.lineWidth = 2;
                ctx.moveTo(BeginX, BeginY);
                ctx.lineTo(MiddleX, MiddleY);
                ctx.lineTo(EndX, EndY);
                ctx.stroke();
                break;
        }
    }
    ctx.restore();
}
