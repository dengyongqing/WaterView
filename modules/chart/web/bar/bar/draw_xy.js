/*绘制xy轴*/
var extend = require("tools/extend2");
var draw_dash = require("chart/mobile/common/draw_dash_line");
// 格式化坐标
var XYF = require('chart/web/common/xyf');
var common = require('chart/web/common/common');
// 自定义X轴标识
var self_fillText = require('tools/self_fillText');
var DrawXY = (function() {
    function DrawXY(options) {
        this.options = {};
        this.options = extend(this.options, options);

        this.draw();
    }

    DrawXY.prototype.init = function() {
        /*设置可以被参数化的变量*/
        //y轴上设置
        this.options.yLefShow = true;
        this.options.yRightShow = true;
        this.options.isDash = true;

        // x轴上设置
        this.options.xSplitShow = false; //是否进行分割
        this.options.xShowDivide = false; //是否显示分割标志

    }

    DrawXY.prototype.draw = function() {
        this.init();
        var paddingTop = this.options.padding.top;
        var paddingLeft = this.options.padding.left;
        var paddingRight = this.options.padding.right;
        var paddingBottom = this.options.padding.bottom;
        var ctx = this.options.context;
        var canvas = this.options.canvas;
        var arr_x = this.options.xaxis;
        var arr_data = this.options.series.data;
        var unit_w_len = this.options.unit_w_len;
        var dpr = this.options.dpr;

        var coordinate = this.options.coordinate;
        var maxY = coordinate.max;
        var minY = coordinate.min;
        var stepHeight = coordinate.stepHeight;
        var sepeNum = this.options.sepeNum;
        var totalHeight = canvas.height - paddingTop - paddingBottom;
        var baseLine = paddingTop + (maxY / stepHeight) * (totalHeight) / sepeNum;

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

        /*横标*/
        var stepY = (y_bottom - y_top) / sepeNum;
        ctx.textBaseline = "top";
        for (var i = 0, len = arr_x.length; i < len; i++) {
            var textWidth = ctx.measureText(arr_x[i].value).width;
            if (arr_x[i].show) {
                if(this.options.angle || this.options.angle == 0){
                    var cos_w = Math.cos(2*Math.PI/360*this.options.angle) * textWidth;
                    self_fillText(arr_x[i].value,ctx,XYF(x_left + i * unit_w_len + (unit_w_len) / 2 - cos_w/2),XYF(y_bottom + 10*dpr),this.options.angle);
                }else{
                    ctx.fillText(arr_x[i].value, XYF(x_left + i * unit_w_len+ (unit_w_len) / 2 - textWidth/2), XYF(y_bottom + 10*dpr));
                }
                
            }
        }

        /*纵标*/
        for (i = 1, len = sepeNum; i < len; i++) {
            var round = dpr / 2;
            if (i == maxY / stepHeight) {
                ctx.beginPath();
                ctx.moveTo(x_left, XYF(stepY * i + paddingTop));
                ctx.lineTo(x_right, XYF(stepY * i + paddingTop));
                ctx.stroke();
            } else {
                ctx.beginPath();
                draw_dash(ctx, x_left, Math.round(stepY * i + paddingTop),
                    x_right, Math.round(stepY * i + paddingTop), 3, 2);
            }
        }
        /*纵标刻度*/
        var yMax = this.options.coordinateMaxY;
        ctx.textAlign = "end";
        var markStep = yMax / sepeNum;
        for (i = 0; i <= sepeNum; i++) {
            ctx.beginPath();
            ctx.textBaseline = "middle";
            ctx.fillText(roundFloat(minY + i * stepHeight, stepHeight), paddingLeft - 5, stepY * (sepeNum - i) + paddingTop);
        }
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
