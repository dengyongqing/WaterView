var common = require('chart/web/common/common');
/*一个测试*/
var slideBar = function() {
    var _that = this;
    var callback = arguments[0];

    if (arguments.length == 1) {

        //第一次绘制元素
        var data = this.options.data;
        var arr = [];
        var arrYear = [];
        var max = 0;
        var min = 10000;
        var len = data.data.length;
        for (var i = 0; i < data.data.length; i++) {
            arr.push({ date: data.data[i].date_time, value: data.data[i].close });
            if (i == 0 || data.data[i].date_time.substring(0, 4) != data.data[i - 1].date_time.substring(0, 4)) {
                arrYear.push({ year: data.data[i].date_time.substring(0, 4), order: i });
            }
            max = Math.max(max, data.data[i].close);
            min = Math.min(min, data.data[i].close);
        }
        //添加包含的容器div和相应的canvas
        var width = _that.options.drawWidth;
        var height = _that.options.unit_height * 2;
        var container = document.createElement("div");
        container.style.position = "absolute";
        container.style.left = _that.options.padding.left + "px";
        container.style.top = _that.options.c4_y_top + "px";
        _that.container.appendChild(container);

        var cvs = document.createElement("canvas");
        try {
            var ctx = cvs.getContext('2d');
        } catch (error) {
            cvs = window.G_vmlCanvasManager.initElement(cvs);
            var ctx = cvs.getContext('2d');
        }
        container.appendChild(cvs);

        cvs.width = width;
        cvs.height = height;
        cvs.style.width = width + "px";
        cvs.style.height = height + "px";
        cvs.className = "slideBarCVS";

        //绘制背景图
        ctx.strokeStyle = "#59A7FF";
        ctx.beginPath();
        for (i = 0; i < len; i++) {
            if (i == 0) {
                ctx.moveTo(getX(len, i, cvs.width), getY(max, min, arr[i].value, cvs.height));
            } else {
                ctx.lineTo(getX(len, i, cvs.width), getY(max, min, arr[i].value, cvs.height));
            }
        }
        ctx.stroke();

        ctx.lineTo(getX(len, i, cvs.width), getY(max, min, 0, cvs.height));
        ctx.lineTo(getX(len, 0, cvs.width), getY(max, min, 0, cvs.height));
        ctx.lineTo(getX(len, 0, cvs.width), getY(max, min, arr[0].value, cvs.height));
        ctx.fillStyle = "#E4EFFF";
        ctx.fill();

        //写上年标记
        var yearLen = arrYear.length;
        var sapce = 1;
        if (yearLen <= 2) {
            sapce  = 1;
        } else if (yearLen <= 7) {
            sapce = 2;
        } else if (yearLen <= 13) {
            sapce = 3;
        }else if(yearLen <= 17){
            sapce = 4;
        }else{
            sapce = 5;
        }
        for (i = 0; i < yearLen; i += sapce) {
            drawYear(ctx, arrYear[i].order, arrYear[i].year, arr.length, width, height);
        }

        //添加滑动块
        var containerBar = document.createElement("div");
        _that.options.slideBarWrap = containerBar;
        containerBar.setAttribute("id", "slideBarWrap");
        containerBar.style.position = "absolute";
        containerBar.style.height = height + "px";
        containerBar.style.width = (len >= 60 ? 60/ len : 1)  * width + "px";
        containerBar.style.top = "0px";
        containerBar.style.left = _that.options.start / len * width + "px";
        containerBar.className = "containerBar";

        var leftDrag = document.createElement("div");
        leftDrag.style.position = "absolute";
        leftDrag.style.height = height / 2 + "px";
        leftDrag.style.width = "7px";
        leftDrag.style.border = "solid 1px #999";
        leftDrag.style.top = height / 4 + "px";
        leftDrag.style.left = "-4px";
        leftDrag.style.color = "#999";
        leftDrag.className = "leftDrag";
        leftDrag.innerHTML = "|";


        var rightDrag = document.createElement("div");
        rightDrag.style.position = "absolute";
        rightDrag.style.height = height / 2 + "px";
        rightDrag.style.width = "7px";
        rightDrag.style.border = "solid 1px #999";
        rightDrag.style.top = height / 4 + "px";
        rightDrag.style.right = "-4px";
        rightDrag.style.color = "#999";
        rightDrag.className = "rightDrag";
        rightDrag.innerHTML = "|";

        container.appendChild(containerBar);
        containerBar.appendChild(leftDrag);
        containerBar.appendChild(rightDrag);

        //添加滑动块中的事件处理
        dragEvent.call(_that, callback, arr, cvs, containerBar, leftDrag, rightDrag);
    } else {
        var start = _that.options.start;
        var end = _that.options.end;
        var len = this.options.data.data.length;
        var slideBar = _that.options.slideBarWrap;
        var width = _that.options.drawWidth;
        var slideBarLeft = width * start / len + "px";
        var slideBarWidth = width * (end - start) / len + "px";
        slideBar.style.left = slideBarLeft;
        slideBar.style.width = slideBarWidth;
        callback.call(_that, start, end);
    }

}

/*根据数据获取坐标*/
function getX(len, i, width) {
    return i / len * width;
}

/*画年限*/
function drawYear(ctx, order, yearText, len, totalWidth, totalHeight) {
    ctx.save()
    ctx.fillStyle = "#aaa";
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 1;
    ctx.beginPath();

    ctx.moveTo(Math.ceil(getX(len, order, totalWidth)) + 0.5, totalHeight);
    ctx.lineTo(Math.ceil(getX(len, order, totalWidth)) + 0.5, totalHeight / 2);
    ctx.font = "12px";
    ctx.fillText(yearText, Math.ceil(getX(len, order, totalWidth) + 5), totalHeight * 2 / 3);

    ctx.stroke();
    ctx.restore();
}

function getY(max, min, value, height) {
    return height - (value - min) / (max - min) * height;
}

var dragEvent = function(callback, dataArr, container, containerBar, leftDrag, rightDrag) {
    var _this = this;
    //containerBar的位置以及宽度
    var ContainerB_left = toNumber(containerBar.style.left);
    var ContainerB_width = toNumber(containerBar.style.width);
    //左边拖拽条的位置以及宽度
    var LeftD_width = toNumber(leftDrag.style.width);
    var LeftD_left = ContainerB_left - LeftD_width;
    //右边拖拽条的位置以及宽度
    var RightD_left = ContainerB_left + ContainerB_width;
    var body = document.getElementsByTagName("html")[0];
    var len = dataArr.length;
    var width = toNumber(container.style.width);
    var min_width = (len > 20 ? (20 / len) : 1) * width;
    //点击状态
    var clickedLeft = false;
    var clickedRight = false;
    var clickedBar = false;
    //是否点击了点击区
    var inArea = false;

    var offset = 0;
    var pageOffset = getOffset(container);

    common.addEvent(body, "mousedown", function(e) {
        /*检测点击了哪一个元素*/
        var winX = e.clientX - pageOffset.left;

        //判断点击了那个区域
        var target = e.target || e.srcElement;
        // debugger;
        if (target == leftDrag) {
            //点击了左边拖拽
            clickedLeft = true;
            inArea = true;
            offset = ContainerB_left - winX;
        } else if (target == rightDrag) {
            //点击了右边拖拽
            clickedRight = true;
            inArea = true;
            offset = winX - ContainerB_left - ContainerB_width;
        } else if (target == containerBar) {
            //点击了半透明区域
            clickedBar = true;
            inArea = true;
            offset = winX - ContainerB_left;
        }
    });

    common.addEvent(body, "mouseup", function(e) {
        //状态恢复
        clickedLeft = false;
        clickedRight = false;
        clickedBar = false;
        body.style.cursor = "default";
        ContainerB_left = toNumber(containerBar.style.left);
        ContainerB_width = toNumber(containerBar.style.width);
        LeftD_left = ContainerB_left - LeftD_width;
        RightD_left = ContainerB_left + ContainerB_width;
        var start = ContainerB_left / toNumber(container.style.width);
        var end = (ContainerB_left + ContainerB_width) / toNumber(container.style.width);
        if (inArea) {
            inArea = false;
            callback.call(_this, getDuring(dataArr, start, end).start, getDuring(dataArr, start, end).end);
        }

    });

    common.addEvent(body, "mousemove", function(e) {

        var winX = e.clientX - pageOffset.left;

        //判断点击了那个区域
        if (clickedLeft === true) {
            //分别改变left和width
            if ((winX - offset) >= 0) {
                if (ContainerB_width - (winX + offset - ContainerB_left) > min_width) {
                    containerBar.style.left = (winX + offset) + "px";
                    containerBar.style.width = ContainerB_width - (winX + offset - ContainerB_left) + "px";
                }
            } else {
                containerBar.style.left = "0px";
                containerBar.style.width = ContainerB_width + ContainerB_left + "px";
            }

        }

        if (clickedRight === true) {
            //拖动右边
            if ((winX - offset) <= toNumber(container.style.width)) {
                //保证最小宽度
                if (winX - ContainerB_left - offset > min_width) {
                    containerBar.style.width = winX - ContainerB_left - offset + "px";
                }
            } else {
                //当大于外部元素宽度时，直接复制为靠近右边界
                containerBar.style.width = (toNumber(container.style.width) - ContainerB_left) + "px";
            }
        }

        if (clickedBar === true) {
            //移动滑块
            if ((winX - offset) <= 0) {
                containerBar.style.left = "0px";
            } else if ((winX - offset) >= (toNumber(container.style.width) - ContainerB_width)) {
                containerBar.style.left = toNumber(container.style.width) - ContainerB_width + "px";
            } else {
                containerBar.style.left = (winX - offset) + "px";
            }

            ContainerB_left = toNumber(containerBar.style.left);
            ContainerB_width = toNumber(containerBar.style.width);
            LeftD_left = ContainerB_left - LeftD_width;
            RightD_left = ContainerB_left + ContainerB_width;
            var start = ContainerB_left / toNumber(container.style.width);
            var end = (ContainerB_left + ContainerB_width) / toNumber(container.style.width);
            if (inArea) {
                callback.call(_this, getDuring(dataArr, start, end).start, getDuring(dataArr, start, end).end);
            }

        }
        try {
            e.preventDefault();
        } catch (e) {
            e.returnValue = false;
        }
    });

    function toNumber(str) {
        return str.replace("px", "") * 1.0;
    }
};
/*获取e元素相对于整个页面的位置*/
function getOffset(e) {
    var result = {};
    result.top = e.offsetTop;
    result.left = e.offsetLeft;
    var parent = e.offsetParent;
    while (parent) {
        if (parent.nodeName === "BODY") {
            break;
        }
        result.left += parent.offsetLeft;
        result.top += parent.offsetTop;
        parent = parent.offsetParent;

    }
    return result;
}

/*根据比例拿时间段*/
function getDuring(arr, start, end) {
    var result = {};
    var len = (arr.length - 1);
    result.start = Math.floor(len * start);
    result.end = Math.ceil(len * end);
    return result;
}

module.exports = slideBar;
