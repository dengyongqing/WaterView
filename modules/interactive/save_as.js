/**
 * 另存为图片
 */

/**
 * 另存为图片
 * @param  {[type]} canvasobj [canvas对象]
 * @param  {[type]} linkobj   [链接对象]
 * @param  {[type]} imgtitle  [图片标题]
 * @return {[type]}           [description]
 */
function SaveAs(canvasobj, linkobj, imgtitle) {
	var imgdata = canvasobj.toDataURL('image/png');
	if (imgtitle) {
		imgtitle = imgtitle + '.png';
	}
	else{
		imgtitle = '下载.png';
	}

	if ( linkobj.download != undefined ) { //支持链接的download属性
		var newdata = imgdata.replace(/^data:image\/png/,'data:application/octet-stream');
		linkobj.download = imgtitle;
	    linkobj.href = newdata;
	}
	else{ //不支持 新建窗口打开图片
		linkobj.href = 'javascript:;';
		linkobj.onclick = function (){
			var newwindow = window.open('','_blank');
			newwindow.document.write('<img src="' + imgdata + '" title="' + imgtitle + '" />')
		}
	}

}


module.exports = SaveAs;