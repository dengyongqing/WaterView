/*继承*/
var extend = require('tools/extend');
/*工具*/
var common = require('common');
/*主题*/
var theme = require('theme/default');
var DrawV = (function(){
	function DrawV(options){
		/*设置默认参数*/
		this.defaultoptions = theme.draw_v;
		this.options = {};
        extend(false,this.options, this.defaultoptions, options);
		/*绘图*/
		this.draw();
	};
	
	/*绘图*/
	DrawV.prototype.draw = function(){
		if(this.options.type == "TL") {
			/*绘制分时图成交量*/
			drawVTime.call(this);
		}else{
			/*绘制K线图成交量*/
			drawVK.call(this);
		}
		
	};
	/*绘制分时图成交量*/
	function drawVTime(){
		var ctx = this.options.context;
		var data = this.options.data;
		/*成交量数组*/
		var data_arr = data.data;
		var v_height = ctx.canvas.height / 4;
		var v_base_height = v_height * 0.9;
		var y_v_bottom = ctx.canvas.height - this.options.canvas_offset_top;
		var y_v_top = y_v_bottom - v_height;

		if(!data_arr || data_arr.length == 0){
			ctx.beginPath();
			ctx.fillStyle = '#999';
			ctx.strokeStyle = 'rgba(230,230,230, 1)';
			ctx.fillText(0,0,y_v_top + 10);
			ctx.rect(this.options.padding_left,y_v_top,ctx.canvas.width - this.options.padding_left -2,v_height);
			ctx.stroke();
			return;
		}

		if(this.options.type == "TL") {
			this.options.data.v_max = getVMax(this.options.data);
		}

		/*Y轴上的最大值*/
		// var y_max = data.max;
		/*Y轴上的最小值*/
		// var y_min = data.min;
		/*最大成交量*/
		var v_max = (data.v_max).toFixed(0);
		
		/*K线图表的高度*/
		// var c_1_height = this.options.c_1_height;
		//成交量图表的高度
		// var v_height = ctx.canvas.height - c_1_height - this.options.k_v_away - this.options.canvas_offset_top;
		
		/*获取单位矩形对象*/
		var rect_unit = this.options.rect_unit;
		/*单位绘图矩形画布的宽度*/
		// var rect_w = rect_unit.rect_w;
		/*K线柱体的宽度*/
		var bar_w = rect_unit.bar_w;
		/*K线柱体的颜色*/
		var up_color = this.options.up_color;
		var down_color =this.options.down_color

		//标识最大成交量
		markVMax.apply(this,[ctx,v_max,y_v_top]);

		ctx.strokeStyle = 'rgba(230,230,230, 1)';
		ctx.lineWidth = this.options.dpr;
		ctx.rect(this.options.padding_left,y_v_top,ctx.canvas.width - this.options.padding_left -2,v_height);
		ctx.stroke();

		ctx.lineWidth = 1;
		for(var i = 0,item; item = data_arr[i]; i++){

			var volume = item.volume;
			var is_up = item.up;
			var bar_height = volume/v_max * v_base_height;
			var x = common.get_x.call(this,i + 1);
			var y = y_v_bottom - bar_height;

			ctx.beginPath();
			ctx.moveTo(x,y);

			if(i == 0){
				if(is_up){
					ctx.fillStyle = up_color;
					ctx.strokeStyle = up_color;
				}else{
					ctx.fillStyle = down_color;
					ctx.strokeStyle = down_color;
				}
			}else{
				if(item.price >= data_arr[i - 1].price){
					ctx.fillStyle = up_color;
					ctx.strokeStyle = up_color;
				}else{
					ctx.fillStyle = down_color;
					ctx.strokeStyle = down_color;
				}
			}

			ctx.rect(x - bar_w/2,y,bar_w,bar_height);
			ctx.stroke();
			ctx.fill();
		}

	}
	/*绘制K线图成交量*/
	function drawVK(){
		var ctx = this.options.context;
		var data = this.options.data;
		/*成交量数组*/
		var data_arr = data.data;
		var v_height = ctx.canvas.height / 4;
		var v_base_height = v_height * 0.9;
		var y_v_bottom = ctx.canvas.height - this.options.canvas_offset_top;
		var y_v_top = y_v_bottom - v_height;

		if(!data_arr || data_arr.length == 0){
			ctx.beginPath();
			ctx.fillStyle = '#999';
			ctx.strokeStyle = 'rgba(230,230,230, 1)';
			ctx.fillText(0,0,y_v_top + 10);
			ctx.rect(this.options.padding_left,y_v_top,ctx.canvas.width - this.options.padding_left -2,v_height);
			ctx.stroke();
			return;
		}


		/*Y轴上的最大值*/
		// var y_max = data.max;
		/*Y轴上的最小值*/
		// var y_min = data.min;
		/*最大成交量*/
		var v_max = (data.v_max).toFixed(0);
		
		/*K线图表的高度*/
		// var c_1_height = this.options.c_1_height;
		//成交量图表的高度
		// var v_height = ctx.canvas.height - c_1_height - this.options.k_v_away - this.options.canvas_offset_top;
		
		/*获取单位矩形对象*/
		var rect_unit = this.options.rect_unit;
		/*单位绘图矩形画布的宽度*/
		// var rect_w = rect_unit.rect_w;
		/*K线柱体的宽度*/
		var bar_w = rect_unit.bar_w;
		/*K线柱体的颜色*/
		var up_color = this.options.up_color;
		var down_color =this.options.down_color

		//标识最大成交量
		markVMax.apply(this,[ctx,v_max,y_v_top]);

		ctx.strokeStyle = 'rgba(230,230,230, 1)';
		ctx.lineWidth = this.options.dpr;
		ctx.rect(this.options.padding_left,y_v_top,ctx.canvas.width - this.options.padding_left -2,v_height);
		ctx.stroke();

		ctx.lineWidth = 1;
		for(var i = 0,item; item = data_arr[i]; i++){

			var volume = item.volume;
			var is_up = item.up;
			var bar_height = volume/v_max * v_base_height;
			var x = common.get_x.call(this,i + 1);
			var y = y_v_bottom - bar_height;

			ctx.beginPath();
			ctx.moveTo(x,y);

			if(is_up){
				ctx.fillStyle = up_color;
				ctx.strokeStyle = up_color;
			}else{
				ctx.fillStyle = down_color;
				ctx.strokeStyle = down_color;
			}

			ctx.rect(x - bar_w/2,y,bar_w,bar_height);
			ctx.stroke();
			ctx.fill();
		}

	}
	// 标识最大成交量
	function markVMax(ctx,v_max,y_v_end){
		ctx.beginPath();
		ctx.fillStyle = '#999';
		ctx.fillText(common.format_unit(v_max),0,y_v_end + 10);
		ctx.stroke();
	}
	// 获取最大成交量
	function getVMax(data){
		if(data.data[0]){
			var max = data.data[0].volume;
		}else{
			var max = 0;
		}
		
		for(var i = 0,item = data.data;i<data.data.length;i++) {
			if(max<item[i].volume)
			{
				max=item[i].volume;
			}
		}
		return max
	}

	return DrawV;
})();

module.exports = DrawV;