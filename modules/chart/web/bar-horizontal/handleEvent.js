// 格式化坐标
var XYF = require('chart/web/common/xyf');
module.exports = function(winX, winY) {
    /*复刻this.options*/
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

    /*通过在哪个区间，进行交互显示*/
    var cursor = Math.floor((winY * dpr - paddingTop) / unitHeight);
    if (cursor >= 0 && cursor < datas.length) {
        /*需要显示的内容*/
        var prefix = this.options.series.prefix === undefined ? "" : this.options.series.prefix,
            suffix = this.options.series.suffix === undefined ? "" : this.options.series.suffix,
            title = yaxis[cursor].value,
            value = prefix + datas[cursor] + suffix;
        /*悬浮的颜色变换*/
        if (this.options.preCursor === undefined) {
            this.options.preCursor = cursor;
            hover(cursor, cursor);
        } else {
            var pre = this.options.preCursor;
            this.options.preCursor = cursor;

            hover(pre, cursor);
        }
        if (!this.options.tips) {
            var pad = document.createElement("div");
            var el_title = document.createElement("div");
            el_title.innerHTML = title;
            var el_value = document.createElement("div");
            var value_point = document.createElement("span");
            var value_text = document.createElement("span");
            value_text.innerHTML = value;

            el_value.appendChild(value_point);
            el_value.appendChild(value_text)
            pad.appendChild(el_title);
            pad.appendChild(el_value);
            this.container.appendChild(pad);

            this.options.tips = pad;
            /*样式*/
            pad.style.position = "absolute";
            pad.style.font = "12px/150% Simsun,arial,sans-serif";
            pad.style.padding = "5px";
            pad.style.backgroundColor = "#000";
            pad.style.color = "#fff";
            pad.style.borderRadius = "5px";
            pad.style.opacity = "0.7";
            pad.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=70)";

            value_point.style.display = "inline-block";
            value_point.style.width = "6px";
            value_point.style.height = "6px";
            if (yaxis[cursor].hoverColor !== undefined) {
                value_point.style.backgroundColor = yaxis[cursor].hoverColor;
            } else {
                value_point.style.backgroundColor = hoverColor;
            }
            value_point.style.borderRadius = "50%";
            value_point.style.marginRight = "5px";

            value_text.style.display = "inline-block";

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
            /*先显示，才能计算div宽高*/
            if (winX * dpr <= paddingLeft || winX * dpr >= paddingLeft + totalWidth) {
                this.options.tips.style.display = "none";
                this.options.tips.style.left = "-10000";
                hover(cursor);
            } else {
                el_pad.style.display = "block";
            }

            el_pad.children[0].innerHTML = title;
            el_pad.children[1].children[1].innerHTML = value;
            if (yaxis[cursor].hoverColor !== undefined) {
                el_pad.children[1].children[0].style.backgroundColor = yaxis[cursor].hoverColor;
            } else {
                el_pad.children[1].children[0].style.backgroundColor = hoverColor;
            }
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

        }
    } else {
        if (this.options.tips) {
            this.options.tips.style.display = "none";
            this.options.tips.style.left = "-10000";
            cursor = cursor < 0 ? 0 : datas.length - 1;
            hover(cursor);
        }
    }
    /*柱体悬浮颜色的变化，不传第二个参数，即为消除*/
    function hover(pre, cur) {
        ctx.save();
        /*原来的柱子颜色恢复*/
        ctx.fillStyle = color;
        if (yaxis[pre].color !== undefined) {
            ctx.fillStyle = yaxis[pre].color;
        }
        if (datas[pre] < 0) {
            var barWidth = Math.round(datas[pre] / coordinate.min * (baseLine - paddingLeft));
            ctx.fillRect(baseLine - barWidth, XYF(paddingTop + unitHeight * (pre + 1 / 4)), barWidth, Math.round(unitHeight / 2));
        } else {
            ctx.fillRect(baseLine, XYF(paddingTop + unitHeight * (pre + 1 / 4)), Math.round(datas[pre] / coordinate.max * (totalWidth - (baseLine - paddingLeft))), Math.round(unitHeight / 2));
        }
        /*现在的柱子颜色改变*/
        if (cur !== undefined) {
            ctx.fillStyle = hoverColor;
            if (yaxis[pre].hoverColor !== undefined) {
                ctx.fillStyle = yaxis[pre].hoverColor;
            }
            if (datas[cur] < 0) {
                var barWidth = Math.round(datas[cur] / coordinate.min * (baseLine - paddingLeft));
                ctx.fillRect(baseLine - barWidth, XYF(paddingTop + unitHeight * (cur + 1 / 4)), barWidth, Math.round(unitHeight / 2));
            } else {
                ctx.fillRect(baseLine, XYF(paddingTop + unitHeight * (cur + 1 / 4)), Math.round(datas[cur] / coordinate.max * (totalWidth - (baseLine - paddingLeft))), Math.round(unitHeight / 2));
            }
        }
        ctx.restore();
    }
}
