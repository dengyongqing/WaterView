/*事件处理程序*/
function handleEvent(winX, winY) {
    var dpr = this.options.dpr;
    var ctx = this.options.context;
    var cvsX = winX * dpr;
    var cvsY = winY * dpr;

    var paddingTop = this.options.padding.top,
        paddingLeft = this.options.padding.left,
        paddingRight = this.options.padding.right,
        paddingBottom = this.options.padding.bottom,
        series = this.options.series,
        unit_w_len = this.options.unit_w_len,
        unit_w_kind = this.options.unit_w_kind,
        canvas = this.options.canvas,
        coordinate = this.options.coordinate,
        maxY = coordinate.max,
        minY = coordinate.min,
        stepHeight = coordinate.stepHeight,
        sepeNum = this.options.sepeNum;

    var totalHeight = canvas.height - paddingTop - paddingBottom;
    var baseLine = paddingTop + (maxY / stepHeight) * (totalHeight) / sepeNum;

    var current = Math.floor((cvsX - paddingLeft) / unit_w_len);
    /*判断是否点击到*/
    var inRect = false;
    /*对应的柱体信息*/
    var rectHeight, rectWidth, rectX, rectY;
    if(current < 0 || current >= series.data.length ){
        inRect = false;
    }else{
        rectHeight = totalHeight * (series.data[current] / (maxY - minY)),
        rectWidth = unit_w_kind,
        rectX = current*unit_w_len + unit_w_kind + paddingLeft,
        rectY = rectHeight > 0 ? (baseLine - rectHeight) : baseLine;
        if(cvsX >= rectX && cvsX <= rectX+rectWidth && cvsY >= rectY && cvsY <= rectY + Math.abs(rectHeight)){
            inRect = true;
        }
    }
    if(inRect){
        /*改变颜色，并且记录*/
        if (this.options.preColume !== undefined) {
            changeRect(this.options.preColume, (series.colors && series.colors[this.options.preColume]) ? series.colors[this.options.preColume] : series.color);
        }
        this.options.preColume = current;
        changeRect(current, (series.hoverColors && series.hoverColors[this.options.preColume]) ? series.hoverColors[this.options.preColume] : series.hoverColor);

        /*tips交互*/
        if (!this.options.tipPanel) {
            var tipPanel = document.createElement("div");

            var h1 = document.createElement("strong");
            var paragraph = document.createElement("div");
            h1.innerHTML = this.options.xaxis[current].value;
            paragraph.innerHTML = (series.name === undefined ? "" : series.name +":")+ 
                                    series.data[current] + (series.suffix === undefined ? "" : series.suffix);
            tipPanel.appendChild(h1);
            tipPanel.appendChild(paragraph);
            this.container.appendChild(tipPanel);
            this.options.tipPanel = tipPanel;

            tipPanel.style.position = "absolute";
            tipPanel.style.mineHeight = "30px";
            tipPanel.style.paddingRight = "10px";
            tipPanel.style.opacity = "0.5";
            tipPanel.style.backgroundColor = "#4C4C4C";
            tipPanel.style.borderRadius = "5px";
            tipPanel.style.padding = "5px";
            tipPanel.style.color = "white";
            h1.style.whiteSpace = "nowrap";
            paragraph.style.margin = "0px";
            var top = (baseLine - rectHeight) / dpr;
            var offSetY = rectHeight > 0 ? (unit_w_kind / dpr / 2 - tipPanel.clientHeight) : -unit_w_kind / dpr / 2;
            var left = rectX / dpr + unit_w_kind / dpr / 2;
            /*顶部过界*/
            if ((top + offSetY) < paddingTop) {
                tipPanel.style.top = paddingTop / dpr + 10 + "px";
            } else if((top + offSetY) > (canvas.height - paddingBottom) ){
                tipPanel.style.top = paddingBottom / dpr - tipPanel.clientHeight - 10 + "px";
            } else {
                tipPanel.style.top = top + offSetY + "px";
            }
            /*左右区分*/
            if ((left) * dpr > (canvas.width - paddingRight)/2) {
                tipPanel.style.left = rectX / dpr + unit_w_kind / dpr / 2 - tipPanel.clientWidth + "px";
            } else {
                tipPanel.style.left = rectX / dpr + unit_w_kind / dpr / 2 + "px";
            }
        } else {
            var tipPanel = this.options.tipPanel;
            var top = (baseLine - rectHeight) / dpr;
            var left = rectX / dpr + unit_w_kind / dpr / 2;
            var targetX, targetY;
            var offSetY = rectHeight > 0 ? (unit_w_kind / dpr / 2 - tipPanel.clientHeight) : -unit_w_kind / dpr / 2;
            tipPanel.children[0].innerHTML = this.options.xaxis[current].value;
            tipPanel.children[1].innerHTML = (series.name === undefined ? "" : series.name +":")+ 
                                    series.data[current] + (series.suffix === undefined ? "" : series.suffix);
            /*顶部过界*/
            if ( (top + offSetY) < paddingTop) {
                targetY = paddingTop / dpr + 10;
            } else if((top + offSetY) > (canvas.height - paddingBottom) ){
                targetY = paddingBottom / dpr - tipPanel.clientHeight - 10;
            }  else {
                targetY = top + offSetY;
            }
            /*左右区分*/
            if ((left) * dpr > (canvas.width - paddingRight)/2) {
                targetX = rectX / dpr + unit_w_kind / dpr / 2 - tipPanel.clientWidth;
            } else {
                targetX = rectX / dpr + unit_w_kind / dpr / 2 ;
            }
            if(this.options.tipPanel.style.visibility === "hidden"){
                tipPanel.style.top = targetY+"px";
                tipPanel.style.left = targetX+"px";
                this.options.tipPanel.style.visibility = "visible";
            }else{
                tipPanel.style.top = targetY+"px";
                tipPanel.style.left = targetX+"px";
            }
        }
    }else{
        if (this.options.preColume !== undefined ) {
            tempCurrent = this.options.preColume;
            changeRect(tempCurrent, (series.colors && series.colors[tempCurrent]) ? series.colors[tempCurrent] : series.color);
        }
        if (this.options.tipPanel) {
            this.options.tipPanel.style.visibility = "hidden";
        }
    }
    function changeRect(i, color) {
        
        var height = totalHeight * (series.data[i] / (maxY - minY));
        var x = i * unit_w_len + unit_w_kind + paddingLeft;
        var y = height > 0 ? (baseLine - height) : baseLine;
        var width = unit_w_kind;
        height = Math.abs(height);
        ctx.fillStyle = "white";
        ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
        ctx.fillStyle = color;
        ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
    }
}

module.exports = handleEvent;
