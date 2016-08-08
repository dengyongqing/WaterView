/**
 * 绘制直角坐标系
 * 包括绘制网格
 */

/*绘制虚线*/
var draw_dash = require('chart/web/common/draw_dash_line');
var extend = require('tools/extend2');
/*主题*/
var theme = require('theme/default');

var DrawXY = (function() {
    //构造方法
    function DrawXY(options) {
        /*设置默认参数*/
        this.defaultoptions = theme.draw_xy_web;
        this.options = {};
        this.options = extend(this.options, this.defaultoptions, options);
        /*绘图*/
        this.draw();
    };
    /*绘图*/
    DrawXY.prototype.draw = function() {
        var data = this.options.data;
        var ctx = this.options.context;
        var type = this.options.type;
        // var dpr = this.options.dpr;

        /*Y轴上的最大值*/
        var y_max = data.max;
        /*Y轴上的最小值*/
        var y_min = data.min;

        /*Y轴上分隔线数量*/
        var sepe_num = this.options.sepe_num;
        /*开盘收盘时间数组*/
        var oc_time_arr = data.timeStrs;

        /*分时图的高度*/
        var k_height = this.options.c_1_height;
        /*Y轴标识线列表*/
        var line_list_array = getLineList(y_max, y_min, sepe_num, k_height);

        drawXYTime.call(this, ctx, y_max, y_min, line_list_array);

        // 绘制横坐标刻度
        drawXMark.apply(this, [ctx, k_height, oc_time_arr]);
    };
    // 绘制分时图坐标轴
    function drawXYTime(ctx, y_max, y_min, line_list_array) {
        var _this = this;
        var sepe_num = line_list_array.length;
        var padding_left = this.options.padding.left;
        var padding_right = this.options.padding.right;
        for (var i = 0, item; item = line_list_array[i]; i++) {
            ctx.beginPath();
            /*绘制y轴上的x轴方向分割*/
            if (i < (sepe_num - 1) / 2) {
                if (i == 0) {
                    ctx.strokeStyle = 'rgba(230,230,230, 1)';
                    ctx.moveTo(padding_left, Math.round(item.y));
                    ctx.lineTo(ctx.canvas.width - padding_right, Math.round(item.y));
                }
                ctx.fillStyle = '#007F24';
                ctx.strokeStyle = 'rgba(230,230,230, 1)';
                draw_dash(ctx, padding_left, Math.round(item.y), ctx.canvas.width - padding_right, Math.round(item.y), 5);
            } else if (i > (sepe_num - 1) / 2) {
                if (i == (sepe_num - 1)) {
                    ctx.strokeStyle = 'rgba(230,230,230, 1)';
                    ctx.moveTo(padding_left, Math.round(item.y));
                    ctx.lineTo(ctx.canvas.width - padding_right, Math.round(item.y));
                }
                ctx.fillStyle = '#FF0A16';
                ctx.strokeStyle = 'rgba(230,230,230, 1)';
                draw_dash(ctx, padding_left, Math.round(item.y), ctx.canvas.width - padding_right, Math.round(item.y), 5);
            } else {
                ctx.fillStyle = '#333333';
                ctx.strokeStyle = '#cadef8';
                ctx.moveTo(padding_left, Math.round(item.y));
                ctx.lineTo(ctx.canvas.width - padding_right, Math.round(item.y));
            }

            // 绘制纵坐标刻度
            if (isNaN(item.num)) {
                ctx.fillText("0.00", 0, item.y - 10);
            } else {
                ctx.fillText((item.num).toFixed(this.options.pricedigit), 0, item.y - 10);
            }
            ctx.stroke();
            // 绘制纵坐标涨跌幅
            drawYPercent.call(_this, ctx, y_max, y_min, item);
        }

    }
    /*绘制纵坐标涨跌幅*/
    function drawYPercent(ctx, y_max, y_min, obj) {
        /*纵坐标中间值*/
        var y_middle = (y_max + y_min) / 2;
        /*画布宽度*/
        var k_width = ctx.canvas.width;
        /*纵坐标刻度涨跌幅*/
        if (y_middle) {
            var percent = ((obj.num - y_middle) / y_middle * 100).toFixed(2) + "%";
        } else {
            var percent = "0.00%";
        }
        /*绘制纵坐标刻度百分比*/
        ctx.fillText(percent, k_width - ctx.measureText(percent).width, obj.y - 10);
        ctx.stroke();
    }
    /*绘制横坐标刻度值*/
    function drawXMark(ctx, k_height, oc_time_arr) {
        // var dpr = this.options.dpr;
        var padding_left = this.options.padding.left;
        var padding_right = this.options.padding.right;
        var y_min = this.options.c_1_height;
        var y_max = this.options.c_1_height + ctx.canvas.height;
        ctx.beginPath();
        ctx.fillStyle = '#999';
        /*画布宽度*/
        var k_width = ctx.canvas.width;
        var y_date = k_height + ctx.canvas.height / 8 / 2;
        ctx.fillText(oc_time_arr[0], padding_left, y_date);
        ctx.fillText(oc_time_arr[1], (k_width - padding_left - padding_right) / 2 + padding_left - ctx.measureText(oc_time_arr[1]).width / 2, y_date);
        ctx.fillText(oc_time_arr[2], k_width - padding_right - ctx.measureText(oc_time_arr[2]).width, y_date);
        // ctx.moveTo(0,k_height + 10);
        /*绘制x轴上的y轴方向分割*/
        var len = oc_time_arr.length * 2;

        var v_height = ctx.canvas.height / 4;

        var v_base_height = v_height * 0.9;

        var y_v_bottom = ctx.canvas.height - this.options.canvas_offset_top;
        var y_v_top = y_v_bottom - v_height;
        var itemWidth = (k_width - padding_left - padding_right) / len;
        for (var i = 0; i <= len; i++) {
            (function(i) {
                if (i != 0 && i != len) {
                    draw_dash(ctx, padding_left + i * itemWidth, y_min, padding_left + i * itemWidth, 0, 5);
                    draw_dash(ctx, padding_left + i * itemWidth, y_v_bottom, padding_left + i * itemWidth, y_v_top, 5);
                } else {
                    ctx.moveTo(Math.floor(padding_left + i * itemWidth), y_min);
                    ctx.lineTo(Math.floor(padding_left + i * itemWidth), 0);
                }
                // console.log("x1: "+padding_left+i*(k_width/len)+" y1: "+y_min+" x2: "+padding_left+i*(k_width/len));
            })(i);
        }

        ctx.stroke();
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
