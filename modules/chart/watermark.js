/*加水印*/
function addWatermark(ctx,right,top) {
	var canvas = ctx.canvas;
	var img = new Image();
    img.width = 0;
    img.height = 0;
    //img.src = require("../images/water_mark.png");

    img.onload = function(){
        //console.info(111);
        setTimeout(function() {
            img.width = 164;
            img.height = 41;
            ctx.drawImage(img, canvas.width - right, top, 164, 41);	

        }, 0);
        
    }

    img.src = 'http://g1.dfcfw.com/g1/201607/20160727150611.png'

    


    //ctx.drawImage(img, canvas.width - right, top, 164, 41);	
}

module.exports = addWatermark;