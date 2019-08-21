function drawK(params){
	// 保存画笔状态
	var ctx = params.ctx;
    ctx.save();
	ctx.beginPath();
	ctx.lineWidth = 1;

	var x = params.x;
 	var y_open = params.y_open;
 	var y_close = params.y_close;
 	var y_highest = params.y_highest;
 	var y_lowest = params.y_lowest;
 	var bar_w = params.bar_w;

 	ctx.moveTo(x,y_lowest);
 	ctx.lineTo(x,y_highest);
 	ctx.stroke();

 	ctx.beginPath();

 	if(y_close >= y_open){
 		ctx.rect(params.x - bar_w/2,y_open,bar_w,y_close - y_open);
 	}else{
 		ctx.rect(params.x - bar_w/2,y_close,bar_w,y_open - y_close);
 	}

 	ctx.stroke();
 	ctx.fill();

 	// 恢复画笔状态
	ctx.restore();
 }
 
 module.exports = drawK;