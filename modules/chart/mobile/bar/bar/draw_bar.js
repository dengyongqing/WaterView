function drawBar(){
	var series = this.options.series;
	var unit_w_len = this.options.unit_w_len;
	var unit_w_kind = this.options.unit_w_kind;
	var coordinate = this.options.coordinate;
	var maxY = coordinate.max;
	var minY = coordinate.min;
	var stepHeight = coordinate.stepHeight;
	var sepeNum = this.options.sepeNum;

	var canvas = this.options.canvas;
	var ctx = this.options.context;
	var paddingTop = this.options.padding.top;
    var paddingLeft = this.options.padding.left;
    var paddingRight = this.options.padding.right;
    var paddingBottom = this.options.padding.bottom;
    var totalHeight = canvas.height - paddingBottom - paddingTop;
    var baseLine = paddingTop + (maxY/stepHeight) * (totalHeight)/sepeNum;
    // console.log(paddingTop);
    // console.log(baseLine);stepHeight*totalHeight/(maxY-minY)
    // console.log();

    ctx.beginPath();
    ctx.fillStyle = this.options.series[0].color;
	for(var i = 0, len = series.length; i < len; i++){
		for(var j = 0, dataLen = series[i].data.length; j < dataLen; j++){
			var width = unit_w_kind;
			var height = totalHeight*(series[i].data[j]/(maxY-minY));
			var x = j*unit_w_len + paddingLeft + unit_w_kind + 2*i*unit_w_kind;
			var y = baseLine - height;
			// console.log(y);
			ctx.fillRect(x, y, width, height);
		}
	}
}

module.exports = drawBar;