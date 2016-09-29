function drawBar(){
	var series = this.options.series;
	var unit_w_len = this.options.unit_w_len;
	var unit_w_kind = this.options.unit_w_kind;
	var maxY = this.options.coordinateMaxY;

	var canvas = this.options.canvas;
	var ctx = this.options.context;
	var paddingTop = this.options.padding.top;
    var paddingLeft = this.options.padding.left;
    var paddingRight = this.options.padding.right;
    var paddingBottom = this.options.padding.bottom;
    ctx.beginPath();
    ctx.fillStyle = this.options.series[0].color;
	for(var i = 0, len = series.length; i < len; i++){
		for(var j = 0, dataLen = series[i].data.length; j < dataLen; j++){
			var width = unit_w_kind;
			var height = (canvas.height - paddingTop - paddingBottom)*(series[i].data[j]/maxY);
			var x = j*unit_w_len + paddingLeft + unit_w_kind + 2*i*unit_w_kind;
			var y = canvas.height - paddingTop - paddingBottom - height;
			ctx.fillRect(x, y, width, height);
			console.log(x+","+y);
		}
	}
}

module.exports = drawBar;