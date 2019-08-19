// 格式化坐标
var XYF = require('chart/web/common/xyf');

module.exports = function() {
    var dpr = this.options.dpr,
        cvs = this.options.canvas,
        ctx = this.options.context,
        datas = this.options.series,
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
    ctx.beginPath();
    for (var i = 0, len = datas.length; i < len; i++) {
        var dataObj = datas[i];
        var itemHeight = unitHeight / (1.618 * len + 0.618);
        var itemSpace = 0.618 * itemHeight;
        var color = "#7CB5EC";
        if (dataObj.color !== undefined) {
            color = dataObj.color;
        }
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        for (var j = 0, jLen = dataObj.data.length; j < jLen; j++) {
            var barWidth = Math.round(dataObj.data[j] / coordinate.min * (baseLine - paddingLeft));
            ctx.fillRect(baseLine - barWidth, XYF(paddingTop + unitHeight * j + itemSpace * (i + 1) + itemHeight*i), barWidth, itemHeight);
        }
    }
    ctx.restore();

}
