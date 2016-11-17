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
var DrawLine = (function(){
	function DrawLine(options){
		/*设置默认参数*/
        this.defaultoptions = theme.draw_line;
        this.options = {};
        extend(false,this.options, this.defaultoptions, options);
        /*绘图*/
        this.draw();
	};
	
	/*绘图*/
	DrawLine.prototype.draw = function(){

		var ctx = this.options.context;
		var data = this.options.data;
		var data_arr = data.data;
		
		drawStroke.apply(this,[ctx,data_arr]);
	};
	/*绘制分时线*/
	function drawStroke(ctx,data_arr){
		ctx.beginPath();
	 	ctx.save();
	 	
		ctx.strokeStyle = "#195F9A";

		for(var i = 0,item;item = data_arr[i]; i++){
			 var x = common.get_x.call(this,i + 1);
			 var y = common.get_y.call(this,item.price);
		 	 ctx.lineTo(x,y);
			 item.cross_x = x;
			 item.cross_y = y;
		}
		ctx.stroke();
		ctx.restore();
	}
	return DrawLine;
})();

module.exports = DrawLine;