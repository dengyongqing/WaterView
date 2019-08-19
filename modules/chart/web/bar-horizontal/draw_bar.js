// 格式化坐标
var XYF = require('chart/web/common/xyf');

module.exports = function() {
    var dpr = this.options.dpr,
        cvs = this.options.canvas,
        ctx = this.options.context,
        datas = this.options.series.data,
        yaxis = this.options.yaxis;

    var coordinate = this.options.coordinate,
        sepeNum = this.options.sepeNum,
        unitHeight = this.options.unitHeight,
        paddingLeft = this.options.padding.left,
        paddingRight = this.options.padding.right,
        paddingTop = this.options.padding.top,
        totalWidth = (cvs.width - paddingLeft - paddingRight),
        baseLine = XYF(paddingLeft + totalWidth / sepeNum * (-coordinate.min / coordinate.stepHeight));

    var color = this.options.color,
        hoverColor = this.options.hoverColor;

    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (var i = 0, len = datas.length; i < len; i++) {
    	ctx.save();
    	/*单个定制的颜色*/
        if (yaxis[i].color !== undefined) {
            ctx.fillStyle = yaxis[i].color;
            ctx.strokeStyle = yaxis[i].color;
        }
        if (datas[i] < 0) { /*柱体占的比例为1/2*/
            var barWidth = Math.round(datas[i] / coordinate.min * (baseLine - paddingLeft));
            ctx.fillRect(baseLine - barWidth, XYF(paddingTop + unitHeight * (i + 1 / 4)), barWidth, Math.round(unitHeight / 2));
        } else {
            ctx.fillRect(baseLine, XYF(paddingTop + unitHeight * (i + 1 / 4)), Math.round(datas[i] / coordinate.max * (totalWidth - (baseLine - paddingLeft))), Math.round(unitHeight / 2));
        }
        ctx.restore();
    }
    ctx.restore();

}
