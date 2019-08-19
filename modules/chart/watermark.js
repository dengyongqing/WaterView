/*加水印*/
function addWatermark(ctx,right,top,width,height,flag) {
    var _this = this;
	var canvas = ctx.canvas;
	var img = new Image();
    width = width == undefined ? 164 : width;
    height = height == undefined ? 41 : height;
    img.width = 0;
    img.height = 0;

    img.src = 'http://g1.dfcfw.com/g1/201607/20160727150611.png';

    if(flag){
    	ctx.drawImage(img, canvas.width - right, top, width, height);	
    }else{
    	img.onload = function(){
	    	setTimeout(function(){
	    		ctx.drawImage(img, canvas.width - right, top, width, height);	
	    	}, 0);

	    }
    }
}

module.exports = addWatermark;