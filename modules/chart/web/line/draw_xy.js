/**
 * 绘制直角坐标系
 */
 var extend = require('tools/extend2');
 /*主题*/
 var theme = require('theme/default');
 var common = require('tools/common');
 /*绘制虚线*/
 var DrawDashLine = require('chart/mobile/common/draw_dash_line');
 // 格式化坐标
 var XYF = require('chart/web/common/xyf');
 // 自定义X轴标识
 var self_fillText = require('tools/self_fillText');
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

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ccc';

        ctx.rect(XYF(this.options.padding_left),0.5,Math.round(this.options.drawWidth - this.options.padding_left),Math.round(k_height));
        ctx.stroke();

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
        var step = flag ? this.options.data.step2 : this.options.data.step;
        ctx.save();
        // var sepe_num = line_list_array.length;
        ctx.fillStyle = this.options.font.color == undefined ? '#000' : this.options.font.color;
        ctx.textAlign = 'right';
        ctx.lineWidth = 1;

        var dpr = this.options.dpr;

        for (var i = 0,item; item = line_list_array[i]; i++) {
            ctx.beginPath();
            
            if(i == 0 || i == line_list_array.length - 1){
                // ctx.strokeStyle = '#ccc'; 
                // ctx.moveTo(this.options.padding_left, Math.round(item.y));
                // ctx.lineTo(this.options.drawWidth, Math.round(item.y));
                // ctx.stroke();
            }else{
                ctx.strokeStyle = '#e6e6e6';
                DrawDashLine(ctx,this.options.padding_left, item.y, this.options.drawWidth, item.y,3);
            }
            
            // 绘制纵坐标刻度
            // ctx.textAlign = 'left';
            if(this.options.series2 && flag){
                // ctx.fillText(common.format_unit(item.num/1,this.options.decimalCount), this.options.padding_left - 10, item.y +10);
                ctx.textAlign = 'left';
                ctx.fillText(roundFloat(item.num/1, step), XYF(this.options.drawWidth + 5), XYF(item.y + 5*dpr));
            }else{
                ctx.textAlign = 'right';
                ctx.fillText(roundFloat(item.num/1, step), XYF(this.options.padding_left - 5), XYF(item.y + 5*dpr));
            }
        }
         ctx.restore();
    }

    /*绘制横坐标刻度值*/
    function drawXMark(ctx,k_height,oc_time_arr){
        ctx.save();
        ctx.lineWidth = 1;
        var dpr = this.options.dpr;
        var padding_left = this.options.padding_left;
        ctx.textAlign = 'center';
        if(this.options.font){
            ctx.fillStyle = this.options.font.color == undefined ? '#000' : this.options.font.color;
        }else{
            ctx.fillStyle = '#000';
        }

        /*画布宽度*/
        var k_width = this.options.drawWidth;
        // var y_date = this.options.c_1_height;
        var tempDate;
        // var timeSpacing = (this.options.width * dpr - padding_left) / oc_time_arr.length + padding_left;
        var arr_length = oc_time_arr.length;
        for(var i = 0;i<arr_length;i++) {
            ctx.beginPath();
            tempDate = oc_time_arr[i];
            var textWidth = ctx.measureText(tempDate).width;
            var cos_w = Math.cos(2*Math.PI/360*this.options.angle) * textWidth;
            if(tempDate.show == undefined ? true : tempDate.show){

                if(arr_length == 1){
                    var x = (this.options.drawWidth - this.options.padding_left)/2 + this.options.padding_left;
                    ctx.fillText(tempDate.value, XYF(x) , XYF(this.options.c_1_height+20*dpr));
                }else{
                    // if(this.options.series2){
                     
                    //     var x = i * (k_width - padding_left) / (arr_length-1) + padding_left;
                    //     ctx.fillText(tempDate.value, x, this.options.c_1_height+20);
                    // }else{
                        
                    //     var x = i * (k_width - padding_left) / (arr_length-1) + padding_left;
                    //     // ctx.fillText(tempDate.value, x , this.options.c_1_height+20);

                    //     if(i == 0){
                    //         ctx.fillText(tempDate.value, i * (k_width - padding_left) / (arr_length-1) + padding_left + ctx.measureText(tempDate.value).width/2, this.options.c_1_height+20);
                    //     }else if(i == arr_length - 1){
                    //         ctx.fillText(tempDate.value, this.options.drawWidth - ctx.measureText(tempDate.value).width/2, this.options.c_1_height+20);
                    //     }else{
                    //         ctx.fillText(tempDate.value, x, this.options.c_1_height+20);   
                    //     }
                    // }

                    var x = i * (k_width - padding_left) / (arr_length-1) + padding_left;
                    // ctx.fillText(tempDate.value, x , this.options.c_1_height+20);

                    if(this.options.angle || this.options.angle == 0){
                        self_fillText(tempDate.value,ctx,XYF(x),XYF(this.options.c_1_height+30*dpr),this.options.angle);
                    }else{
                        if(this.options.drawWidth > (x + ctx.measureText(tempDate.value).width) || i == (arr_length - 1)){
                            // if(i == 0){
                            //     ctx.fillText(tempDate.value, XYF(x + ctx.measureText(tempDate.value).width/2), XYF(this.options.c_1_height+20*dpr));
                            // }else if(i == (arr_length - 1)){
                            //     ctx.fillText(tempDate.value, XYF(this.options.drawWidth - ctx.measureText(tempDate.value).width/2), XYF(this.options.c_1_height+20*dpr));
                            // }else{
                            //     ctx.fillText(tempDate.value, XYF(x), XYF(this.options.c_1_height+20*dpr));   
                            // }

                            ctx.fillText(tempDate.value, XYF(x), XYF(this.options.c_1_height+20*dpr));
                        }
                        
                    }
                   
                }
            }

            if(tempDate.showline == undefined ? true : tempDate.showline){
               var x = i * (k_width - padding_left) / (arr_length-1) + padding_left;
               if(this.options.drawWidth > (x + ctx.measureText(tempDate.value).width)){
                    if(i == 0 || i == (arr_length - 1)){
                        // ctx.strokeStyle = '#ccc';
                        // ctx.moveTo(i * (k_width - padding_left) / (arr_length-1) + padding_left,0);
                        // ctx.lineTo(i * (k_width - padding_left) / (arr_length-1) + padding_left,this.options.c_1_height);
                        // ctx.stroke();
                    }else{
                        ctx.strokeStyle = '#e6e6e6';
                        DrawDashLine(ctx,x,0, i * (k_width - padding_left) / (arr_length-1) + padding_left,this.options.c_1_height + 2,3);
                    }
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

    
    function roundFloat(f, stepHeight) {
        var precise = 1;
        if (stepHeight.toString().indexOf(".") !== -1) {
            precise = stepHeight.toString().length - stepHeight.toString().indexOf(".") - 1;
        }
        var m = Math.pow(10, precise);
        return common.format_unit(Math.round(f * m) / m, precise);
    }

    return DrawXY;
})();

module.exports = DrawXY;