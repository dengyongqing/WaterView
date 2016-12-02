/*绘制每个柱体*/
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

    ctx.beginPath();
    ctx.save();
    ctx.lineWidth = this.options.dpr;
    ctx.fillStyle = this.options.series.color;
	for(var i = 0, len = series.data.length; i < len; i++){
		var width = unit_w_kind;
		var height = totalHeight*(series.data[i]/(maxY-minY));
		var x = i*unit_w_len + paddingLeft + unit_w_kind;
		var y = baseLine - height;
		ctx.fillRect(toEven(x), toEven(y), toEven(width), toEven(height));
	}
	ctx.restore()
}

function toEven(n){
	var num = Math.round(n);
	if(num % 2 === 0){
		return num;
	}else{
		return num + 1;
	}
}


module.exports = drawBar;