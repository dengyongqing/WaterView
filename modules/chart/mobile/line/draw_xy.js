/**
 * 绘制直角坐标系
 */
 var extend = require('tools/extend');
 /*主题*/
 var theme = require('theme/default');
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
        var xAxisData = this.options.xAxis.data;
        var yAxisData = this.options.series;
        var type = this.options.type;
        var dpr = this.options.dpr;
        var ctx = this.options.context;

        /*Y轴上的最大值*/
        var y_max = this.options.data.max;
        /*Y轴上的最小值*/
        var y_min = 0;

        /*Y轴上分隔线数量*/
        var sepe_num = 6;
        /*开盘收盘时间数组*/
        var oc_time_arr = this.options.xAxis.data;

        /*K线图的高度*/
        var k_height = this.options.c_1_height;
        /*Y轴标识线列表*/
        var line_list_array = getLineList(y_max, y_min, sepe_num, k_height);

        console.log(line_list_array)
        drawXYLine.call(this,ctx,y_max,y_min,line_list_array);

        // 绘制横坐标刻度
        drawXMark.apply(this,[ctx,k_height,oc_time_arr]);
    };
    // 绘制分时图坐标轴
    function drawXYLine(ctx,y_max,y_min,line_list_array){
        var sepe_num = line_list_array.length;
        for (var i = 0,item; item = line_list_array[i]; i++) {
            ctx.beginPath();
            ctx.font = '30px Arial';        
            ctx.fillStyle = '#b1b1b1';
            ctx.strokeStyle = '#ccc';

            ctx.moveTo(this.options.padding_left, Math.round(item.y));
            ctx.lineTo(ctx.canvas.width, Math.round(item.y));
            // 绘制纵坐标刻度
            ctx.textAlign = 'right';
            ctx.fillText((item.num).toFixed(0)+'万', this.options.padding_left-10, item.y +10);
            ctx.stroke();
        }

        for (var i = 1,item; i<7; i++) {
            ctx.beginPath();        
            ctx.strokeStyle = '#ccc';
            ctx.moveTo(i*this.options.canvas.width / 6,0);
            ctx.lineTo(i*this.options.canvas.width / 6,this.options.c_1_height);
            // 绘制坐标刻度
            ctx.stroke();
        }


    }

    /*绘制横坐标刻度值*/
    function drawXMark(ctx,k_height,oc_time_arr){
        var dpr = this.options.dpr;
        var padding_left = this.options.padding_left;
        ctx.beginPath();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#b1b1b1';
        /*画布宽度*/
        var k_width = ctx.canvas.width;
        var y_date = this.options.c_1_height;
        ctx.fillText(oc_time_arr[0], padding_left, this.options.c_1_height);
        ctx.fillText(oc_time_arr[1], (k_width-padding_left)/2 + padding_left - ctx.measureText(oc_time_arr[1]).width/2, this.options.c_1_height);
        ctx.fillText(oc_time_arr[2], k_width - ctx.measureText(oc_time_arr[2]).width, this.options.c_1_height);
        ctx.fillText(oc_time_arr[3], padding_left, this.options.c_1_height);
        ctx.fillText(oc_time_arr[4], (k_width-padding_left)/2 + padding_left - ctx.measureText(oc_time_arr[1]).width/2, this.options.c_1_height);
        // ctx.moveTo(0,k_height + 10);
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