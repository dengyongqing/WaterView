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
                ctx.fillText("0.00", 0, item.y);
            } else {
                var num = (item.num * 1.0).toFixed(this.options.pricedigit);
                ctx.fillText(num, padding_left - ctx.measureText(num).width-5, item.y);
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
        ctx.fillText(percent, k_width - ctx.measureText(percent).width + 5, obj.y);
        ctx.stroke();
    }
    /*绘制横坐标刻度值*/
    function drawXMark(ctx, k_height, oc_time_arr) {
        // var dpr = this.options.dpr;
        var padding_left = this.options.padding.left;
        var padding_right = this.options.padding.right;
        var y_min = this.options.c_1_height;
        ctx.beginPath();
        ctx.fillStyle = '#999';
        /*画布宽度*/
        var k_width = ctx.canvas.width;
        var y_date = k_height + ctx.canvas.height / 8 / 2;
        /*绘制x轴上的y轴方向分割*/
        var len = 0;
        /*通过type判断，是一日分时还是多日分时，以及判断是不是有盘前数据，根据判断结果画不同的横坐标时间点*/
        var timeStrLen = oc_time_arr.length;
        /*每个下标刻度之间的宽度*/
        var itemDistance;
        /*是否为一天分时*/
        var isR = false;
        /*是否包含盘前数据*/
        var isCR = this.options.isCR || false;
        /*盘前数据占据的宽度*/
        var crSpace = 0;
        if (this.options.type.toLowerCase() != 'r') {
            itemDistance = (k_width - padding_left - padding_right) / (timeStrLen);
        } else {
            if (isCR) {
                //盘前数据在坐标上的宽度
                crSpace = (k_width - padding_left - padding_right) / ((timeStrLen - 2) * 4 + 1);
                itemDistance = crSpace * 4;
            } else {
                itemDistance = (k_width - padding_left - padding_right) / (timeStrLen - 1);
            }
            isR = true;
        }
        /*绘制x轴上的时间点*/
        if (!isCR) {
            len = 2 * timeStrLen;
            for (var i = 0; i < timeStrLen; i++) {
                //时间转换，如果为日期，装换为xx月xx日， 否则为原样
                var itemTime = (isR ? oc_time_arr[i] : (new Date(oc_time_arr[i]).getMonth() + 1) + "月" +
                    new Date(oc_time_arr[i]).getDate() + "日");
                if (i == 0) {
                    isR ? ctx.fillText(itemTime, padding_left, y_date) : 0;
                } else if (i == timeStrLen - 1 && isR) {
                    ctx.fillText(itemTime, padding_left + itemDistance * i - ctx.measureText(itemTime).width, y_date);
                } else {
                    ctx.fillText(itemTime, padding_left + itemDistance * i - ctx.measureText(itemTime).width / 2, y_date);
                }
            }
        } else {
            len = 2 * (timeStrLen-1) + 1;
            for (var i = 0; i < timeStrLen; i++) {
                var itemTime = oc_time_arr[i];
                if (i == 0) {
                    ctx.fillText(itemTime, padding_left, y_date);
                } else if (i == 1) {
                    ctx.fillText(itemTime, padding_left + crSpace, y_date);
                } else if (i == timeStrLen - 1) {
                    ctx.fillText(itemTime, padding_left + crSpace + itemDistance * (i - 1) - ctx.measureText(itemTime).width, y_date);
                } else {
                    ctx.fillText(itemTime, padding_left + crSpace + itemDistance * (i - 1) - ctx.measureText(itemTime).width / 2, y_date);
                }
            }
        }


        var v_height = ctx.canvas.height / 4;


        var y_v_bottom = ctx.canvas.height - this.options.canvas_offset_top;
        var y_v_top = y_v_bottom - v_height;
        var itemWidth = (k_width - padding_left - padding_right) / len;
        for (var i = 0; i <= len; i++) {

            if (i != 0 && i != len) {
                var x;
                //如果是盘前
                if (isCR) {
                    if (i == 1) {
                        x = crSpace + padding_left;
                        ctx.fillStyle = "#efefef";
                        ctx.fillRect(padding_left, 0, crSpace, y_min);
                    } else {
                        x = padding_left + (i - 1) * itemDistance/2 + crSpace;
                    }
                }else{
                    x = padding_left + i * itemWidth;
                }
                draw_dash(ctx, x, y_min, x, 0, 5);
                draw_dash(ctx, x, y_v_bottom, x, y_v_top, 5);
            } else {
                ctx.moveTo(Math.floor(padding_left + i * itemWidth), y_min);
                ctx.lineTo(Math.floor(padding_left + i * itemWidth), 0);
            }

        }

        ctx.stroke();
    }

    /*Y轴标识线列表*/
    function getLineList(y_max, y_min, sepe_num, k_height) {
        var ratio = (y_max - y_min) / (sepe_num - 1);
        var result = [];
        for (var i = 0; i < sepe_num; i++) {
            result.push({
                num: (y_min * 1.0 + i * ratio),
                x: 0,
                y: k_height - (i / (sepe_num - 1)) * k_height
            });
        }
        return result;
    }



    return DrawXY;
})();

module.exports = DrawXY;
