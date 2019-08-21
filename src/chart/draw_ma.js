/*继承*/
var extend = require('tools/extend');
/*工具*/
var common = require('common');
/*主题*/
var theme = require('theme/default');
var DrawMA = (function(){
	function DrawMA(options){
		/*设置默认参数*/
        this.defaultoptions = theme.drawMA;
        this.options = {};
        extend(false,this.options, this.defaultoptions, options);
        /*绘图*/
        this.draw();
	};
	
	/*绘图*/
	DrawMA.prototype.draw = function(){
		var ctx = this.options.context;
		var data = this.options.data;
		/*5日均线数据*/
		var five_average = data.five_average;
		/*10日均线数据*/
		var ten_average = data.ten_average;
		/*20日均线数据*/
		var twenty_average = data.twenty_average;

		this.options.ma_5_data = drawMA.apply(this,[ctx,five_average,"#f4cb15"]);
		this.options.ma_10_data = drawMA.apply(this,[ctx,ten_average,"#ff5b10"]);
		this.options.ma_20_data = drawMA.apply(this,[ctx,twenty_average,"#488ee6"]);
	};
	/**
     * 绘制均线图
     */
    function drawMA(ctx,data_arr,color) {
    	var ma_data = [];
    	ctx.beginPath();
		ctx.strokeStyle = color;
		var flag = false;
		for(var i = 0;i < data_arr.length; i++){
			var item = data_arr[i];
			if(item && item.value){
				 var x = common.get_x.call(this,i + 1);
				 var y = common.get_y.call(this,item.value);
				 //横坐标和均线数据
				 ma_data.push(item);

				 if(i == 0 || y > (this.options.c_1_height - ctx.canvas.height/8/2)  || y < 0){
				 	ctx.moveTo(x,y);
				 	flag = true;
				 }else{
				 	if(flag){
				 		ctx.moveTo(x,y);
				 		flag = false;
				 	}else{
				 		ctx.lineTo(x,y);
				 	}
				 	
				 }
			}
			 
		}
		ctx.stroke();
		return ma_data;
    }
    
	return DrawMA;
})();

module.exports = DrawMA;