// 格式化坐标
var XYF = require('chart/web/common/xyf');

module.exports = function(){
	var dpr = this.options.dpr,
		cvs = this.options.canvas,
		ctx = this.options.context,
		datas = this.options.series.data;

	var	coordinate = this.options.coordinate,
		sepeNum = this.options.sepeNum,
		unitHeight = this.options.unitHeight,
		paddingLeft = this.options.padding.left,
		paddingRight = this.options.padding.right,
		paddingTop = this.options.padding.top,
		totalWidth = (cvs.width - paddingLeft - paddingRight),
		baseLine = XYF(paddingLeft+totalWidth/sepeNum*(-coordinate.min/coordinate.stepHeight));

	var color = this.options.color,
		hoverColor = this.options.hoverColor;

	ctx.save();
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	ctx.beginPath();
	for(var i = 0, len = datas.length; i < len; i++){
		if(datas[i]<0){
			var barWidth = Math.round(datas[i]/coordinate.min*(totalWidth-paddingLeft - baseLine));
			ctx.fillRect(baseLine-barWidth, XYF(paddingTop + unitHeight*(i+1/3)), barWidth, Math.round(unitHeight/3));
		}else{
			ctx.fillRect(baseLine, XYF(paddingTop + unitHeight*(i+1/3)), Math.round(datas[i]/coordinate.max*(totalWidth-paddingLeft - baseLine)), Math.round(unitHeight/3));
		}
	}

}