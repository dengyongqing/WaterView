/*工具*/
var common = require('common');
/*加号减号按钮*/
function Scale(canvas) {
	/*K线图表右下角相对于窗口的位置*/
    var w_pos = common.canvasToWindow.apply(this,[canvas,canvas.width,this.options.c_1_height]);
	if(!this.options.scale){
		this.options.scale = {};
		/*创建外部包裹元素*/
		var scale_div = document.createElement("div"); 
		scale_div.className = "scale-div";
		scale_div.style.right = "20px";
		scale_div.style.top = w_pos.y - 40 + "px";
		this.options.scale.scale = scale_div;

		/*创建文档碎片*/
		var frag = document.createDocumentFragment();

		/*创建减号*/
		var minus_button = document.createElement('span');
		minus_button.className = "span-minus";
		this.options.scale.minus = minus_button;

		/*创建加号*/
		var plus_button = document.createElement('span');
		plus_button.className = "span-plus";
		this.options.scale.plus = plus_button;

		frag.appendChild(minus_button);
		frag.appendChild(plus_button);
		scale_div.appendChild(frag);
		document.getElementById(this.options.container).appendChild(scale_div);
	}

}
module.exports = Scale;