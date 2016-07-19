/**
 * 绘制K线
 *
 * this:{
 *     container:画布的容器
 *     interactive:图表交互
 * }
 * this.options:{
 *     data:    行情数据
 *     type:    "TL"(分时图),"DK"(日K线图),"WK"(周K线图),"MK"(月K线图)
 *     canvas:  画布对象
 *     ctx:     画布上下文
 *     canvas_offset_top:   画布中坐标轴向下偏移量
 *     padding_left:    画布左侧边距
 *     k_v_away:    行情图表（分时图或K线图）和成交量图表的间距
 *     scale_count:     缩放默认值
 *     c_1_height:  行情图表（分时图或K线图）的高度
 *     rect_unit:   分时图或K线图单位绘制区域
 * }
 *
 */

/*继承*/
var extend = require('tools/extend');
/*主题*/
var theme = require('theme/default');
/*工具*/
var common = require('common');
var DrawBar = (function(){
    function DrawBar(options){
        // 设置默认参数
        this.defaultoptions = theme.drawLine;
        this.options = {};
        extend(false,this.options, this.defaultoptions, options);
        // 绘图
        this.draw();
    };
    
    // 绘图
    DrawBar.prototype.draw = function(){

        var ctx = this.options.context;
        ctx.lineWidth = 1 * this.options.dpr + 1;
        // 折线数据
        var series = this.options.series;
        // 横坐标数据
        var xaxis = this.options.xaxis;
        for(var i = 0,se;se = series[i]; i++){
            // 填充颜色
            ctx.fillStyle = xaxis[i].color == undefined ? "#333" : xaxis[i].color;
            // 画笔颜色
            ctx.strokeStyle = xaxis[i].color == undefined ? "#333" : xaxis[i].color;
            var bar_arr = se.data;

            for(var j = 0,bar;bar = bar_arr[j]; j++){
                var x = get_x.apply(this,[i,j]);
                var y = get_y.call(this,bar);
            }
            
        }
     
    };

    // 图表y轴坐标计算
    function get_y(y) {
        return this.options.canvas.height - (this.options.canvas.height * (y - this.options.data.min)/(this.options.data.max - this.options.data.min));
    }
    // 图表x轴坐标计算
    function get_x(year_num,quarter_num) {
        var canvas = this.options.context.canvas;
        var quarterUnit = this.options.quarterUnit;
        var total = this.options.series.length;
        var padding_left = this.options.padding_left;
        // var dpr = this.options.dpr;
        return (canvas.width-padding_left) / total * year_num + padding_left + quarterUnit.rect_w * quarter_num + quarterUnit.rect_w/2;
    }
    
    // 绘制折线
    function drawLine(ctx,line){
        // 保存画笔状态
        ctx.save();

        var arr = line.data;
        var arr_length = arr.length;

        ctx.beginPath();

        for(var i = 0,item;item = arr[i]; i++){
             var x = ((ctx.canvas.width - this.options.padding_left)/(arr_length-1)) * (i) + this.options.padding_left;
             var y = common.get_y.call(this,item);
             if(i == 0){
                ctx.moveTo(this.options.padding_left,y);
             }else if(i == arr_length - 1){
                ctx.lineTo(x,y);
             }else{
                ctx.lineTo(x,y);
             }
        }
        
        // ctx.fill();
        ctx.stroke();
        // 恢复画笔状态
        ctx.restore();
    }

    // 绘制折线节点（连接点）
    function drawPoint(ctx,line){
        // 保存画笔状态
        ctx.save();

        var arr = line.data;
        var arr_length = arr.length;

        // 节点（折线连接点半径）
        var pointRadius = this.options.pointRadius;

        for(var i = 0,item;item = arr[i]; i++){
             ctx.beginPath();
             var x = ((ctx.canvas.width - this.options.padding_left)/(arr_length-1)) * (i) + this.options.padding_left;
             var y = common.get_y.call(this,item);
             if(i == 0){
                ctx.arc(x, y, pointRadius, 0, Math.PI * 2, true); 
                ctx.fill();
             }else if(i == arr_length - 1){
                
             }else{
                ctx.arc(x, y, pointRadius, 0, Math.PI * 2, true); 
                ctx.fill();
             }
             
        }
        // 恢复画笔状态
        ctx.restore();
    }


    // 绘制折线标识
    function drawLineMark(ctx,series){
        // 保存画笔状态
        ctx.save();
        var dpr = this.options.dpr;
        var x_middle = ctx.canvas.width/2;
        var wh = this.options.lineMarkWidth * dpr;
        var x_start = 0;
        var y_start = ctx.canvas.height * (7/9 - 1/18);

        for(var i = 0,line;line = series[i]; i++){
            ctx.beginPath();
            
            // 画笔颜色
            ctx.strokeStyle = '#cadef8';
            var mark_offset = (Math.floor(i/2)) * (wh + 7 * dpr);
            var text_offset = this.options.font_size * this.options.dpr + (wh-this.options.font_size * this.options.dpr)/2;
            if(i == 0){
                // 填充颜色
                ctx.fillStyle = line.color;
                ctx.rect(x_start + 20,y_start,wh,wh);
                ctx.fill();
                // 填充颜色
                ctx.fillStyle = '#333';
                ctx.fillText(line.name, x_start + wh + 80, y_start + text_offset);
            }else if((i + 1) % 2 == 0){
                // 填充颜色
                ctx.fillStyle = line.color;
                ctx.rect(x_middle,y_start + mark_offset,wh,wh);
                ctx.fill();
                // 填充颜色
                ctx.fillStyle = '#333';
                ctx.fillText(line.name, x_middle + wh + 60, y_start + mark_offset + text_offset);
            }else{
                // 填充颜色
                ctx.fillStyle = line.color;
                ctx.rect(x_start + 20,y_start + mark_offset,wh,wh);
                ctx.fill();
                ctx.fillStyle = '#333';
                ctx.fillText(line.name, x_start + wh + 80, y_start + mark_offset + text_offset);
            }
        }
        // 恢复画笔状态
        ctx.restore();
    }

    return DrawBar;
})();

module.exports = DrawBar;