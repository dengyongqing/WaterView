var animationEasing = require('chart/mobile/bar/bar/animationEasing');
/*事件处理程序*/
function handleEvent(winX, winY) {
    var dpr = this.options.dpr;
    var ctx = this.options.context;
    var cvsX = winX * dpr;
    var cvsY = winY * dpr;

    var paddingTop = this.options.padding.top;
    var paddingLeft = this.options.padding.left;
    var paddingRight = this.options.padding.right;
    var paddingBottom = this.options.padding.bottom;
    var series = this.options.series;
    var unit_w_len = this.options.unit_w_len;
    var unit_w_kind = this.options.unit_w_kind;
    var canvas = this.options.canvas;
    var coordinate = this.options.coordinate;
    var maxY = coordinate.max;
    var minY = coordinate.min;
    var stepHeight = coordinate.stepHeight;
    var sepeNum = this.options.sepeNum;

    var totalHeight = canvas.height - paddingTop - paddingBottom;
    var baseLine = paddingTop + (maxY / stepHeight) * (totalHeight) / sepeNum;
    var index = Math.floor((winX - paddingLeft)/unit_w_len);
    if(!this.options.overDiv){
        var over_div = document.createElement("div");
        over_div.style.width = unit_w_len + "px";
        over_div.style.height = totalHeight + "px";
        over_div.className = "group-bar-mark";
        over_div.style.background = "#000";
        over_div.style.left = index * unit_w_len + paddingLeft + "px";
        over_div.style.top = paddingTop + "px";
        this.container.appendChild(over_div);
        this.options.overDiv = over_div;
    }else{
        this.options.overDiv.style.left = index * unit_w_len + paddingLeft + "px";
    }
}

function toEven(n){
    var num = Math.round(n);
    if(num % 2 === 0){
        return num;
    }else{
        return num + 1;
    }
}

module.exports = handleEvent;
