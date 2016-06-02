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
		// 设置默认参数
        this.defaultoptions = theme.drawLine;
        this.options = {};
        extend(false,this.options, this.defaultoptions, options);
        // 绘图
        this.draw();
	};
	
	// 绘图
	DrawLine.prototype.draw = function(){

		var ctx = this.options.context;
		// 折线数据
		var series = this.options.series;
		for(var i = 0,line;line = series[i]; i++){
			 drawLine.apply(this,[ctx,line]);
			 drawPoint.apply(this,[ctx,line]);
		}
		
	};
	
	// 绘制折线
	function drawLine(ctx,line){
		// 保存画笔状态
		ctx.save();

		var arr = line.data;
        var arr_length = arr.length;

		ctx.beginPath();

		// 填充颜色
		ctx.fillStyle = line.color;
		// 画笔颜色
        ctx.strokeStyle = line.color;

		for(var i = 0,item;item = arr[i]; i++){
			 var x = (ctx.canvas.width/6) * (i + 1);
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

        // 填充颜色
		ctx.fillStyle = line.color;
		// 画笔颜色
        ctx.strokeStyle = line.color;

		for(var i = 0,item;item = arr[i]; i++){
			 ctx.beginPath();
			 var x = (ctx.canvas.width/6) * (i + 1);
			 var y = common.get_y.call(this,item);
			 if(i == 0){
			 	ctx.arc(x, y, 10, 0, Math.PI * 2, true); 
			 	ctx.fill();
			 }else if(i == arr_length - 1){
			 	
			 }else{
			 	ctx.arc(x, y, 10, 0, Math.PI * 2, true); 
			 	ctx.fill();
			 }
		 	 
		}
		// 恢复画笔状态
		ctx.restore();
	}
	return DrawLine;
})();

module.exports = DrawLine;