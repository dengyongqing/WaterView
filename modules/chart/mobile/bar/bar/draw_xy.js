var extend = require("tools/extend2");
var draw_dash = require("chart/web/common/draw_dash_line");
var DrawXY = (function() {
    function DrawXY(options) {
        this.options = {};
        this.options = extend(this.options, options);

        this.draw();
    }

    DrawXY.prototype.init = function() {
        /*设置可以被参数化的变量*/
        //y轴上设置
        this.options.ySplitNum = 4;
        this.options.yLefShow = true;
        this.options.yRightShow = true;
        this.options.isDash = true;

        // x轴上设置
        this.options.xSplitShow = false; //是否进行分割
        this.options.xShowDivide = false; //是否显示分割标志

        // 显示单位
        this.options.showUnit = true;
        // 显示legend
        this.options.showLegend = true;
    }

    DrawXY.prototype.draw = function() {
        this.init();
        var paddingTop = this.options.padding.top;
        var paddingLeft = this.options.padding.left;
        var paddingRight = this.options.padding.right;
        var paddingBottom = this.options.padding.bottom;
        var ctx = this.options.context;
        var canvas = this.options.canvas;
        var arr_x = this.options.xaxis.value;
        var arr_data = this.options.series[0].data;
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
        var y_bottom = Math.round(canvas.height - paddingBottom);
        var y_top = paddingTop;
        var x_left = paddingLeft;
        var x_right = canvas.width - paddingRight;
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
        var stepX = 1;
        var textWidth = ctx.measureText(arr_x[0]).width;
        var stepY = (y_bottom - y_top) / sepeNum;
        ctx.textBaseline = "top";
        if (textWidth >= unit_w_len * 4 / 5) {
            stepX = 2;
        }
        for (var i = 0, len = arr_x.length; i < len; i += stepX) {
            ctx.fillText(arr_x[i], x_left + i * unit_w_len + (unit_w_len - textWidth) / 2, y_bottom + 15);
        }

        /*纵标*/
        for (i = 1, len = sepeNum; i < len; i++) {
            draw_dash(ctx, x_left, stepY * i + paddingTop, x_right, stepY * i + paddingTop, 5);
        }
        /*纵标刻度*/
        var yMax = this.options.coordinateMaxY;
        ctx.textAlign = "end";
        var markStep = yMax / 4;
        for (i = 0; i <= 4; i++) {
            if (i === 0) {
                ctx.textBaseline = "bottom";
            } else if (i === 4) {
                ctx.textBaseline = "top";
            } else {
                ctx.textBaseline = "middle";
            }
            ctx.fillText(minY + i * stepHeight, paddingLeft - 10, stepY * (4 - i) + paddingTop);
        }

        // /*单位*/
        // ctx.textBaseline = "bottom";
        // ctx.textAlign = "start";
        // ctx.fillText("单位：" + this.options.yaxis.unit, paddingLeft, y_top - 10);

        // /*柱体标识lengend*/
        // var unit_w_kind = this.options.unit_w_kind;
        // ctx.fillStyle = this.options.series[0].color;
        // ctx.fillRect(Math.round(canvas.width / 2 - unit_w_kind), canvas.height - 30 , unit_w_kind, 12 * dpr);
        // ctx.textBaseline = "top";
        // ctx.fillText(this.options.series[0].name, canvas.width / 2 + 10, canvas.height - 30);
        // ctx.restore();

    }

    return DrawXY;
})();


module.exports = DrawXY;
