/**
 * 绘制直角坐标系
 */
var extend = require('tools/extend2');
/*主题*/
var theme = require('theme/default');
/*绘制虚线*/
var DrawDashLine = require('chart/web/common/draw_dash_line');
// 工具
var common = require('chart/web/common/common'); 
// 格式化坐标
var XYF = require('chart/web/common/xyf');
var DrawXY = (function(){
    //构造方法
    function DrawXY(options){
        /*设置默认参数*/
        this.defaultoptions = theme.draw_xy;
        this.options = extend(this.defaultoptions,options);
        /*绘图*/
        this.draw();
    };
    /*绘图*/
    DrawXY.prototype.draw = function(){

        this.drawXYK();
        //绘制成交量坐标轴
        this.drawXYV();
        //绘制技术指标坐标轴
        this.drawXYT();
    };

    //绘制技术指标坐标轴
    DrawXY.prototype.drawXYT = function(){

        var ctx = this.options.context;

        // 保存画笔状态
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.options.color.fillStyle;
        ctx.strokeStyle = this.options.color.strokeStyle;
        ctx.moveTo(XYF(this.options.padding.left),XYF(this.options.c3_y_top - this.options.unit_height));
        ctx.lineTo(XYF(this.options.padding.left),XYF(this.options.c3_y_top + this.options.c_t_height));
        this.options.context.rect(XYF(this.options.padding.left),XYF(this.options.c3_y_top - this.options.unit_height),Math.round(this.options.drawWidth - 2),Math.round(this.options.c_t_height + this.options.unit_height));
        ctx.stroke();

        var c3_y_top = this.options.c3_y_top;
        ctx.fillStyle = this.options.color.fillStyle;
        ctx.strokeStyle = this.options.color.strokeStyle;
        // ctx.rect(this.options.padding.left,c2_y_top,ctx.canvas.width - this.options.padding.left - 2,v_height);
        for(var i = 0;i<3;i++){
            ctx.beginPath();
            var x1 = this.options.padding.left;
            var y1 = c3_y_top + ctx.canvas.height * 1 / this.options.y_sepe_num * i;
            var x2 = this.options.padding.left + this.options.drawWidth;
            var y2 = c3_y_top + ctx.canvas.height * 1 / this.options.y_sepe_num * i;

            if(i == 0 || i == 2){
                ctx.strokeStyle = "#e1e1e1";
                ctx.moveTo(XYF(x1),XYF(y1));
                ctx.lineTo(XYF(x2),XYF(y2));
                ctx.stroke();
            }else{
                ctx.strokeStyle = "#eeeeee";
                DrawDashLine(ctx,x1, y1, x2, y2,5);
            }
        }

        ctx.beginPath();
        ctx.strokeStyle = "#eeeeee";
        /*画布宽度*/
        var k_width = this.options.drawWidth;
        /*K线图的高度*/
        var c_t_height = this.options.c_t_height;
        var unit_w = (k_width) / (this.options.x_sepe_num);
        for(var i = 0;i <= this.options.x_sepe_num;i++){
            var x1 = this.options.padding.left + i * unit_w;
            var y1 = this.options.c3_y_top;
            var x2 = this.options.padding.left + i * unit_w;
            var y2 = this.options.c3_y_top + c_t_height;

            if(!(i == 0 || i == this.options.x_sepe_num)){
                DrawDashLine(ctx, x1, y1, x2, y2, 5);
            }
            
        }
        ctx.stroke();
        ctx.beginPath();

        // 恢复画笔状态
        ctx.restore();

    }

    // 绘制成交量坐标轴
    DrawXY.prototype.drawXYV = function(){

        var ctx = this.options.context;
        var data = this.options.currentData || this.options.data;

        // 保存画笔状态
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "#e1e1e1";
        this.options.context.rect(XYF(this.options.padding.left),XYF(this.options.c2_y_top - this.options.unit_height),Math.round(this.options.drawWidth - 2),Math.round(this.options.c_v_height + this.options.unit_height));
        ctx.stroke();

        var c2_y_top = this.options.c2_y_top;
        ctx.fillStyle = this.options.color.fillStyle;
        ctx.strokeStyle = this.options.color.strokeStyle;
        // ctx.rect(this.options.padding.left,c2_y_top,ctx.canvas.width - this.options.padding.left - 2,v_height);
        for(var i = 0;i<4;i++){
            ctx.beginPath();
            var x1 = this.options.padding.left;
            var y1 = c2_y_top + ctx.canvas.height * 1 / this.options.y_sepe_num * i;
            var x2 = ctx.canvas.width - this.options.padding.right;
            var y2 = c2_y_top + ctx.canvas.height * 1 / this.options.y_sepe_num * i;

            if(i == 0 || i == 3){
                ctx.strokeStyle = "#e1e1e1";
                ctx.moveTo(XYF(x1),XYF(y1));
                ctx.lineTo(XYF(x2),XYF(y2));
                ctx.stroke();
            }else{
                ctx.strokeStyle = "#eeeeee";

                DrawDashLine(ctx, x1, Math.round(y1)+0.5, x2, Math.round(y2)+0.5, 5);
            }
        }

        ctx.beginPath();
        ctx.fillStyle = this.options.color.fillStyle;
        ctx.strokeStyle = this.options.color.strokeStyle;
        ctx.font="12px Arial,Helvetica,San-serif";
        ctx.textBaseline = "middle";
        ctx.fillText(common.format_unit(data.v_max/1,2), this.options.padding.left - 5 - ctx.measureText(common.format_unit(data.v_max/1,2)).width, this.options.c2_y_top);
        ctx.fillText(common.format_unit(data.v_max/1 * 2/3,2), this.options.padding.left - 5 - ctx.measureText(common.format_unit(data.v_max/1 * 2/3,2)).width, this.options.c2_y_top + 3 + this.options.v_base_height * 1/3);
        ctx.fillText(common.format_unit(data.v_max/1 * 1/3,2),  this.options.padding.left - 5 - ctx.measureText(common.format_unit(data.v_max/1 * 1/3,2)).width, this.options.c2_y_top + 5 + this.options.v_base_height * 2/3);
        ctx.fillText(0, this.options.padding.left - 5 - ctx.measureText("0").width, this.options.c2_y_top + 7 + this.options.v_base_height * 3/3);

        ctx.beginPath();
        /*画布宽度*/
        var k_width = this.options.drawWidth;
        /*K线图的高度*/
        var c_v_height = this.options.c_v_height;
        var unit_w = (k_width) / (this.options.x_sepe_num);
        for(var i = 0;i <= this.options.x_sepe_num;i++){
            var x1 = this.options.padding.left + i * unit_w;
            var y1 = this.options.c2_y_top;
            var x2 = this.options.padding.left + i * unit_w;
            var y2 = this.options.c2_y_top + c_v_height;

            if(!(i == 0 || i == this.options.x_sepe_num)){
                ctx.strokeStyle = "#eeeeee";
                DrawDashLine(ctx, x1, Math.round(y1), x2, Math.round(y2), 5);
            }
            
        }
        ctx.stroke();
        ctx.beginPath();

        // 恢复画笔状态
        ctx.restore();
    }

    //绘制K线图坐标轴
    DrawXY.prototype.drawXYK = function(){
        var ctx = this.options.context;
        var data = this.options.currentData || this.options.data;

        /*Y轴上的最大值*/
        var y_max = data.max;
        /*Y轴上的最小值*/
        var y_min = data.min;

        /*Y轴上分隔线数量*/
        var sepe_num = 9;

        /*K线图的高度*/
        var k_height = this.options.c_k_height;
        /*Y轴标识线列表*/
        var line_list_array = getLineList(y_max/1, y_min/1, sepe_num, k_height);

        // 保存画笔状态
        ctx.save();
        
        var sepe_num = line_list_array.length;
        ctx.fillStyle = this.options.color.fillStyle;
        ctx.strokeStyle = this.options.color.strokeStyle;
        ctx.font="12px Arial,Helvetica,San-serif";
        ctx.textBaseline = "middle";
        for (var i = 0,item; item = line_list_array[i]; i++) {
            ctx.beginPath();
            if(i == 0 || i == line_list_array.length - 1){
                ctx.strokeStyle = "#e1e1e1";
                ctx.moveTo(XYF(this.options.padding.left), XYF(item.y));
                ctx.lineTo(XYF(ctx.canvas.width - this.options.padding.right), XYF(item.y));
                ctx.stroke();
            }else{
                ctx.strokeStyle = "#eeeeee";
                DrawDashLine(ctx,this.options.padding.left, Math.round(item.y),ctx.canvas.width - this.options.padding.right, Math.round(item.y),5);
            }
            // 绘制纵坐标刻度
            ctx.moveTo(0.5, XYF(item.y + 5));
            var text = (item.num/1).toFixed(this.options.pricedigit);
            ctx.fillText(text, this.options.padding.left - 5 - ctx.measureText(text).width, item.y + 1);
        }

        /*K线图的高度*/
        var k_height = this.options.c_k_height;
        // 绘制横坐标刻度
        drawXMark.apply(this,[ctx,k_height]);

        // 恢复画笔状态
        ctx.restore();
    }
   
    /*绘制横坐标刻度值*/
    function drawXMark(ctx,k_height){
        
        /*画布宽度*/
        var k_width = this.options.drawWidth;
        
        var unit_w = (k_width) / (this.options.x_sepe_num);
        var XMark = this.options.XMark;

        // 保存画笔状态
        ctx.save();
        
        for(var i = 0;i <= this.options.x_sepe_num;i++){
            ctx.beginPath();
            var x1 = this.options.padding.left + i * unit_w;
            var y1 = 0;
            var x2 = this.options.padding.left + i * unit_w;
            var y2 = k_height;

            if(i == 0){
                ctx.strokeStyle = "#e1e1e1";
                ctx.moveTo(XYF(x1), XYF(y1));
                ctx.lineTo(XYF(x2), XYF(y2));
                ctx.stroke();
            }else if(i == this.options.x_sepe_num){
                ctx.strokeStyle = "#e1e1e1";
                ctx.moveTo(XYF(x1 - 1), XYF(y1));
                ctx.lineTo(XYF(x2 - 1), XYF(y2));
                ctx.stroke();
            }else{
                ctx.strokeStyle = "#eeeeee";
                DrawDashLine(ctx, x1, y1, x2, y2, 5);
            }
            
        }

        var XMark_length = XMark.length;
        ctx.font="12px Arial,Helvetica,San-serif";
        var step = 1;
        if(ctx.measureText(XMark[0]).width+4 >= this.options.drawWidth/6){
            step = 2;
        }
        for(var j = 0;j < XMark_length;j+=step){
            if(j == 0){
                ctx.fillText(XMark[j],  j / 4 * this.options.drawWidth + this.options.padding.left, this.options.c_k_height + this.options.unit_height/2);
            }else if(j == XMark_length - 1){
                ctx.fillText(XMark[j],  j / 4 * this.options.drawWidth + this.options.padding.left - ctx.measureText(XMark[j]).width, this.options.c_k_height + this.options.unit_height/2);
            }else{
                ctx.fillText(XMark[j],  j / 4 * this.options.drawWidth + this.options.padding.left - ctx.measureText(XMark[j]).width/2, this.options.c_k_height + this.options.unit_height/2);
            }

        }

        // 恢复画笔状态
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