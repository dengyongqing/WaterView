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
var DrawQuarterLine = (function(){
    function DrawQuarterLine(options){
        // 设置默认参数
        this.defaultoptions = theme.drawLine;
        this.options = {};
        extend(false,this.options, this.defaultoptions, options);
        // 绘图  
        this.draw();
    };
    
    // 绘图
    DrawQuarterLine.prototype.draw = function(){

        var ctx = this.options.context;
        ctx.lineWidth = 1 * this.options.dpr;
        // 折线数据
        var series = this.options.series;
        // 横坐标数据
        var xaxis = this.options.xaxis;
        ctx.beginPath();
        // 画笔颜色
        ctx.strokeStyle = this.options.line.color == undefined ? "#333" : this.options.line.color;

        for(var i = 0,se;se = series[i]; i++){
           
            var line_arr = se.data;

            for(var j = 0,line;line = line_arr[j]; j++){
                
                var x = get_x.apply(this,[i,j]);
                var y = get_y.call(this,line);

                ctx.lineTo(x,y);
        
            }
        }
        ctx.stroke();

        if(this.options.point && this.options.point.show){
            drawPoint.apply(this,[ctx,series,this.options.point.color]);
        }
     
    };

    // 绘制折线节点（连接点）
    function drawPoint(ctx,series,color){
        // 保存画笔状态
        ctx.save();

        // 横坐标数据
        var xaxis = this.options.xaxis;
        // 节点（折线连接点半径）
        var pointRadius = this.options.point.pointradius;
        // 填充颜色
        ctx.fillStyle = color == undefined ? "#333" : color;

        for(var i = 0,se;se = series[i]; i++){
            var line_arr = se.data;
            for(var j = 0,line;line = line_arr[j]; j++){
                ctx.beginPath();
                var x = get_x.apply(this,[i,j]);
                var y = get_y.call(this,line);
                ctx.arc(x, y, pointRadius, 0, Math.PI * 2, true); 
                ctx.fill();
            }
            
        }

        // 恢复画笔状态
        ctx.restore();
    }

    // 图表y轴坐标计算
    function get_y(y) {
        if(!this.options.isLessZero){
            return this.options.c_1_height - (this.options.c_1_height * (y - this.options.data.min)/(this.options.data.max - this.options.data.min));
        }else{
            return this.options.c_1_height/2 - (this.options.c_1_height/2 * (y)/(this.options.data.max));  
        }
    }
    // 图表x轴坐标计算
    function get_x(year_num,quarter_num) {
        var canvas = this.options.context.canvas;
        var yearUnit = this.options.yearUnit;
        var quarterUnit = this.options.quarterUnit;
        var total = this.options.series.length;
        var padding_left = this.options.padding_left;
        var year_sepe = this.options.yearUnit.rect_w - this.options.yearUnit.bar_w;
        var quarter_sepe = this.options.quarterUnit.rect_w - this.options.quarterUnit.bar_w;
        // var dpr = this.options.dpr;
        return yearUnit.rect_w * year_num + padding_left + quarterUnit.rect_w * quarter_num + year_sepe;
    }

    return DrawQuarterLine;
})();

module.exports = DrawQuarterLine;