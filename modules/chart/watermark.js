/*工具*/
var common = require('tools/common'); 
/*加水印*/
function addWatermark(ctx,right,top) {
	var canvas = ctx.canvas;
	var img = new Image();
    img.src = require("../images/water_mark.png");
    ctx.drawImage(img, canvas.width - right, top, 164, 41);	
}

module.exports = addWatermark;