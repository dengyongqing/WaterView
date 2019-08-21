/*绘制xy轴*/
var extend = require("tools/extend2");
var draw_dash = require("chart/web/common/draw_dash_line");
// 格式化坐标
var XYF = require('chart/web/common/xyf');
var common = require('chart/web/common/common');
var DrawXY = (function() {
    function DrawXY(options) {
        this.options = {};
        this.options = extend(this.options, options);

        this.draw();
    }

    DrawXY.prototype.init = function() {
        // x轴上设置
        this.options.xSplitShow = false; //是否进行分割
        this.options.xShowDivide = false; //是否显示分割标志

    }

    DrawXY.prototype.draw = function() {
        this.init();
        var paddingTop = this.options.padding.top,
            paddingLeft = this.options.padding.left,
            paddingRight = this.options.padding.right,
            paddingBottom = this.options.padding.bottom;

        var ctx = this.options.context,
            canvas = this.options.canvas,
            arr_y = this.options.yaxis,
            arr_data = this.options.series.data,
            unitHeight = this.options.unitHeight,
            dpr = this.options.dpr;

        var coordinate = this.options.coordinate,
            maxX = coordinate.max,
            minX = coordinate.min,
            stepWidth = coordinate.stepHeight,
            sepeNum = this.options.sepeNum,
            totalWidth = canvas.width - paddingLeft - paddingRight,
            baseLine = paddingLeft + (maxX / stepWidth) * (totalWidth) / sepeNum,
            unitWidth = totalWidth / sepeNum;

        /*开始进行绘制*/
        ctx.save();
        var y_bottom = XYF(Math.round(canvas.height - paddingBottom));
        var y_top = XYF(Math.round(paddingTop));
        var x_left = XYF(Math.round(paddingLeft));
        var x_right = XYF(Math.round(canvas.width - paddingRight));
        /*框*/
        ctx.strokeStyle = "#C9C9C9";
        ctx.beginPath();

        ctx.moveTo(x_left, y_bottom);
        ctx.lineTo(x_right, y_bottom);

        ctx.moveTo(x_left, y_bottom);
        ctx.lineTo(x_left, y_top);

        ctx.moveTo(x_left, y_top);
        ctx.lineTo(x_right, y_top);

        ctx.moveTo(x_right, y_bottom);
        ctx.lineTo(x_right, y_top);
        ctx.stroke();

        /*纵标*/
        ctx.save();
        ctx.beginPath();
        ctx.textAlign = "end";
        ctx.textBaseline = "middle";
        for (var i = 0, len = arr_y.length; i < len; i++) {
            var textWidth = ctx.measureText(arr_y[i].value).width;
            if (arr_y[i].show) {
                ctx.fillText(arr_y[i].value, paddingLeft - 8 * dpr, y_top + i * unitHeight + unitHeight / 2);
                ctx.moveTo(paddingLeft - 4 * dpr, XYF(y_top + i * unitHeight + unitHeight / 2));
                ctx.lineTo(paddingLeft, XYF(y_top + i * unitHeight + unitHeight / 2));
            }
        }
        ctx.stroke();
        ctx.restore();

        /*分割线*/
        for (i = 1, len = sepeNum; i < len; i++) {
            ctx.beginPath();
            if (i == -minX / stepWidth) {
                ctx.moveTo(XYF(unitWidth * i + paddingLeft), y_top);
                ctx.lineTo(XYF(unitWidth * i + paddingLeft), y_bottom);
                ctx.stroke();
            } else {
                draw_dash(ctx, unitWidth * i + paddingLeft, y_top,
                    unitWidth * i + paddingLeft, y_bottom, 3);
            }
        }
        /*横标刻度*/
        ctx.save();
        var yMax = this.options.coordinateMaxY;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        var markStep = yMax / sepeNum;
        ctx.beginPath();
        for (i = 0; i <= sepeNum; i++) {
            ctx.fillText(roundFloat(minX + i * stepWidth, stepWidth), XYF(unitWidth * i + paddingLeft), y_bottom + 7 * dpr);
            ctx.moveTo(XYF(unitWidth * i + paddingLeft), y_bottom);
            ctx.lineTo(XYF(unitWidth * i + paddingLeft), y_bottom + 5 * dpr);
            ctx.stroke();
        }
        ctx.restore();
    }


    function roundFloat(f, stepHeight) {
        var precise = 1;
        if (stepHeight.toString().indexOf(".") !== -1) {
            precise = stepHeight.toString().length - stepHeight.toString().indexOf(".") - 1;
        }
        var m = Math.pow(10, precise);
        return common.format_unit(Math.round(f * m) / m, precise);
    }

    return DrawXY;
})();


module.exports = DrawXY;
