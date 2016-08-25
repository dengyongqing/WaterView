/**
 * 绘制直角坐标系
 */
var extend = require('tools/extend2');
/*主题*/
var theme = require('theme/default');
/*绘制网格虚线*/
var DrawDashLine = require('chart/web/common/draw_dash_line');
// 工具
var common = require('chart/web/common/common'); 
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
        var canvas = this.options.canvas;

        // 保存画笔状态
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.options.color.fillStyle;
        ctx.strokeStyle = this.options.color.strokeStyle;
        ctx.moveTo(this.options.padding.left,this.options.c3_y_top - this.options.unit_height);
        ctx.lineTo(this.options.padding.left,this.options.c3_y_top + this.options.c_t_height);
        this.options.context.rect(this.options.padding.left,this.options.c3_y_top - this.options.unit_height,this.options.drawWidth - 2,this.options.c_t_height + this.options.unit_height);
        ctx.stroke();

        var c3_y_top = this.options.c3_y_top;
        ctx.fillStyle = this.options.color.fillStyle;
        ctx.strokeStyle = this.options.color.strokeStyle;
        // ctx.rect(this.options.padding.left,c2_y_top,ctx.canvas.width - this.options.padding.left - 2,v_height);
        for(var i = 0;i<3;i++){
            var x1 = this.options.padding.left;
            var y1 = c3_y_top + ctx.canvas.height * 1 / this.options.y_sepe_num * i;
            var x2 = this.options.padding.left + this.options.drawWidth;
            var y2 = c3_y_top + ctx.canvas.height * 1 / this.options.y_sepe_num * i;

            if(i == 0 || i == 2){
                ctx.moveTo(x1,y1);
                ctx.lineTo(x2,y2);
            }else{
                DrawDashLine(ctx,x1, y1, x2, y2,5);
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
        var canvas = this.options.canvas;
        var data = this.options.currentData || this.options.data;

        // 保存画笔状态
        ctx.save();
        ctx.beginPath();
        this.options.context.rect(this.options.padding.left,this.options.c2_y_top - this.options.unit_height,this.options.drawWidth - 2,this.options.c_v_height + this.options.unit_height);
        ctx.stroke();

        var c2_y_top = this.options.c2_y_top;
        ctx.fillStyle = this.options.color.fillStyle;
        ctx.strokeStyle = this.options.color.strokeStyle;
        // ctx.rect(this.options.padding.left,c2_y_top,ctx.canvas.width - this.options.padding.left - 2,v_height);
        for(var i = 0;i<4;i++){
            var x1 = this.options.padding.left;
            var y1 = c2_y_top + ctx.canvas.height * 1 / this.options.y_sepe_num * i;
            var x2 = ctx.canvas.width - this.options.padding.right;
            var y2 = c2_y_top + ctx.canvas.height * 1 / this.options.y_sepe_num * i;

            if(i == 0 || i == 3){
                ctx.moveTo(x1,y1);
                ctx.lineTo(x2,y2);
            }else{
                DrawDashLine(ctx,x1, y1, x2, y2,5);
            }
        }

        var v_max = common.format_unit(data.v_max/1);
        ctx.fillStyle = this.options.color.fillStyle;
        ctx.strokeStyle = this.options.color.strokeStyle;
        ctx.fillText(common.format_unit(data.v_max/1,2),  0, this.options.c2_y_top + 10);
        ctx.fillText(common.format_unit(data.v_max/1 * 2/3,2),  0, this.options.c2_y_top + 10 + this.options.v_base_height * 1/3);
        ctx.fillText(common.format_unit(data.v_max/1 * 1/3,2),  0, this.options.c2_y_top + 10 + this.options.v_base_height * 2/3);
        ctx.fillText(0,  this.options.padding.left - 20, this.options.c2_y_top + 10 + this.options.v_base_height * 3/3);
        ctx.stroke();
        ctx.beginPath();
        // 恢复画笔状态
        ctx.restore();
    }

    //绘制K线图坐标轴
    DrawXY.prototype.drawXYK = function(){
        var ctx = this.options.context;
        var canvas = this.options.canvas;
        var data = this.options.currentData || this.options.data;
        var type = this.options.type;

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
        for (var i = 0,item; item = line_list_array[i]; i++) {
            ctx.beginPath();
            if(i == 0 || i == line_list_array.length - 1){
                ctx.moveTo(this.options.padding.left, Math.round(item.y));
                ctx.lineTo(ctx.canvas.width - this.options.padding.right, Math.round(item.y));
                ctx.stroke();
            }else{
                DrawDashLine(ctx,this.options.padding.left, Math.round(item.y),ctx.canvas.width - this.options.padding.right, Math.round(item.y),5);
            }
            // 绘制纵坐标刻度
            ctx.moveTo(0, item.y + 5);
            ctx.fillText((item.num/1).toFixed(this.options.pricedigit), 0, item.y + 5);
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
        // var dpr = this.options.dpr;
        var padding_left = this.options.padding_left;
        ctx.beginPath();
        
        /*画布宽度*/
        var k_width = this.options.drawWidth;
        
        var unit_w = (k_width) / (this.options.x_sepe_num);
        var XMark = this.options.XMark;

        // 保存画笔状态
        ctx.save();
        ctx.beginPath();
        for(var i = 0;i <= this.options.x_sepe_num;i++){

            var x1 = this.options.padding.left + i * unit_w;
            var y1 = 0;
            var x2 = this.options.padding.left + i * unit_w;
            var y2 = k_height;

            if(i == 0){
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }else if(i == this.options.x_sepe_num){
                ctx.moveTo(x1 - 1, y1);
                ctx.lineTo(x2 - 1, y2);
                ctx.stroke();
            }else{
                DrawDashLine(ctx, x1, y1, x2, y2, 5);
            }
            
        }

        var XMark_length = XMark.length;
        for(var j = 0;j < XMark_length;j++){
            if(j == 0){
                ctx.fillText(XMark[j],  j / 4 * this.options.drawWidth + this.options.padding.left, this.options.c_k_height + this.options.unit_height/2 + 5);
            }else if(j == XMark_length - 1){
                ctx.fillText(XMark[j],  j / 4 * this.options.drawWidth + this.options.padding.left - ctx.measureText(XMark[j]).width, this.options.c_k_height + this.options.unit_height/2 + 5);
            }else{
                ctx.fillText(XMark[j],  j / 4 * this.options.drawWidth + this.options.padding.left - ctx.measureText(XMark[j]).width/2, this.options.c_k_height + this.options.unit_height/2 + 5);
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