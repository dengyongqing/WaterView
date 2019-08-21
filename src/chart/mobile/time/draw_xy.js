/**
 * 绘制直角坐标系
 */
var extend = require('tools/extend');
/*主题*/
var theme = require('theme/default');
var draw_dash = require("chart/mobile/common/draw_dash_line");
var DrawXY = (function() {
    //构造方法
    function DrawXY(options) {
        /*设置默认参数*/
        this.defaultoptions = theme.draw_xy;
        this.options = {};
        extend(false, this.options, this.defaultoptions, options);
        /*绘图*/
        this.draw();
    };
    /*绘图*/
    DrawXY.prototype.draw = function() {
        var data = this.options.data;
        var ctx = this.options.context;
        // var dpr = this.options.dpr;

        /*Y轴上的最大值*/
        var y_max = data.max;
        /*Y轴上的最小值*/
        var y_min = data.min;

        /*Y轴上分隔线数量*/
        var sepe_num = this.options.y_sep
            /*开盘收盘时间数组*/
        var oc_time_arr = data.timeStrs;

        /*K线图的高度*/
        var k_height = this.options.c_1_height;
        /*Y轴标识线列表*/
        var line_list_array = getLineList(y_max, y_min, sepe_num, k_height);

        this.options.line_list_array = line_list_array;

        drawXY.call(this, ctx, y_max, y_min, line_list_array);


        // 绘制横坐标刻度
        if (oc_time_arr) {
            drawXMark.apply(this, [ctx, k_height, oc_time_arr, data.total]);
        }

    };

    DrawXY.prototype.drawYMark = function() {
        var data = this.options.data;
        var ctx = this.options.context;

        /*Y轴上的最大值*/
        var y_max = data.max;
        /*Y轴上的最小值*/
        var y_min = data.min;
        var line_list_array = this.options.line_list_array;
        drawYMark.call(this, ctx, y_max, y_min, line_list_array);
    }

    function drawYMark(ctx, y_max, y_min, line_list_array) {
        var _this = this;
        var padding_left = _this.options.padding_left,
            k_height = this.options.c_1_height,
            k_width = ctx.canvas.width - padding_left;
        var sepe_num = line_list_array.length;
        ctx.save();
        ctx.strokeStyle = "#e5e5e5";

        for (var i = 0, item; item = line_list_array[i]; i++) {
            ctx.beginPath();

            if (i < (sepe_num - 1) / 2) {
                ctx.fillStyle = '#19AF43';
            } else if (i > (sepe_num - 1) / 2) {
                ctx.fillStyle = '#D53D25';
            } else {
                ctx.fillStyle = '#333333';
            }


            if (i == 0) {
                ctx.textBaseline = "bottom";
            } else if (i == sepe_num - 1) {
                ctx.textBaseline = "top";
            } else {
                ctx.textBaseline = "middle";
            }
            // 绘制纵坐标刻度
            if (isNaN(item.num)) {
                ctx.fillText("0.00", 5, item.y);
            } else {
                ctx.fillText((item.num).toFixed(this.options.pricedigit), 5, item.y);
            }

            // 绘制纵坐标涨跌幅
            drawYPercent.call(_this, ctx, y_max, y_min, item);
        }
        ctx.restore();
    }

    // 绘制分时图坐标轴
    function drawXY(ctx, y_max, y_min, line_list_array) {
        var _this = this;
        var padding_left = _this.options.padding_left,
            k_height = this.options.c_1_height,
            k_width = ctx.canvas.width - padding_left;
        var sepe_num = line_list_array.length;
        ctx.save();
        ctx.strokeStyle = "#e5e5e5";

        for (var i = 0, item; item = line_list_array[i]; i++) {
            ctx.beginPath();


            if (i % 2 == 1) {
                draw_dash(ctx, 0, Math.round(item.y), ctx.canvas.width, Math.round(item.y), 5);
            } else {
                ctx.moveTo(0, Math.round(item.y));
                ctx.lineTo(ctx.canvas.width, Math.round(item.y));
                ctx.stroke();
            }
        }
        ctx.rect(1, 0, k_width - 2, k_height);
        ctx.stroke();
        ctx.restore();
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
        ctx.fillText(percent, k_width - ctx.measureText(percent).width - 5, obj.y);
    }
    /*绘制横坐标刻度值*/
    function drawXMark(ctx, k_height, oc_time_arr, total) {
        // var dpr = this.options.dpr;
        var padding_left = this.options.padding_left;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = '#A0A0A0';
        ctx.textBaseline = "middle";
        /*画布宽度*/
        var k_width = ctx.canvas.width - padding_left;
        var y_date = k_height + (ctx.canvas.height / 8) * 1 / 3;
        var oc_length = oc_time_arr.length;
        if(this.options.type.toLowerCase() == "t1"){
            for (var i = 0; i < oc_length; i++) {
                if (i == 0) {
                    ctx.fillText(oc_time_arr[i].str, padding_left, y_date);
                } else if (i == oc_length - 1) {
                    ctx.fillText(oc_time_arr[i].str, k_width - ctx.measureText(oc_time_arr[i].str).width, y_date);
                } else {
                    ctx.fillText(oc_time_arr[i].str, k_width*(oc_time_arr[i].tick/total) + padding_left - ctx.measureText(oc_time_arr[i].str).width / 2, y_date);
                }
            }
        }else{
            var unit = (k_width - padding_left)/oc_length;
            for(var j = 0; j < oc_length; j++){
                ctx.fillText(oc_time_arr[j],  (j+1) * unit - unit/2 - ctx.measureText(oc_time_arr[j]).width/2, y_date);
            }
        }

        var x_sep = this.options.x_sep;
        /*绘制x轴上的竖直分割线*/
        var itemWidth = k_width / x_sep;
        ctx.strokeStyle = "#e5e5e5";
        for (var j = 1; j < x_sep; j++) {
            var flag = false;
            ctx.beginPath();

            if(this.options.type.toLowerCase() == "t1" && j == x_sep/2 ){
                flag = true;
            }else if(this.options.type.toLowerCase() == "t2"){
                this.options.x_sep = 2;
                if(j == 1){
                    flag = true;
                }
            }else if(this.options.type.toLowerCase() == "t3"){
                this.options.x_sep = 3;
            }else if(this.options.type.toLowerCase() == "t4"){
                this.options.x_sep = 4;
                if(j == 2){
                    flag = true;
                }
            }else if(this.options.type.toLowerCase() == "t5"){
                this.options.x_sep = 5;
            }else{
                flag = false;
            }

            if(flag){
                ctx.strokeStyle = "#e5e5e5";
                ctx.moveTo(padding_left + itemWidth * j, 0);
                ctx.lineTo(padding_left + itemWidth * j, k_height);
                ctx.stroke();
            }else{
                draw_dash(ctx, Math.round(padding_left + itemWidth * j), 0, Math.round(padding_left + itemWidth * j), k_height, 5);
            }
        }
        ctx.restore();
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

    function toSim(dpr, num) {
        return Math.floor(num / dpr) * dpr + dpr / 2;
    }

    return DrawXY;
})();

module.exports = DrawXY;
