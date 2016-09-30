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
    var baseLine = paddingTop + (maxY/stepHeight) * (totalHeight)/sepeNum;

    var current = {};
    current.outOrder = Math.floor((cvsX - paddingLeft) / unit_w_len);
    current.innerOrder = Math.floor((((cvsX - paddingLeft) % unit_w_len) - unit_w_kind) / (2 * unit_w_kind));

    var baseLine = paddingTop + (maxY/stepHeight) * (totalHeight)/sepeNum;
    var x, y, height, width, tempHeight, tempCurrent;
    /*没点击到范围内*/
    if (series[current.innerOrder] === undefined) {
        if (this.options.current) {
            tempCurrent = this.options.current;
            ctx.fillStyle = this.options.series[tempCurrent.innerOrder].color;
            tempHeight = totalHeight * (series[tempCurrent.innerOrder].data[tempCurrent.outOrder] / (maxY-minY));
            x = tempCurrent.outOrder * unit_w_len + (tempCurrent.innerOrder * 2 + 1) * unit_w_kind + paddingLeft;
            y = tempHeight > 0 ? (baseLine - tempHeight) : baseLine;
            width = unit_w_kind;
            height = tempHeight;
            ctx.clearRect(x, y, width, height);
            ctx.fillRect(x, y, width, height);
        }
        if (this.options.tipPanel) {
            this.options.tipPanel.style.visibility = "hidden";
        }
        return;
    }
    var rectHeight = totalHeight * (series[current.innerOrder].data[current.outOrder] / (maxY-minY));
    var inRect = false;
    if(rectHeight > 0){
        inRect = !!(cvsY <= baseLine && cvsY >= baseLine - rectHeight);
    }else{
        inRect = !!(cvsY >= baseLine && cvsY <= baseLine - rectHeight);
    }
    if (inRect) {
        /*改变颜色，并且记录*/
        if (this.options.current) {
            tempCurrent = this.options.current;
            ctx.fillStyle = this.options.series[tempCurrent.innerOrder].color;
            tempHeight = totalHeight * (series[tempCurrent.innerOrder].data[tempCurrent.outOrder] / (maxY-minY));
            x = tempCurrent.outOrder * unit_w_len + (tempCurrent.innerOrder * 2 + 1) * unit_w_kind + paddingLeft;
            y = tempHeight > 0 ? (baseLine - tempHeight) : baseLine;
            width = unit_w_kind;
            height = Math.abs(tempHeight);
            ctx.clearRect(x, y, width, height);
            ctx.fillRect(x, y, width, height);
        }
        this.options.current = current;
        ctx.fillStyle = this.options.series[current.innerOrder].hoverColor;
        x = current.outOrder * unit_w_len + (current.innerOrder * 2 + 1) * unit_w_kind + paddingLeft;
        y = rectHeight > 0 ? (baseLine - rectHeight) : baseLine;
        width = unit_w_kind;
        height = Math.abs(rectHeight);
        ctx.clearRect(x, y, width, height);
        ctx.fillRect(x, y, width, height);
        /*tips交互*/
        if (!this.options.tipPanel) {
            var tipPanel = document.createElement("div");

            var h1 = document.createElement("h4");
            var paragraph = document.createElement("p");
            h1.innerHTML = this.options.xaxis.value[current.outOrder];
            paragraph.innerHTML = series[current.innerOrder].data[current.outOrder];
            tipPanel.appendChild(h1);
            tipPanel.appendChild(paragraph);
            this.container.appendChild(tipPanel);
            this.options.tipPanel = tipPanel;

            tipPanel.style.position = "absolute";
            tipPanel.style.mineHeight = "30px";
            tipPanel.style.width = "100px";
            tipPanel.style.opacity = "0.5";
            tipPanel.style.backgroundColor = "#4C4C4C";
            tipPanel.style.borderRadius = "5px";
            tipPanel.style.padding = "10px";
            tipPanel.style.color = "white";
            tipPanel.style.wordWrap = "break-word";
            var top = y / dpr - tipPanel.clientHeight + unit_w_kind / dpr / 2;
            var left = x / dpr + unit_w_kind / dpr / 2;
            /*顶部国界*/
            if (top * dpr < paddingTop) {
                tipPanel.style.top = paddingTop / dpr + 10 + "px";
            } else {
                tipPanel.style.top = y / dpr - tipPanel.clientHeight + unit_w_kind / dpr / 2 + "px";
            }
            /*左边过界*/
            if ((left + tipPanel.clientWidth) * dpr > (canvas.width - paddingRight)) {
                tipPanel.style.left = x / dpr + unit_w_kind / dpr / 2 - tipPanel.clientWidth + "px";
            } else {
                tipPanel.style.left = x / dpr + unit_w_kind / dpr / 2 + "px";
            }
        } else {
            var tipPanel = this.options.tipPanel;
            var top = y / dpr - tipPanel.clientHeight + unit_w_kind / dpr / 2;
            var left = x / dpr + unit_w_kind / dpr / 2;
            tipPanel.children[0].innerHTML = this.options.xaxis.value[current.outOrder];
            tipPanel.children[1].innerHTML = series[current.innerOrder].data[current.outOrder];
            /*顶部过界*/
            if (top * dpr < paddingTop) {
                tipPanel.style.top = paddingTop / dpr + 10 + "px";
            } else {
                tipPanel.style.top = y / dpr - tipPanel.clientHeight + unit_w_kind / dpr / 2 + "px";
            }
            /*左边过界*/
            if ((left + tipPanel.clientWidth) * dpr > (canvas.width - paddingRight)) {
                tipPanel.style.left = x / dpr + unit_w_kind / dpr / 2 - tipPanel.clientWidth + "px";
            } else {
                tipPanel.style.left = x / dpr + unit_w_kind / dpr / 2 + "px";
            }
            this.options.tipPanel.style.visibility = "visible";
        }

    } else {
        if (this.options.current) {
            tempCurrent = this.options.current;
            ctx.fillStyle = this.options.series[tempCurrent.innerOrder].color;
            tempHeight = totalHeight * (series[tempCurrent.innerOrder].data[tempCurrent.outOrder] / (maxY-minY));
            x = tempCurrent.outOrder * unit_w_len + (tempCurrent.innerOrder * 2 + 1) * unit_w_kind + paddingLeft;
            y = tempHeight > 0 ? (baseLine - tempHeight) : baseLine;
            width = unit_w_kind;
            height = Math.abs(tempHeight);
            ctx.clearRect(x, y, width, height);
            ctx.fillRect(x, y, width, height);
        }
        if (this.options.tipPanel) {
            this.options.tipPanel.style.visibility = "hidden";
        }
    }
}



module.exports = handleEvent;