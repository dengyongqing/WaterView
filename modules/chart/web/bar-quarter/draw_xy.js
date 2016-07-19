/**
 * 绘制直角坐标系
 */
 var extend = require('tools/extend');
 /*主题*/
 var theme = require('theme/default');
 var common = require('tools/common');
 var DrawXY = (function(){
    //构造方法
    function DrawXY(options){
        /*设置默认参数*/
        this.defaultoptions = theme.draw_xy;
        this.options = {};
        extend(false,this.options, this.defaultoptions, options);
        /*绘图*/
        this.draw();
    };
    /*绘图*/
    DrawXY.prototype.draw = function(){
        // var xAxisData = this.options.xaxis;
        // var yAxisData = this.options.series;
        // var type = this.options.type;
        // var dpr = this.options.dpr;
        var ctx = this.options.context;
        console.log(this.options)
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

        drawXYLine.call(this,ctx,y_max,y_min,line_list_array);

        // 绘制横坐标刻度
        drawXMark.apply(this,[ctx,k_height,oc_time_arr]);
    };
    // 绘制分时图坐标轴最左边刻度
    function drawXYLine(ctx,y_max,y_min,line_list_array){
        // var sepe_num = line_list_array.length;
        ctx.fillStyle = '#b1b1b1';
        ctx.strokeStyle = '#ccc';
        ctx.textAlign = 'right';

        for (var i = 0,item; item = line_list_array[i]; i++) {
            ctx.beginPath();
            ctx.moveTo(this.options.padding_left, Math.round(item.y));
            ctx.lineTo(ctx.canvas.width, Math.round(item.y));
            // 绘制纵坐标刻度
            ctx.fillText(common.format_unit(i*this.options.data.max / 5,0), this.options.padding_left-20, item.y +10);
            ctx.stroke();
        }

    }

    /*绘制横坐标刻度值*/
    function drawXMark(ctx,k_height,oc_time_arr){
        // var dpr = this.options.dpr;
        var padding_left = this.options.padding_left;
        ctx.beginPath();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#b1b1b1';
        /*画布宽度*/
        var k_width = ctx.canvas.width;
        var tempDate;
        var arr_length = oc_time_arr.length;
        for(var i = 0;i<arr_length;i++) {
            tempDate = oc_time_arr[i].value;
           // debugger;
                    ctx.fillText(tempDate, i * (k_width - padding_left) / (arr_length-1) + padding_left, this.options.c_1_height+40);      
        }
            ctx.stroke();
            ctx.closePath();
    }
    
    /*Y轴标识线列表*/
    function getLineList(y_max, y_min, sepe_num, k_height) {
        var ratio = (y_max - y_min) / (sepe_num-1);
        var result = [];
        for (var i = 0; i < sepe_num; i++) {
            result.push({
                num:  (y_min + i * ratio),
                x: 0,
                y: k_height - (i / (sepe_num-1)) * k_height
            });
        }
        return result;
    }

    return DrawXY;
})();

module.exports = DrawXY;