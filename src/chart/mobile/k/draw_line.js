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
		drawFill.apply(this,[ctx,data_arr]);
	};
	/*绘制分时线*/
	function drawStroke(ctx,data_arr){
		ctx.beginPath();
	 	
		// ctx.strokeStyle = "rgba(0,0,0,0)";
		ctx.strokeStyle = "#3f88e5";
		
		// var data_arr_length = data_arr.length;
		for(var i = 0,item;item = data_arr[i]; i++){
			 var x = common.get_x.call(this,i + 1);
			 var y = common.get_y.call(this,item.price);
		 	 ctx.lineTo(x,y);
			 item.cross_x = x;
			 item.cross_y = y;
		}
		ctx.stroke();
	}
	/*分时线填充渐变色*/
	function drawFill(ctx,data_arr){
		var y_min = common.get_y.call(this,this.options.data.min);
		/* 指定渐变区域 */
        var grad  = ctx.createLinearGradient(0,0,0,ctx.canvas.height);
        /* 指定几个颜色 */
        grad.addColorStop(0,'rgba(221,234,250,0.7)');
        grad.addColorStop(1,'rgba(255,255,255,0)');
        var data_arr_length = data_arr.length;

		ctx.beginPath();
		ctx.fillStyle = grad;
		ctx.moveTo(this.options.padding_left,y_min);

		for(var i = 0,item;item = data_arr[i]; i++){
			 var x = common.get_x.call(this,i + 1);
			 var y = common.get_y.call(this,item.price);
			 if(i == data_arr_length - 1){
			 	ctx.lineTo(x,y_min);
			 }else{
			 	ctx.lineTo(x,y);
			 }
		}
		ctx.fill();
	}
	return DrawLine;
})();

module.exports = DrawLine;