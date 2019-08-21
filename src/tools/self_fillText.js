/**
 * 
 */

function self_fillText(text,ctx,x,y,angle,flag){

	ctx.save();
	if(flag){
		ctx.translate(x,y);
		ctx.rotate((Math.PI / 180) * angle);
		ctx.translate(-x,-y);
		ctx.fillText(text,x,y);
		ctx.rotate(-(Math.PI / 180) * angle);
	}else{
		ctx.translate(x,y);
		ctx.rotate((Math.PI / 180) * angle);
		ctx.translate(-x,-y);
		// var len_arr = text.split("");
		// var length = len_arr.length;
		// var temp_y = y;
		// for(var i = 0;i<length;i++){

		// 	var c = text.substr(i,1);
		// 	ctx.fillText(c,x,temp_y);
		// 	temp_y = temp_y + 13;
		// }
		ctx.fillText(text,x,y);
		ctx.rotate(-(Math.PI / 180) * angle);

	}
	
	ctx.restore();
}

module.exports = self_fillText;