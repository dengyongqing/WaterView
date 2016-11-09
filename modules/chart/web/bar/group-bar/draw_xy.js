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
        this.defaultoptions = theme.draw_xy;
        this.options = extend(this.defaultoptions, options);
        
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
        var sepe_num = this.options.sepeNum;
        /*开盘收盘时间数组*/
        var oc_time_arr = this.options.xaxis;

        /*K线图的高度*/
        var k_height = this.options.c_1_height;
        /*Y轴标识线列表*/
        var line_list_array = getLineList.apply(this,[y_max, y_min, sepe_num, k_height]);
        // if(this.options.type == 'quarter-line') {
            // addGradient.call(this);
        // }

        drawXYLine.call(this,ctx,y_max,y_min,line_list_array);

        // 绘制横坐标刻度
        drawXMark.apply(this,[ctx,k_height,oc_time_arr]);
    };
    // 绘制Y轴最左边刻度
    function drawXYLine(ctx,y_max,y_min,line_list_array){
        ctx.save();
        // var sepe_num = line_list_array.length;
        var _this = this;
        ctx.fillStyle = '#979797';
        
        ctx.textAlign = 'right';
        for (var i = 0,item; item = line_list_array[i]; i++) {
            ctx.beginPath();
            // ctx.moveTo(this.options.padding_left, Math.round(item.y));
            // ctx.lineTo(ctx.canvas.width, Math.round(item.y));
            
            // var absPoint = Math.max(this.options.data.max,Math.abs(this.options.data.min));
            // absPoint = absPoint.toFixed(3);
            // 绘制纵坐标刻度
            var dashFlag = true;
            if(this.options.data.min < 0) {
                if(this.options.data.min + this.options.data.step * i < 0){
                    ctx.fillText(this.options.data.min + dealFloat(this.options.data.step * i), this.options.padding_left - 10, item.y + 5);
                }else if(this.options.data.min + this.options.data.step * i == 0){
                    ctx.fillText(0, this.options.padding_left - 10, item.y + 5);
                    dashFlag = false;
                    ctx.strokeStyle = '#c9c9c9';
                    ctx.moveTo(this.options.padding_left, Math.round(item.y));
                    ctx.lineTo(ctx.canvas.width, Math.round(item.y));
                    ctx.stroke();
                }else {
                    ctx.fillText(this.options.data.min + dealFloat(this.options.data.step * i), this.options.padding_left - 10, item.y + 5);
                }
            }
            else {
                ctx.fillText(this.options.data.min + dealFloat(this.options.data.step * i), this.options.padding_left - 10, item.y + 5);
            }

            if(dashFlag){
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = '#e6e6e6';
                DrawDashLine(ctx,this.options.padding_left, Math.round(item.y), ctx.canvas.width, Math.round(item.y),3);
                ctx.restore();
            }
            
        }


        function dealFloat(data){
            if(data){
                data = parseFloat((data).toFixed(_this.options.maxDot));
            }
            return data;
        }
        ctx.restore();
    }

/*绘制横坐标刻度值*/
function drawXMark(ctx,k_height,oc_time_arr){
        // var dpr = this.options.dpr;
        ctx.save();
        var padding_left = this.options.padding_left;
        ctx.beginPath();
        ctx.strokeStyle = "#c9c9c9";
        ctx.rect(padding_left,0,ctx.canvas.width -padding_left -1,this.options.c_1_height);
        ctx.stroke();
        
        ctx.textAlign = 'left';
        ctx.fillStyle = '#979797';
        /*画布宽度*/
        var k_width = ctx.canvas.width;
        var tempDate;
        var arr_length = oc_time_arr.length;
        for(var i = 0;i<arr_length;i++) {
            ctx.beginPath();
            tempDate = oc_time_arr[i].value;
            var x = i * (k_width - padding_left) / (arr_length) +padding_left;
            var isShow = oc_time_arr[i].show == undefined ? true : false;

            if(oc_time_arr[i].show == undefined || oc_time_arr[i].show){
                if(i == (arr_length-1)){
                    ctx.fillText(tempDate, ((this.options.canvas.width - ctx.measureText(tempDate).width - 5)), this.options.c_1_height+20); 
                }else{
                    ctx.fillText(tempDate, x + (((k_width - padding_left) / (arr_length) - ctx.measureText(tempDate).width)/2), this.options.c_1_height+20); 
                }
            }

            if(i == (arr_length-1)){
                ctx.moveTo(x,this.options.c_1_height);   
                ctx.lineTo(x,this.options.c_1_height + 5);

                var x = (i+1) * (k_width - padding_left) / (arr_length) +padding_left;
                ctx.moveTo(x-1,this.options.c_1_height);   
                ctx.lineTo(x-1,this.options.c_1_height + 5);
            }else{
                ctx.moveTo(x,this.options.c_1_height);   
                ctx.lineTo(x,this.options.c_1_height + 5);
            }
            
            ctx.stroke();
        }
        ctx.stroke();
        ctx.restore();
    }

    function addGradient(){
        ctx.save();
        var sepGradientLen = (this.options.canvas.width - this.options.padding_left) / this.options.series.length;
        var ctx = this.options.context;
        for(var i = 0;i < this.options.series.length;i++) {
            if(i % 2 == 0) {
             ctx.beginPath();
             var grad  = ctx.createLinearGradient(0,0,0,this.options.c_1_height);
             grad.addColorStop(0,'rgba(255,255,255,0)');
             grad.addColorStop(1,'rgba(245,245,245,1)');
             ctx.fillStyle = grad;
             ctx.rect(this.options.padding_left + i * sepGradientLen,0,sepGradientLen,this.options.c_1_height);
             ctx.fill();
             ctx.closePath();
         }

     }
      ctx.restore();
 }

 /*Y轴标识线列表*/
 function getLineList(y_max, y_min, sepe_num, k_height) {
    // var ratio = (y_max - y_min) / (sepe_num);
    var ratio = this.options.data.step;
    var result = [];
    for (var i = 0; i <= sepe_num; i++) {
        result.push({
            num: (y_min + i * ratio),
            x: 0,
            y: k_height - (i / (sepe_num)) * k_height
        });
    }
    return result;
}

return DrawXY;
})();

module.exports = DrawXY;