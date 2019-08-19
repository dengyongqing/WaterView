/**
 * 绘制折线图
 *
 * this:{
 *     container:画布的容器
 *     interactive:图表交互
 * }
 * this.options:{
 *     data:    行情数据
 *     canvas:  画布对象
 *     ctx:     画布上下文
 * }
 *
 */

/*继承*/
var extend = require('tools/extend');
/*主题*/
var theme = require('theme/default');
// 格式化坐标
var XYF = require('chart/web/common/xyf');
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
        ctx.beginPath();
        // 画笔颜色
        ctx.strokeStyle = this.options.line.color == undefined ? "#333" : this.options.line.color;

        for(var i = 0,se;se = series[i]; i++){
           
            var line_arr = se.data;

            for(var j = 0,line;line = line_arr[j]; j++){
                
                var x = get_x.apply(this,[i,j]);
                var y = get_y.call(this,line);
                if(i == 0 && j == 0){
                    ctx.moveTo(XYF(x),XYF(y));
                }else{
                    ctx.lineTo(XYF(x),XYF(y));
                }
        
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
                ctx.arc(XYF(x), XYF(y), pointRadius, 0, Math.PI * 2, true); 
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
        var yearUnit = this.options.yearUnit;
        var quarterUnit = this.options.quarterUnit;
        var padding_left = this.options.padding_left;
        var year_sepe = this.options.yearUnit.rect_w - this.options.yearUnit.bar_w;
        // var dpr = this.options.dpr;
        return yearUnit.rect_w * year_num + padding_left + quarterUnit.rect_w * quarter_num + year_sepe;
    }

    return DrawQuarterLine;
})();

module.exports = DrawQuarterLine;