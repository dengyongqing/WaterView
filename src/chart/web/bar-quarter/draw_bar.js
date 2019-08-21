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
var extend = require('tools/extend2');
/*主题*/
var theme = require('theme/default');
var DrawBar = (function(){
    function DrawBar(options){
        // 设置默认参数
        this.defaultoptions = theme.drawLine;
        this.options = extend(this.defaultoptions, options);
        
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
           
            var bar_arr = se.data;

            for(var j = 0,bar;bar = bar_arr[j]; j++){
                ctx.beginPath();
                // 填充颜色
                ctx.fillStyle = xaxis[i].colors[j] == undefined ? "#333" : xaxis[i].colors[j];
                // 画笔颜色
                ctx.strokeStyle = xaxis[i].colors[j] == undefined ? "#333" : xaxis[i].colors[j];
                var x = get_x.apply(this,[i,j]);
                var y = get_y.call(this,bar);
                if(!this.options.isLessZero){
                    ctx.rect(x,y,this.options.quarterUnit.bar_w,this.options.c_1_height - y);
                }else{
                    ctx.rect(x,this.options.c_1_height/2,this.options.quarterUnit.bar_w,this.options.c_1_height/2 - y);
                }
                ctx.fill();
            }
            
        }
     
    };

    // 图表y轴坐标计算
    function get_y(y) {
        if(!this.options.isLessZero){
            return this.options.c_1_height - (this.options.c_1_height * (y - this.options.data.min)/(this.options.data.max - this.options.data.min));
        }else{
            return this.options.c_1_height/2 - (this.options.c_1_height/2 * (-y)/(this.options.data.max));        
        }
    }
    // 图表x轴坐标计算
    function get_x(year_num,quarter_num) {
        var yearUnit = this.options.yearUnit;
        var quarterUnit = this.options.quarterUnit;
        var padding_left = this.options.padding_left;
        var year_sepe = this.options.yearUnit.rect_w - this.options.yearUnit.bar_w;
        var quarter_sepe = this.options.quarterUnit.rect_w - this.options.quarterUnit.bar_w;
        return yearUnit.rect_w * year_num + padding_left + quarterUnit.rect_w * quarter_num + year_sepe/2 + quarter_sepe/2;
    }

    return DrawBar;
})();

module.exports = DrawBar;