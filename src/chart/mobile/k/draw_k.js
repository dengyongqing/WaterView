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

// 拓展，合并，复制
var extend = require('tools/extend');
// 工具
var common = require('common');
// 主题
var theme = require('theme/default');
var DrawK = (function(){
	function DrawK(options){
		// 设置默认参数
        this.defaultoptions = theme.draw_k;
        this.options = {};
        extend(false,this.options, this.defaultoptions, options);
        // 绘图
        this.draw();
	};

	// 绘图
	DrawK.prototype.draw = function(){
		var ctx = this.options.context;
		var data = this.options.data;
		var data_arr = data.data;

		// 绘制K线图
		this.drawK(ctx,data_arr);
	};
	
	// 绘制K线图
	DrawK.prototype.drawK = function(ctx,data_arr){
		
		// 获取单位绘制区域
		var rect_unit = this.options.rect_unit;
		// 单位绘制区域的宽度
		// var rect_w = rect_unit.rect_w;
		// K线柱体的宽度
		var bar_w = rect_unit.bar_w;
		// K线柱体的颜色
		var up_color = this.options.up_color;
		var down_color =this.options.down_color
		// 图表交互
        var inter = this.options.interactive;
        // 上榜日数组
        var pointObj = {};
        if(this.options.markPoint && this.options.markPoint.show){
        	var array = this.options.markPoint.dateList;
        	for(var index in array){
        		pointObj[array[index]] = array[index];
        	}
        }

		// for(var i = 0,item; item = data_arr[i]; i++){
		// 		// 是否上涨
		// 		var is_up = item.up;

		// 		ctx.beginPath();
		// 		ctx.lineWidth = 1;

		// 		if(is_up){
		// 		 	ctx.fillStyle = up_color;
	 //                ctx.strokeStyle = up_color
		// 		}else{
		// 			ctx.fillStyle = down_color
	 //                ctx.strokeStyle = down_color
		// 		}

		// 		var x = common.get_x.call(this,i + 1);
		// 	 	var y_open = common.get_y.call(this,item.open);
		// 	 	var y_close = common.get_y.call(this,item.close);
		// 	 	var y_highest = common.get_y.call(this,item.highest);
		// 	 	var y_lowest = common.get_y.call(this,item.lowest);
		// 	 	item.cross_x = x;
		// 	 	item.cross_y = y_close;
		// 	 	// console.log(x.toFixed(2).toString());

		// 	 	//标识上榜日
		// 	 	if(pointObj[item.data_time]){
		// 	 		inter.markPoint(x,item.data_time,this.options.context.canvas,this.options.scale_count);
		// 	 	}

		// 	 	ctx.moveTo(x,y_lowest);
		// 	 	ctx.lineTo(x,y_highest);
		// 	 	ctx.stroke();

		// 	 	ctx.beginPath();

		// 		// ctx.lineWidth = w * (1 - this.options.spacing);
		// 	 	// ctx.moveTo(x,y_open);
		// 	 	// ctx.lineTo(x,y_close);
			 	
		// 	 	if(y_close >= y_open){
		// 	 		ctx.rect(x - bar_w/2,y_open,bar_w,y_close - y_open);
		// 	 	}else{
		// 	 		ctx.rect(x - bar_w/2,y_close,bar_w,y_open - y_close);
		// 	 	}

		// 	 	ctx.stroke();
		// 	 	ctx.fill();


		// }

		var delay_draw = (function  delay_draw(_this,index,data_arr){
			setTimeout(draw_one_k.apply(_this,[index,data_arr[index],data_arr]),10);
			return arguments.callee;
		})(this,0,data_arr);

		function draw_one_k(index,item,data_arr){
			var _this = this;
			var i = index;
			return function(){
				// 是否上涨
				var is_up = item.up;

				ctx.beginPath();
				ctx.lineWidth = 1;

				if(is_up){
				 	ctx.fillStyle = up_color;
	                ctx.strokeStyle = up_color
				}else{
					ctx.fillStyle = down_color
	                ctx.strokeStyle = down_color
				}

				var x = common.get_x.call(_this,i + 1);
			 	var y_open = common.get_y.call(_this,item.open);
			 	var y_close = common.get_y.call(_this,item.close);
			 	var y_highest = common.get_y.call(_this,item.highest);
			 	var y_lowest = common.get_y.call(_this,item.lowest);
			 	item.cross_x = x;
			 	item.cross_y = y_close;
			 	// console.log(x.toFixed(2).toString());

			 	//标识上榜日
			 	if(pointObj[item.data_time]){
			 		inter.markPoint(x,item.data_time,_this.options.context.canvas,_this.options.scale_count);
			 	}

			 	ctx.moveTo(x,y_lowest);
			 	ctx.lineTo(x,y_highest);
			 	ctx.stroke();

			 	ctx.beginPath();

				// ctx.lineWidth = w * (1 - this.options.spacing);
			 	// ctx.moveTo(x,y_open);
			 	// ctx.lineTo(x,y_close);
			 	
			 	if(y_close >= y_open){
			 		ctx.rect(x - bar_w/2,y_open,bar_w,y_close - y_open);
			 	}else{
			 		ctx.rect(x - bar_w/2,y_close,bar_w,y_open - y_close);
			 	}

			 	ctx.stroke();
			 	ctx.fill();

			 	if(index < (data_arr.length-1)){
			 		delay_draw(_this,index+1,data_arr);
			 	}

			}
			
		}
	};

	return DrawK;
})();

module.exports = DrawK;