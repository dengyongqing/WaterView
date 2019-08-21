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

        /*Y轴上的最大值*/
        var y_max = this.options.data.max;
        /*Y轴上的最小值*/
        var y_min = this.options.data.min;

        /*Y轴上分隔线数量*/
        var sepe_num = this.options.sepenum || 6;
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

    // 绘制坐标轴最左边刻度
    function drawXYLine(ctx,y_max,y_min,line_list_array){
        ctx.save();
        // var sepe_num = line_list_array.length;
        ctx.fillStyle = '#b1b1b1';
        ctx.strokeStyle = '#ccc';
        ctx.textAlign = 'right';
        for (var i = 0,item; item = line_list_array[i]; i++) {
            ctx.beginPath();
            ctx.moveTo(this.options.padding_left, Math.round(item.y));
            ctx.lineTo(ctx.canvas.width, Math.round(item.y));
            // 绘制纵坐标刻度
            ctx.fillText(common.format_unit(item.num/1,this.options.decimalCount), this.options.padding_left - 10, item.y +10);
            ctx.stroke();
        }
        ctx.restore();
    }

    /*绘制横坐标刻度值*/
    function drawXMark(ctx,k_height,oc_time_arr){
        ctx.save();
        // var dpr = this.options.dpr;
        var padding_left = this.options.padding_left;
        ctx.beginPath();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#b1b1b1';
        /*画布宽度*/
        var k_width = ctx.canvas.width;
        // var y_date = this.options.c_1_height;
        var tempDate;
        // var timeSpacing = (this.options.width * dpr - padding_left) / oc_time_arr.length + padding_left;
        var arr_length = oc_time_arr.length;
        for(var i = 0;i<arr_length;i++) {
            tempDate = oc_time_arr[i];
            if(tempDate.show == undefined ? true : tempDate.show){
                if(i < arr_length - 1){
                    ctx.fillText(tempDate.value, i * (k_width - padding_left) / (arr_length-1) + padding_left, this.options.c_1_height+40);
                }else

                if(i * (k_width - padding_left) / (arr_length-1) + padding_left + ctx.measureText(tempDate.value).width > ctx.canvas.width){
                    ctx.fillText(tempDate.value, ctx.canvas.width - ctx.measureText(tempDate.value).width/2, this.options.c_1_height+40);
                }
            }

            if(tempDate.showline == undefined ? true : tempDate.showline){
                ctx.strokeStyle = '#ccc';
                ctx.moveTo(i * (k_width - padding_left) / (arr_length-1) + padding_left,0);
                ctx.lineTo(i * (k_width - padding_left) / (arr_length-1) + padding_left,this.options.c_1_height);
            }

        }

        // 绘制坐标刻度
        ctx.stroke();
        ctx.restore();
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