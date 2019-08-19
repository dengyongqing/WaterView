function drawLine(params){
	// 保存画笔状态
	var ctx = params.ctx;
	ctx.save();
    ctx.beginPath();
    ctx.lineWidth = params.lineWidth == undefined ? 1 : params.lineWidth;
	ctx.strokeStyle = params.color == undefined ? "#333" : params.color;
	var data_arr = params.data;

	for(var i = 0,item;item = data_arr[i]; i++){
		if(i == 0){
			ctx.moveTo(item.x,item.y);
		}else{
			ctx.lineTo(item.x,item.y);
		}
	}
	ctx.stroke();
	// 恢复画笔状态
	ctx.restore();
}

module.exports = drawLine;