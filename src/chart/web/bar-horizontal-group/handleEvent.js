// 格式化坐标
var XYF = require('chart/web/common/xyf');
module.exports = function(winX, winY) {
    /*复刻this.options*/
    var dpr = this.options.dpr,
        cvs = this.options.canvas,
        ctx = this.options.context,
        datas = this.options.series,
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
        hoverColor = this.options.hoverColor,
        spaceBetween = 10;

    /*通过在哪个区间，进行交互显示*/
    var cursor = Math.floor((winY * dpr - paddingTop) / unitHeight);
    if (cursor >= 0 && cursor < yaxis.length && (winX > paddingLeft && winX < cvs.width - paddingRight) ) {
        var title = yaxis[cursor].value,
            tipLines = [],
            line = {};
        for(var i = 0, len = datas.length; i < len; i++){
            var prefix = datas[i].prefix === undefined ? "" : datas[i].prefix;
            var suffix = datas[i].suffix === undefined ? "" : datas[i].suffix;
            tipLines.push({
                "text": prefix+datas[i].data[cursor]+suffix ,
                "color": datas[i].color
            });
        }
        if(!this.options.tips){
            var tipMask = document.createElement("div"),
                tipPanel = document.createElement("div");
            this.options.tips = [];
            this.options.tips.push(tipMask);
            this.container.appendChild(tipMask);

            tipMask.className = "horizontal-gmask";
            tipMask.style.width = totalWidth+"px";
            tipMask.style.height = unitHeight + "px";
            tipMask.style.top = (paddingTop + unitHeight*cursor) + "px";
            tipMask.style.left = paddingLeft + "px";
            this.options.tips.push(tipPanel);
            this.container.appendChild(tipPanel);
            tipPanel.className = "horizontal-gpanel";
            //决定tip是显示在mask的上面还是下面
            var tipTitle = document.createElement("div");
            tipTitle.innerHTML = title;
            tipPanel.appendChild(tipTitle);
            for(var j = 0, jLen = tipLines.length; j < jLen; j++){
                var divLine = document.createElement("div");
                divLine.style.paddingTop = "8px";
                divLine.innerHTML = '<i style="display: inline-block;margin-right:5px; height: 10px;width: 10px; border-radius: 5px;background-color:'+
                                    tipLines[j].color+'"></i><span>'+tipLines[j].text+'</span>';
                tipPanel.appendChild(divLine);
            }
            if(paddingTop + unitHeight*(2/3+cursor) + tipPanel.clientHeight < cvs.height - paddingBottom){
                tipPanel.style.top = (paddingTop + unitHeight*(2/3+cursor)) + "px";
            }else{
                tipPanel.style.top = (paddingTop + unitHeight*(1/3+cursor) - tipPanel.clientHeight) + "px";
            }

            if(winX + spaceBetween + tipPanel.clientWidth >  totalWidth - paddingRight){
                tipPanel.style.left = winX-spaceBetween- tipPanel.clientWidth +"px";
            }else{
                tipPanel.style.left = winX+spaceBetween+"px";
            }
        }else{
            var existMask = this.options.tips[0],
                existPanel = this.options.tips[1],
                existLines = existPanel.children,
                existTitle = existLines[0];

            existTitle.innerHTML = title;
            existMask.style.top = (paddingTop + unitHeight*cursor) + "px";
            existMask.style.left = paddingLeft + "px";
            
            for(var k = 0, kLen = existLines.length; k < kLen-1; k++){
                existLines[k+1].children[1].innerHTML = tipLines[k].text;
            }
            existMask.style.display = "block";
            existPanel.style.display = "block";
            if(paddingTop + unitHeight*(2/3+cursor) + existPanel.clientHeight < cvs.height - paddingBottom){
                existPanel.style.top = (paddingTop + unitHeight*(2/3+cursor)) + "px";
            }else{
                existPanel.style.top = (paddingTop + unitHeight*(1/3+cursor) - existPanel.clientHeight) + "px";
            }
            if(winX + spaceBetween + existPanel.clientWidth >  totalWidth - paddingRight){
                existPanel.style.left = winX-spaceBetween- existPanel.clientWidth +"px";
            }else{
                existPanel.style.left = winX+spaceBetween+"px";
            }

        }
    } else {
        if (this.options.tips) {
            this.options.tips[0].style.display = "none";
            this.options.tips[0].style.left = "-10000";

            this.options.tips[1].style.display = "none";
            this.options.tips[1].style.left = "-10000";
        }
    }
}
