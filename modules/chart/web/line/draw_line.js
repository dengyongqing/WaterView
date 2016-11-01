/**
 * 绘制折线图
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
var extend = require('tools/extend2');
/*主题*/
var theme = require('theme/default');
/*工具*/
var common = require('common');
var DrawLine = (function(){
	function DrawLine(options){
		// 设置默认参数
        this.options = extend(theme.defaulttheme, options);
        // 绘图
        this.draw();
	};
	
	// 绘图
	DrawLine.prototype.draw = function(){

		var ctx = this.options.context;
		ctx.lineWidth = 1 * this.options.dpr + 1;
		// 第一个坐标轴折线数据
		var series = this.options.series;
		// 横坐标数据
		// var xaxis = this.options.xaxis;
		for(var i = 0,line;line = series[i]; i++){
			// 填充颜色
			ctx.fillStyle = line.color == undefined ? "#333" : line.color;
			// 画笔颜色
	        ctx.strokeStyle = line.color == undefined ? "#333" : line.color;
        	drawLine.apply(this,[ctx,line,false]);
	        			
			if(line.showpoint){
				drawPoint.apply(this,[ctx,line,false]);
			}
			
		}
		// 第二个坐标轴折线数据
		var series2 = this.options.series2;

		for(var i = 0,line;line = series2[i]; i++){
			// 填充颜色
			ctx.fillStyle = line.color == undefined ? "#333" : line.color;
			// 画笔颜色
	        ctx.strokeStyle = line.color == undefined ? "#333" : line.color;
        	drawLine.apply(this,[ctx,line,true]);
	        			
			if(line.showpoint){
				drawPoint.apply(this,[ctx,line,true]);
			}
			
		}

		if(this.options.showflag){
			// drawLineMark.apply(this,[ctx,series]);
		}
	};
	
	// 绘制折线
	function drawLine(ctx,line,flag){
		// 保存画笔状态
		ctx.save();
		var arr = line.data;
        var arr_length = arr.length;

		ctx.beginPath();

		for(var i = 0;i < arr_length; i++){
			var item = arr[i];
			if(item){
				 var x = ((this.options.drawWidth - this.options.padding_left)/(arr_length-1)) * (i) + this.options.padding_left;
				 if(flag){
				 	var y = get_y.call(this,item);
				 }else{
				 	var y = common.get_y.call(this,item);
				 }
				 if(i == 0){
				 	ctx.moveTo(this.options.padding_left,y);
				 }else if(i == arr_length - 1){
				 	ctx.lineTo(x,y);
				 }else{
				 	ctx.lineTo(x,y);
				 }
			}else{
				 continue;
			}
			 
		}
		
		// ctx.fill();
		ctx.stroke();
		// 恢复画笔状态
		ctx.restore();
	}

	// 绘制折线节点（连接点）
	function drawPoint(ctx,line,flag){
		// 保存画笔状态
		ctx.save();

		var arr = line.data;
        var arr_length = arr.length;

        // 节点（折线连接点半径）
        var pointRadius = this.options.pointRadius;

		for(var i = 0,item;item = arr[i]; i++){
			 ctx.beginPath();
        	 var x = ((this.options.drawWdith)/(arr_length-1)) * (i) + this.options.padding_left;
			 if(flag){
			 	var y = get_y.call(this,item);
			 }else{
			 	var y = common.get_y.call(this,item);
			 }
			 
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
	    		// ctx.rect(x_start + 20,y_start + mark_offset,wh,wh);
	    		ctx.fill();
	    		ctx.fillStyle = '#333';
	    		ctx.fillText(line.name, x_start + wh + 80, y_start + mark_offset + text_offset);
	    	}
		}
		// 恢复画笔状态
		ctx.restore();
    }

    // 图表y轴坐标计算
    function get_y(y) {
        return this.options.c_1_height - (this.options.c_1_height * (y - this.options.data.min2)/(this.options.data.max2 - this.options.data.min2));
    }
    // 图表x轴坐标计算
    function get_x(year_num,quarter_num) {
        var group = this.options.group;
        var groupUnit = this.options.groupUnit;
        var padding_left = this.options.padding_left;
        var year_sepe = this.options.group.rect_w - this.options.group.bar_w;
        var quarter_sepe = this.options.groupUnit.rect_w - this.options.groupUnit.bar_w;
        return group.rect_w * year_num + padding_left + groupUnit.rect_w * quarter_num + year_sepe/2 + quarter_sepe/2;
    }


	return DrawLine;
})();

module.exports = DrawLine;