var getTData = require('getdata/web/chart_k');
var common = require('chart/web/common/common');
/*一个测试*/
var slideBar = function(callback) {
    var _that = this;
    getTData({ 'code': '3000592', 'type': 'k', percent: 1480 }, function(data) {
        var arr = [];
        var max = 0;
        var len = data.data.length;
        for (var i = 0; i < data.data.length; i++) {
            arr.push({ date: data.data[i].date_time, value: data.data[i].close });
            max = Math.max(max, data.data[i].close);
        }
        var width = _that.options.drawWidth;
        var height = 70 * 1.1;
        var container = document.createElement("div");
        container.style.position = "absolute";
        container.style.left = _that.options.padding.left + "px";
        container.style.top = _that.options.c4_y_top + "px";

        var cvs = document.createElement("canvas");
        var ctx = cvs.getContext('2d');
        cvs.style.outline = "solid 1px #E9E9E9";
        ctx.strokeStyle = "#E9E9E9";

        cvs.width = width;
        cvs.height = height;
        cvs.style.width = width + "px";
        cvs.style.height = height + "px";
        cvs.style.backgroundColor = "white";

        ctx.beginPath();
        for (i = 0; i < len; i++) {
            if (i == 0) {
                ctx.moveTo(getX(len, i, cvs.width), getY(max, arr[i].value, cvs.height));
            } else {
                ctx.lineTo(getX(len, i, cvs.width), getY(max, arr[i].value, cvs.height));
            }
        }
        ctx.stroke();
        ctx.lineTo(getX(len, i, cvs.width), getY(max, 0, cvs.height));
        ctx.lineTo(getX(len, 0, cvs.width), getY(max, 0, cvs.height));
        ctx.lineTo(getX(len, 0, cvs.width), getY(max, arr[0].value, cvs.height));
        ctx.fillStyle = "#E9E9E9";
        ctx.fill();

        container.appendChild(cvs);
        var containerBar = document.createElement("div");
        containerBar.style.position = "absolute";
        containerBar.style.backgroundColor = "rgba(108, 182, 229, 0.4)";
        containerBar.style.outline = "solid 1px #35709C";
        containerBar.style.height = height + "px";
        containerBar.style.width = /*options.barWidth + */"40px";
        containerBar.style.top = "0px";
        containerBar.style.left = /*options.barStart + */"200px";

        var leftDrag = document.createElement("div");
        leftDrag.style.position = "absolute";
        leftDrag.style.height = height / 2 + "px";
        leftDrag.style.width = "10px";
        leftDrag.style.backgroundColor = "red";
        leftDrag.style.top = height / 4 + "px";
        leftDrag.style.left = "-10px";



        var rightDrag = document.createElement("div");
        rightDrag.style.position = "absolute";
        rightDrag.style.height = height / 2 + "px";
        rightDrag.style.width = "10px";
        rightDrag.style.backgroundColor = "red";
        rightDrag.style.top = height / 4 + "px";
        rightDrag.style.right = "-10px";

        container.appendChild(containerBar);
        containerBar.appendChild(leftDrag);
        containerBar.appendChild(rightDrag);



        _that.container.appendChild(container);

        dragEvent(arr, cvs, containerBar, leftDrag, rightDrag);
    });

    /*根据数据获取坐标*/
    function getX(len, i, width) {
        return i / len * width;
    }

    function getY(max, y, height) {
        return height - y / max * height + height*0.1;
    }

    var dragEvent = function(dataArr, container, containerBar, leftDrag, rightDrag) {

        //containerBar的位置以及宽度
        var ContainerB_left = toNumber(containerBar.style.left);
        var ContainerB_width = toNumber(containerBar.style.width);
        var ContainerB_height = toNumber(containerBar.style.height);
        //左边拖拽条的位置以及宽度
        var LeftD_width = toNumber(leftDrag.style.width);
        var LeftD_left = ContainerB_left - LeftD_width;
        //右边拖拽条的位置以及宽度
        var RightD_width = toNumber(rightDrag.style.width);
        var RightD_left = ContainerB_left + ContainerB_width;
        var body = document.getElementsByTagName("html")[0];
        //点击状态
        var clickedLeft = false;
        var clickedRight = false;
        var clickedBar = false;
        //是否点击了点击区
        var inArea = false;
        //连击
        var clickContinue = false;
        var timer;

        var offset = 0;
        var pageOffset = getOffset(container);

        common.addEvent(body, "mousedown", function(e) {
            /*检测点击了哪一个元素*/
            var winX, winY;
            //浏览器检测，获取到相对元素的x和y
            if (e.pageX) {
                winX = e.pageX - pageOffset.left;
                winY = e.pageY - pageOffset.top;
            } else if (e.offsetX) {
                winX = e.offsetX - pageOffset.left;
                winY = e.offsetY - pageOffset.top;
            }

            //判断点击了那个区域
            if (winX > LeftD_left && winX < ContainerB_left) {
                //点击了左边拖拽
                clickedLeft = true;
                inArea = true;
                offset = ContainerB_left - winX;
                body.style.cursor = "w-resize"
            } else if (e.target == rightDrag) {
                //点击了右边拖拽
                clickedRight = true;
                inArea = true;
                offset = winX - ContainerB_left - ContainerB_width;
                body.style.cursor = "e-resize"
            } else if (e.target == containerBar) {
                //点击了半透明区域
                clickedBar = true;
                inArea = true;
                offset = winX - ContainerB_left;
                body.style.cursor = "move";
            }
        });

        common.addEvent(body, "mouseup", function(e) {
            //状态恢复
            clickedLeft = false;
            clickedRight = false;
            clickedBar = false;
            console.log("up: " + clickedLeft + " : " + clickedRight + " : " + clickedBar);
            body.style.cursor = "default";
            ContainerB_left = toNumber(containerBar.style.left);
            ContainerB_width = toNumber(containerBar.style.width);
            LeftD_left = ContainerB_left - LeftD_width;
            RightD_left = ContainerB_left + ContainerB_width;
            var start = ContainerB_left / toNumber(container.style.width);
            var end = (ContainerB_left + ContainerB_width) / toNumber(container.style.width);
            if (inArea) {
                console.log(getDuring(dataArr, start, end));
            }
            inArea = false;
        });

        common.addEvent(body, "mousemove", function(e) {
            var winX, winY;
            //浏览器检测，获取到相对元素的x和y
            if (e.pageX) {
                winX = e.pageX - pageOffset.left;
                winY = e.pageY - pageOffset.top;
            } else if (e.offsetX) {
                winX = e.offsetX - pageOffset.left;
                winY = e.offsetY - pageOffset.top;
            }
            //判断点击了那个区域
            if (clickedLeft === true) {
                //分别改变left和width
                if ((winX - offset) >= 0) {
                    if (ContainerB_width - (winX + offset - ContainerB_left) > 20) {
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
                    if (winX - ContainerB_left - offset > 20) {
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
                    console.log(getDuring(dataArr, start, end));
                }
            }

            e.preventDefault();
        });

        common.addEvent(body, "mouseleave", function(e) {
            //当离开页面的时候，状态恢复
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
                console.log(getDuring(dataArr, start, end));
            }
            inArea = false;
        })

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
}

module.exports = slideBar;
