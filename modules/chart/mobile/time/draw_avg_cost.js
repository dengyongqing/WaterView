/**
 * 绘制分时图平均成本线
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
 
 * }
 *
 */

// 拓展，合并，复制
var extend = require('tools/extend');
// 主题
var theme = require('theme/default');
// 工具
var common = require('common');
var coordinate = require('chart/mobile/time/coordinate'); 
var Draw_Avg_Cost = (function () {
	function Draw_Avg_Cost(options){
		// 设置默认参数
        this.defaultoptions = theme.draw_line;
        this.options = {};
        extend(true,this.options,this.defaultoptions, options);
        // 绘图
        this.draw();
	}

	Draw_Avg_Cost.prototype.draw = function() {
		var ctx = this.options.context;
		var data = this.options.data;
		this.options.height = ctx.canvas.height * theme.defaulttheme.c_h_percent;
		// 绘制平均线
		this.draw_k(ctx,data);
	};
	// 绘制平均线
	Draw_Avg_Cost.prototype.draw_k = function(ctx,data) {
		var color = this.options.avg_cost_color;
		var data_arr = data.data;
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = color;
		ctx.fillStyle = '';
		for(var i = 0;i<data_arr.length;i++) {
			var x = coordinate.get_x.call(this,i+1);
			var y = coordinate.get_y.call(this,data_arr[i].avg_cost);
			if(i == 0){
				ctx.moveTo(x,y);
			}
			else {
				ctx.lineTo(x,y);
			}
			
		}
		ctx.stroke();
		
	};

	return Draw_Avg_Cost
})()

module.exports = Draw_Avg_Cost;