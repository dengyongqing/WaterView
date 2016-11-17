/**
 * 绘制直角坐标系
 */
var extend = require('tools/extend');
/*主题*/
var theme = require('theme/default');
/*绘制虚线*/
var DrawDashLine = require('chart/web/common/draw_dash_line');
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
        var data = this.options.data;
        var ctx = this.options.context;
        var type = this.options.type;
        // var dpr = this.options.dpr;

        /*Y轴上的最大值*/
        var y_max = data.max;
        /*Y轴上的最小值*/
        var y_min = data.min;

        /*Y轴上分隔线数量*/
        var sepe_num = 5;
        /*开盘收盘时间数组*/
        var oc_time_arr = data.timeStrs;

        /*K线图的高度*/
        var k_height = this.options.c_1_height;
        /*Y轴标识线列表*/
        var line_list_array = getLineList(y_max, y_min, sepe_num, k_height);

        drawXYK.apply(this,[ctx,y_max,y_min,line_list_array]);

        // 绘制横坐标刻度
        if(oc_time_arr){
            drawXMark.apply(this,[ctx,k_height,oc_time_arr]);
        }
        
    };

    //绘制K线图坐标轴
    function drawXYK(ctx,y_max,y_min,line_list_array){
        var sepe_num = line_list_array.length;
        ctx.fillStyle = '#333333';
        ctx.strokeStyle = '#e5e5e5';
        ctx.rect(1,0,this.options.canvas.width - 2,this.options.c_1_height);
        ctx.stroke();

        ctx.beginPath();
        for(var i = 0;i<3;i++){
            var x = ((i+1)/4)*(ctx.canvas.width - this.options.padding_left) + this.options.padding_left;
            
            if(i == 1){
                ctx.moveTo(x,0);
                ctx.lineTo(x,this.options.c_1_height);
                ctx.stroke();
            }else{
                DrawDashLine(ctx,x,0,x,this.options.c_1_height,5);
            }
            
        }

        for (var i = 0,item; item = line_list_array[i]; i++) {
            ctx.beginPath();

            // if (i < (sepe_num -1) / 2) {
            //     ctx.fillStyle = '#333333';
            //     ctx.strokeStyle = '#e5e5e5';
            // }
            // else if(i > (sepe_num -1) / 2){
            //     ctx.fillStyle = '#333333';
            //     ctx.strokeStyle = '#e5e5e5';
            // }
            // else{
            //     ctx.fillStyle = '#333333';
            //     ctx.strokeStyle = '#e5e5e5';
            // }

            if(i == 2){
                ctx.moveTo(0, Math.round(item.y));
                ctx.lineTo(ctx.canvas.width, Math.round(item.y));
                ctx.stroke();
            }else if(i != 0 && i != (line_list_array.length - 1)){
                DrawDashLine(ctx,0, Math.round(item.y), ctx.canvas.width, Math.round(item.y),5);
            }
            
            
            // 绘制纵坐标刻度
            if(isNaN(item.num)){
                ctx.fillText("0.00", 0, item.y - 10);
            }else if(i==0){
                ctx.fillText((item.num).toFixed(this.options.pricedigit), 0, item.y - 10);
            }else if(i == (line_list_array.length - 1)){
                ctx.fillText((item.num).toFixed(this.options.pricedigit), 0, item.y + 20);
            }else{
                ctx.fillText((item.num).toFixed(this.options.pricedigit), 0, item.y + 10);
            }
            
        }

    }
    /*绘制纵坐标涨跌幅*/
    function drawYPercent(ctx,y_max, y_min, obj){
        /*纵坐标中间值*/
        var y_middle = (y_max + y_min)/2;
        /*画布宽度*/
        var k_width = ctx.canvas.width;
        /*纵坐标刻度涨跌幅*/
        if(y_middle){
            var percent = ((obj.num - y_middle)/y_middle * 100).toFixed(2) + "%";
        }else{
            var percent = "0.00%";
        }
        /*绘制纵坐标刻度百分比*/
        ctx.fillText(percent, k_width - ctx.measureText(percent).width, obj.y - 10);
        ctx.stroke();
    }
    /*绘制横坐标刻度值*/
    function drawXMark(ctx,k_height,oc_time_arr){
        // var dpr = this.options.dpr;
        var padding_left = this.options.padding_left;
        ctx.beginPath();
        ctx.fillStyle = '#999';
        /*画布宽度*/
        var k_width = ctx.canvas.width;
        var y_date = k_height + (ctx.canvas.height/8) * 1/3;

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
    return DrawXY;
})();

module.exports = DrawXY;