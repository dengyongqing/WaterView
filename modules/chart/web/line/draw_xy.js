/**
 * 绘制直角坐标系
 */
 var extend = require('tools/extend2');
 /*主题*/
 var theme = require('theme/default');
 var common = require('tools/common');
/*绘制虚线*/
 var DrawDashLine = require('chart/mobile/common/draw_dash_line');
 var DrawXY = (function(){
    //构造方法
    function DrawXY(options){
        /*设置默认参数*/
        this.options = extend(theme.defaulttheme, options);
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
        var y_max2 = this.options.data.max2;
        var step = this.options.data.step;
        /*Y轴上的最小值*/
        var y_min = this.options.data.min;
        var y_min2 = this.options.data.min2;
        var step2 = this.options.data.step2;

        /*Y轴上分隔线数量*/
        var sepe_num = this.options.sepeNum || 4;
        /*开盘收盘时间数组*/
        var oc_time_arr = this.options.xaxis;

        /*K线图的高度*/
        var k_height = this.options.c_1_height;
        /*Y轴标识线列表*/
        var line_list_array = getLineList(y_max, y_min, sepe_num, k_height,step);
        drawYMark.call(this,ctx,y_max,y_min,line_list_array,false);

        if(this.options.series2){
            var line_list_array2 = getLineList(y_max2, y_min2, sepe_num, k_height,step2);
            drawYMark.call(this,ctx,y_max,y_min,line_list_array2,true);
        }

        // 绘制横坐标刻度
        drawXMark.apply(this,[ctx,k_height,oc_time_arr]);
    };
    // 绘制坐标轴左侧刻度
    function drawYMark(ctx,y_max,y_min,line_list_array,flag){
        ctx.save();
        // var sepe_num = line_list_array.length;
        ctx.fillStyle = this.options.font.color == undefined ? '#000' : this.options.font.color;
        ctx.textAlign = 'right';
        ctx.lineWidth = "1px";

        for (var i = 0,item; item = line_list_array[i]; i++) {
            ctx.beginPath();
            
            if(i == 0 || i == line_list_array.length - 1){
                ctx.strokeStyle = '#ccc';
                ctx.moveTo(this.options.padding_left, Math.round(item.y));
                ctx.lineTo(this.options.drawWidth, Math.round(item.y));
                ctx.stroke();
            }else{
                ctx.strokeStyle = '#e6e6e6';
                DrawDashLine(ctx,Math.round(this.options.padding_left), Math.round(item.y), Math.round(this.options.drawWidth), Math.round(item.y),3);
            }
            
            // 绘制纵坐标刻度
            // ctx.textAlign = 'left';
            if(this.options.series2 && flag){
                // ctx.fillText(common.format_unit(item.num/1,this.options.decimalCount), this.options.padding_left - 10, item.y +10);
                ctx.textAlign = 'left';
                ctx.fillText(common.format_unit(item.num/1,this.options.decimalCount), this.options.drawWidth + 10, item.y + 5);
            }else{
                ctx.textAlign = 'right';
                ctx.fillText(common.format_unit(item.num/1,this.options.decimalCount), this.options.padding_left - 10, item.y + 5);
            }

        }
         ctx.restore();
    }

    /*绘制横坐标刻度值*/
    function drawXMark(ctx,k_height,oc_time_arr){
        ctx.save();
        // var dpr = this.options.dpr;
        var padding_left = this.options.padding_left;
        ctx.textAlign = 'center';
        ctx.fillStyle = this.options.font.color == undefined ? '#000' : this.options.font.color;
        ctx.lineWidth = "1px";

        /*画布宽度*/
        var k_width = this.options.drawWidth;
        // var y_date = this.options.c_1_height;
        var tempDate;
        // var timeSpacing = (this.options.width * dpr - padding_left) / oc_time_arr.length + padding_left;
        var arr_length = oc_time_arr.length;
        for(var i = 0;i<arr_length;i++) {
            ctx.beginPath();
            tempDate = oc_time_arr[i];
            if(tempDate.show == undefined ? true : tempDate.show){
                if(this.options.series2){
                    ctx.fillText(tempDate.value, i * (k_width - padding_left) / (arr_length-1) + padding_left, this.options.c_1_height+20);
                }else{
                    if(i < arr_length - 1){
                        ctx.fillText(tempDate.value, i * (k_width - padding_left) / (arr_length-1) + padding_left, this.options.c_1_height+20);
                    }else if(i * (k_width - padding_left) / (arr_length-1) + padding_left + ctx.measureText(tempDate.value).width > this.options.drawWidth){
                        ctx.fillText(tempDate.value, this.options.drawWidth - ctx.measureText(tempDate.value).width/2, this.options.c_1_height+20);
                    }
                }
                
            }

            if(tempDate.showline == undefined ? true : tempDate.showline){
               
                if(i == 0 || i == arr_length - 1){
                    ctx.strokeStyle = '#ccc';
                    ctx.moveTo(i * (k_width - padding_left) / (arr_length-1) + padding_left,0);
                    ctx.lineTo(i * (k_width - padding_left) / (arr_length-1) + padding_left,this.options.c_1_height);
                    ctx.stroke();
                }else{
                    ctx.strokeStyle = '#e6e6e6';
                    DrawDashLine(ctx,i * (k_width - padding_left) / (arr_length-1) + padding_left,0, i * (k_width - padding_left) / (arr_length-1) + padding_left,this.options.c_1_height,3);
                }
                
            }
        }

        // 绘制坐标刻度
        ctx.restore();
    }
    
    /*Y轴标识线列表*/
    function getLineList(y_max, y_min, sepe_num, k_height,step) {
        var ratio = step;
        var result = [];
        for (var i = 0; i <= sepe_num; i++) {
            result.push({
                num:  (y_min + i * ratio),
                x: 0,
                y: k_height - (i / (sepe_num)) * k_height
            });
        }
        return result;
    }

    return DrawXY;
})();

module.exports = DrawXY;