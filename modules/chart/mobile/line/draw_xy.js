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
        var y_max = getMaxMark(yAxisData);
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
            ctx.fillStyle = '#b1b1b1';
            ctx.strokeStyle = '#ccc';
            ctx.moveTo(0, Math.round(item.y));
            ctx.lineTo(ctx.canvas.width, Math.round(item.y));
            // 绘制纵坐标刻度
            ctx.fillText((item.num).toFixed(0), 0, item.y - 10);
            ctx.stroke();
            // 绘制纵坐标涨跌幅
        }

        for (var i = 0,item; i<line_list_array.length; i++) {
            ctx.beginPath();        
            ctx.strokeStyle = '#ccc';
            ctx.moveTo(0,0);
            ctx.lineTo(Math.round(item.x),ctx.canvas.height);
            // 绘制纵坐标刻度
            ctx.stroke();
            // 绘制纵坐标涨跌幅
        }


    }

    /*绘制横坐标刻度值*/
    function drawXMark(ctx,k_height,oc_time_arr){
        var dpr = this.options.dpr;
        var padding_left = this.options.padding_left;
        ctx.beginPath();
        ctx.fillStyle = '#b1b1b1';
        /*画布宽度*/
        var k_width = ctx.canvas.width;
        var y_date = k_height + ctx.canvas.height/8/2;
        ctx.fillText(oc_time_arr[0], padding_left, y_date);
        ctx.fillText(oc_time_arr[1], (k_width-padding_left)/2 + padding_left - ctx.measureText(oc_time_arr[1]).width/2, y_date);
        ctx.fillText(oc_time_arr[2], k_width - ctx.measureText(oc_time_arr[2]).width, y_date);
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
    /*获取数组中的最大值*/
    function getMaxMark(data) {
        var max =0,count=[];
        for(var i = 0;i<data.length;i++){
            count = count.concat(data[i].data);
        }
        max = count[0];
        for(var i =1;i<count.length;i++) {
           max = Math.max(max,count[i]);
       }

       return max
   }
   return DrawXY;
})();

module.exports = DrawXY;