// 格式化坐标
var XYF = require('chart/web/common/xyf');
module.exports = function(winX, winY) {
    var dpr = this.options.dpr,
        cvs = this.options.canvas,
        ctx = this.options.context,
        datas = this.options.series.data,
        yaxis = this.options.yaxis;

    var coordinate = this.options.coordinate,
        sepeNum = this.options.sepeNum,
        unitHeight = this.options.unitHeight,
        paddingLeft = this.options.padding.left,
        paddingRight = this.options.padding.right,
        paddingTop = this.options.padding.top,
        paddingBottom = this.options.padding.bottom,
        totalWidth = (cvs.width - paddingLeft - paddingRight),
        baseLine = XYF(paddingLeft + totalWidth / sepeNum * (-coordinate.min / coordinate.stepHeight));

    var color = this.options.color,
        hoverColor = this.options.hoverColor;

    /**/
    var cursor = Math.round((winY * dpr - paddingTop) / unitHeight);
    if (cursor >= 0 && cursor < datas.length) {
        var title = yaxis[cursor].value,
            value = datas[cursor];
        if (!this.options.tips) {
            var pad = document.createElement("div");
            var el_title = document.createElement("div");
            el_title.innerHTML = title;
            var el_value = document.createElement("div");
            el_value.innerHTML = value;

            pad.appendChild(el_title);
            pad.appendChild(el_value);
            this.container.appendChild(pad);

            this.options.tips = pad;

            pad.style.position = "absolute";
            pad.style.padding = "5px";
            pad.style.backgroundColor = "#000";
            pad.style.color = "#fff";
            pad.style.borderRadius = "5px";
            pad.style.opacity = "0.7";
            pad.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=70)";

            //左右和上下的位置变换处理
            if (winX * dpr >= paddingLeft + totalWidth / 2) {
                pad.style.left = (winX - pad.clientWidth - 20) + "px";
            } else {
                pad.style.left = (winX + 20) + "px";
            }
            if (winY * dpr <= paddingTop + pad.clientHeight * dpr) {
                pad.style.top = paddingTop + "px";
            } else {
                pad.style.top = winY - pad.clientHeight + "px";
            }
        } else {
            var el_pad = this.options.tips;
            
            el_pad.children[0].innerHTML = title;
            el_pad.children[1].innerHTML = value;
            //左右和上下的位置变换处理
            if (winX * dpr >= paddingLeft + totalWidth / 2) {
                el_pad.style.left = (winX - el_pad.clientWidth - 20) + "px";
            } else {
                el_pad.style.left = (winX + 20) + "px";
            }
            if (winY * dpr <= paddingTop + el_pad.clientHeight * dpr) {
                el_pad.style.top = paddingTop + "px";
            } else {
                el_pad.style.top = winY - el_pad.clientHeight + "px";
            }

	        if(winX*dpr <= paddingLeft || winX*dpr >= paddingLeft + totalWidth){
	        	this.options.tips.style.display = "none";
	        	this.options.tips.style.left = "-10000";
	        }else{
	        	el_pad.style.display = "block";
	        }
        }
    } else {
        if (this.options.tips) {
        	this.options.tips.style.display = "none";
        	this.options.tips.style.left = "-10000";
        }
    }
}
