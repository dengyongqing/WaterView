/*绘制xy轴*/
var extend = require("tools/extend2");
var draw_dash = require("chart/mobile/common/draw_dash_line");
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
        var y_bottom = toOdd(Math.round(canvas.height - paddingBottom));
        var y_top = toOdd(Math.round(paddingTop));
        var x_left = toOdd(Math.round(paddingLeft));
        var x_right = toOdd(Math.round(canvas.width - paddingRight));
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

        ctx.beginPath();
        /*横标*/
        var stepX = 1;
        var textWidth = ctx.measureText(arr_x[0]).width;
        var stepY = (y_bottom - y_top) / sepeNum;
        ctx.textBaseline = "top";
        // if (textWidth >= unit_w_len * 4 / 5) {
        //     stepX = 2;
        // }
        stepX = Math.floor(textWidth/(unit_w_len * 4 / 5))+1;
        for (var i = 0, len = arr_x.length; i < len; i += stepX) {
            if((unit_w_len - textWidth) < 0 && i === 0){
                ctx.fillText(arr_x[i], x_left , y_bottom + 15);
            }else if((unit_w_len - textWidth) < 0 && i > len - stepX){
                ctx.fillText(arr_x[i], x_right -  textWidth, y_bottom + 15);
            }else{
                ctx.fillText(arr_x[i], x_left + i * unit_w_len + (unit_w_len - textWidth) / 2, y_bottom + 15);
            }
        }

        /*纵标*/
        for (i = 1, len = sepeNum; i < len; i++) {
            var round = 0;
            if(i == maxY/stepHeight){
                ctx.moveTo(x_left,Math.round(stepY * i + paddingTop) + round);
                ctx.lineTo(x_right, round + Math.round(stepY * i + paddingTop));
                ctx.stroke();
            }else{
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = '#e6e6e6';
                draw_dash(ctx, x_left, Math.round(stepY * i + paddingTop) + round,
                    x_right, round + Math.round(stepY * i + paddingTop), 3);
                ctx.restore();
            }
        }
        /*纵标刻度*/
        var yMax = this.options.coordinateMaxY;
        ctx.textAlign = "end";
        var markStep = yMax / sepeNum;
        for (i = 0; i <= sepeNum; i++) {
            if (i === 0) {
                ctx.textBaseline = "bottom";
            } else if (i === sepeNum) {
                ctx.textBaseline = "top";
            } else {
                ctx.textBaseline = "middle";
            }
            ctx.fillText(roundFloat(minY + i * stepHeight, stepHeight), paddingLeft - 10, stepY * (sepeNum - i) + paddingTop);
        }
    }

    function toOdd(num){
        if(num%2 === 0){
            return num+1;
        }else{
            return num;
        }
    }

    function toOdd(num){
        if(num%2 === 0){
            return num+1;
        }else{
            return num;
        }
    }

    function roundFloat(f, stepHeight){
        var precise = 1;
        if(stepHeight.toString().indexOf(".") !== -1){
            precise = stepHeight.toString().length - stepHeight.toString().indexOf(".")-1;
        }
        var m = Math.pow(10, precise);
        return Math.ceil(f * m)/ m;
    }

    return DrawXY;
})();


module.exports = DrawXY;
