/**
 * 绘制直角坐标系
 */
var extend = require('tools/extend2');
/*主题*/
var theme = require('theme/default');
var common = require('tools/common');
// 格式化坐标
var XYF = require('chart/web/common/xyf');
var DrawXY = (function() {
    //构造方法
    function DrawXY(options) {
        /*设置默认参数*/
        this.defaultoptions = theme.draw_xy;
        this.options = extend(this.defaultoptions, options);

        /*绘图*/
        this.draw();
    };
    /*绘图*/
    DrawXY.prototype.draw = function() {
        // var xAxisData = this.options.xaxis;
        // var yAxisData = this.options.series;
        // var type = this.options.type;
        // var dpr = this.options.dpr;
        var ctx = this.options.context;
        /*Y轴上的最大值*/
        var y_max = this.options.data.max;
        /*Y轴上的最小值*/
        var y_min = 0;

        /*Y轴上分隔线数量*/
        var sepe_num = 5;
        /*开盘收盘时间数组*/
        var oc_time_arr = this.options.xaxis;

        /*K线图的高度*/
        var k_height = this.options.c_1_height;
        /*Y轴标识线列表*/
        var line_list_array = getLineList(y_max, y_min, sepe_num, k_height);
        // if(this.options.type == 'quarter-line') {
        addGradient.call(this);
        // }

        drawXYLine.call(this, ctx, y_max, y_min, line_list_array);

        // 绘制横坐标刻度
        drawXMark.apply(this, [ctx, k_height, oc_time_arr]);
    };
    // 绘制坐标轴最左边刻度
    function drawXYLine(ctx, y_max, y_min, line_list_array) {
        // var sepe_num = line_list_array.length;
        ctx.fillStyle = '#000';
        ctx.strokeStyle = '#eeeeee';
        ctx.textAlign = 'right';
        for (var i = 0, item; item = line_list_array[i]; i++) {
            ctx.beginPath();
            if (i !== 0 && i !== line_list_array.length - 1) {
                ctx.moveTo(this.options.padding_left, XYF(item.y));
                ctx.lineTo(ctx.canvas.width, XYF(item.y));
            }
            var absPoint = Math.max(this.options.data.max, Math.abs(this.options.data.min));
            absPoint = absPoint.toFixed(0);
            // 绘制纵坐标刻度
            if (this.options.data.min < 0) {
                if (i == 0) {

                    ctx.fillText(common.format_unit(-absPoint + i * absPoint / 2, 0), this.options.padding_left - 10, item.y);
                } else {
                    ctx.fillText(common.format_unit(-absPoint + i * absPoint / 2, 0), this.options.padding_left - 10, item.y + 10);
                }
            } else {
                if (i == 0) {

                    ctx.fillText(common.format_unit((i * absPoint / 4).toFixed(0), 0), this.options.padding_left - 10, item.y);
                } else {
                    ctx.fillText(common.format_unit((i * this.options.data.max / 4).toFixed(0), 0), this.options.padding_left - 10, item.y + 10);
                }
            }

            ctx.stroke();
        }

    }

    /*绘制横坐标刻度值*/
    function drawXMark(ctx, k_height, oc_time_arr) {
        // var dpr = this.options.dpr;
        var padding_left = this.options.padding_left;
        ctx.beginPath();
        ctx.strokeStyle = "#9f9f9f";
        ctx.rect(XYF(padding_left)-1, XYF(0), Math.round(ctx.canvas.width - padding_left), Math.round(this.options.c_1_height));
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.textAlign = 'left';
        ctx.fillStyle = '#000';
        /*画布宽度*/
        var k_width = ctx.canvas.width;
        var tempDate;
        var arr_length = oc_time_arr.length;
        for (var i = 0; i < arr_length; i++) {
            tempDate = oc_time_arr[i].value;
            ctx.fillText(tempDate, i * (k_width - padding_left) / (arr_length) + padding_left + (((k_width - padding_left) / (arr_length) - ctx.measureText(tempDate).width) / 2), this.options.c_1_height + 30);
        }
        ctx.stroke();
    }

    function addGradient() {
        var sepGradientLen = (this.options.canvas.width - this.options.padding_left) / this.options.series.length;
        var ctx = this.options.context;
        for (var i = 0; i < this.options.series.length; i++) {
            if (i % 2 == 0) {
                ctx.beginPath();
                var grad = ctx.createLinearGradient(0, 0, 0, this.options.c_1_height);
                grad.addColorStop(0, 'rgba(255,255,255,0)');
                grad.addColorStop(1, 'rgba(245,245,245,1)');
                ctx.fillStyle = grad;
                ctx.rect(XYF(this.options.padding_left + i * sepGradientLen), XYF(0), Math.round(sepGradientLen), Math.round(this.options.c_1_height));
                ctx.fill();
                ctx.closePath();
            }

        }
    }

    /*Y轴标识线列表*/
    function getLineList(y_max, y_min, sepe_num, k_height) {
        var ratio = (y_max - y_min) / (sepe_num - 1);
        var result = [];
        for (var i = 0; i < sepe_num; i++) {
            result.push({
                num: (y_min + i * ratio),
                x: 0,
                y: k_height - (i / (sepe_num - 1)) * k_height
            });
        }
        return result;
    }

    return DrawXY;
})();

module.exports = DrawXY;
