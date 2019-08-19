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
// 格式化坐标
var XYF = require('chart/web/common/xyf');
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
		ctx.lineWidth = 1;
		// 第一个坐标轴折线数据
		var series = this.options.series;
		this.options.groupBarCount = 0;
		// 横坐标数据
		// var xaxis = this.options.xaxis;
		for(var i = 0,item;item = series[i]; i++){
			// 填充颜色
			ctx.fillStyle = item.color == undefined ? "#333" : item.color;
			// 画笔颜色
	        ctx.strokeStyle = item.color == undefined ? "#333" : item.color;
	        if(item.type == "bar"){
	        	this.options.groupBarCount++;
	        	drawBar.apply(this,[ctx,item,false]);
	        }
        	
		}

		for(var i = 0,item;item = series[i]; i++){
			// 填充颜色
			ctx.fillStyle = item.color == undefined ? "#333" : item.color;
			// 画笔颜色
	        ctx.strokeStyle = item.color == undefined ? "#333" : item.color;
	        if(item.type == "line"){
	        	drawLine.apply(this,[ctx,item,false]);
	        	if(item.showpoint){
					drawPoint.apply(this,[ctx,item,false]);
				}else if(item.data.length == 1){
					drawPoint.apply(this,[ctx,item,false]);
				}
	        }
        	
		}

		// 第二个坐标轴折线数据
		if(this.options.series2){
			var series2 = this.options.series2;
			for(var i = 0,item;item = series2[i]; i++){
				// 填充颜色
				ctx.fillStyle = item.color == undefined ? "#333" : item.color;
				// 画笔颜色
		        ctx.strokeStyle = item.color == undefined ? "#333" : item.color;
	        	if(item.type == "bar"){
		        	this.options.groupBarCount++;
		        	drawBar.apply(this,[ctx,item,true]);
		        }
				
			}
		}

		if(this.options.series2){
			var series2 = this.options.series2;
			for(var i = 0,item;item = series2[i]; i++){
				// 填充颜色
				ctx.fillStyle = item.color == undefined ? "#333" : item.color;
				// 画笔颜色
		        ctx.strokeStyle = item.color == undefined ? "#333" : item.color;
	        	if(item.type == "line"){
		        		drawLine.apply(this,[ctx,item,true]);
		        	if(item.showpoint){
						drawPoint.apply(this,[ctx,item,true]);
					}else if(item.data.length == 1){
						drawPoint.apply(this,[ctx,item,true]);
					}
		        }
				
			}
		}
		
	};

	// 绘制柱状图
	function drawBar(ctx,line,flag){
		// 保存画笔状态
		ctx.save();
		var arr = line.data;
        var arr_length = arr.length;
        if(flag){
        	var start_y = get_y.call(this,this.options.data.min2);
        }else{
        	var start_y = common.get_y.call(this,this.options.data.min);
        }
        
        var groupBarWidth = this.options.unit.groupBarWidth;
        var bar_w = groupBarWidth/this.options.unit.groupBarCount;
        var groupBarCount = this.options.groupBarCount;

		ctx.beginPath();

		for(var i = 0;i < arr_length; i++){
			var item = arr[i];
			if(item != null && item !== "" && item != undefined){
				 // var x = ((this.options.drawWidth - this.options.padding_left)/(arr_length-1)) * (i) + this.options.padding_left;
 				 var x = this.options.unit.unitWidth * (i) + this.options.unit.unitWidth/2 + this.options.padding_left;

				 if(flag){
				 	var y = get_y.call(this,item);
				 }else{
				 	var y = common.get_y.call(this,item);
				 }
				 
				 if(item >= 0){
			 		ctx.rect(XYF(x - groupBarWidth/2 + bar_w*(groupBarCount-1)),y,bar_w,start_y - y);
        			// ctx.stroke();
				 }else{
				 	ctx.rect(XYF(x - groupBarWidth/2 + bar_w*(groupBarCount-1)),start_y,bar_w,y-start_y);
				 }
			}
			 
		}
		
		ctx.fill();
		ctx.stroke();
		// 恢复画笔状态
		ctx.restore();
	}
	
	// 绘制折线
	function drawLine(ctx,line,flag){
		// 保存画笔状态
		ctx.save();
		var arr = line.data;
        var arr_length = arr.length;

		ctx.beginPath();

		for(var i = 0;i < arr_length; i++){
			var item = arr[i];
			if(item != null && item !== "" && item != undefined){
				 // var x = ((this.options.drawWidth - this.options.padding_left)/(arr_length-1)) * (i) + this.options.padding_left;
 				 var x = this.options.unit.unitWidth * (i) + this.options.unit.unitWidth/2 + this.options.padding_left;

				 if(flag){
				 	var y = get_y.call(this,item);
				 }else{
				 	var y = common.get_y.call(this,item);
				 }
				 if(i == 0){
				 	ctx.moveTo(x,y);
				 }else 
				 if(i == arr_length - 1){
				 	ctx.lineTo(x,y);
				 }else{
				 	ctx.lineTo(x,y);
				 }
			}
			 
		}
		
		// ctx.fill();
		ctx.stroke();
		ctx.beginPath();
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
       
		for(var i = 0;i < arr_length; i++){
			 var item = arr[i];
			 if(item != null && item !== "" && item != undefined){
			 	 ctx.beginPath();
				 if(arr_length == 1){
				 	var sepe_num = 1;
				 }else{
				 	var sepe_num = arr_length - 1;
				 }

				 if(arr_length == 1){
	 	        	 var x = (this.options.drawWidth - this.options.padding_left)/2 + this.options.padding_left;
				 }else{
	 	        	 // var x = ((this.options.drawWidth - this.options.padding_left)/sepe_num) * (i) + this.options.padding_left;
	  				 var x = this.options.unit.unitWidth * (i) + this.options.unit.unitWidth/2 + this.options.padding_left;
				 }

				 if(flag){
				 	var y = get_y.call(this,item);
				 }else{
				 	var y = common.get_y.call(this,item);
				 }
				 
				 if(i == 0){
				 	ctx.arc(XYF(x), XYF(y), pointRadius, 0, Math.PI * 2, true); 
				 	ctx.fill();
				 }else{
				 	ctx.arc(XYF(x), XYF(y), pointRadius, 0, Math.PI * 2, true); 
				 	ctx.fill();
				 }
		 	 
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