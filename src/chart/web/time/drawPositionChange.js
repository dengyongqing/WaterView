var typeToImgMap = require('chart/web/time/typeToImg');
var common = require('chart/web/common/common');

// 对获取到的盘口异动数据进行处理
function drawPositionChange(data) {
    var _that = this;
    //分时数据
    var timeData_arr = _that.options.data.data;
    var timeIndex = timeData_arr.length-1;
    for (var i = 0; i <= data.length-1; i++) {
        var item = data[i].split(",");
        //异动的相关信息
        var positionChangeItem = {
            changeTime: item[1],
            changeName: item[2],
            changeType: item[3],
            changeInfo: item[4],
            isProfit: item[5]
        };

        var changeTime = item[1];
        var changeImg = typeToImgMap(item[3]);
        var changeIconHeight = _that.options.canvas_offset_top + _that.options.c_1_height - 40;

        for (; timeIndex >= 0; timeIndex--) {
            //如果检测到该时间点上有盘口异动，就绘制盘口异动图标
            if (changeTime == _that.options.data.data[timeIndex].time) {
                var currentPrice = _that.options.data.data[timeIndex].price;
                var isUp = _that.options.data.data[timeIndex].up;
                var percent = _that.options.data.data[timeIndex].percent;
                drawIcon(_that.container, common.get_x.call(_that, timeIndex + 1),
                        changeIconHeight, changeImg, positionChangeItem, currentPrice, isUp, percent) //绘制盘口异动
                break;
            }
        }
    }

}

//在给定的点上，绘制盘口动态的图标,和对应的提示html
function drawIcon(container, x, y, imgUrl, info, currentPrice, isUp, persent) {

    var img = document.createElement("img");
    img.onload = function() {
        img.style.left = x - img.clientWidth / 2 + "px";
    }
    img.setAttribute("src", imgUrl);
    img.style.position = "absolute";
    img.style.top = "100px";
    container.appendChild(img);
    img.style.top = y + "px";

    var timeChangePositionPad = document.createElement("div");
    var changeType = info.changeType;
    var changeTime = info.changeTime;
    var changeNum = info.changeInfo;
    var persentStr = (isUp ? persent : '-' + persent) + "%";
    var priceColor = isUp ? "red" : "green";
    container.appendChild(timeChangePositionPad);

    common.addEvent(img, 'mouseover', function(e) {
        // console.log("hehe");
        timeChangePositionPad.className = "timeChangeMainPad";
        var isIE8 = (!+'\v1' ? 'style="display: none"' : "");

        timeChangePositionPad.innerHTML = '<div class="timeChangeTriangle" '+isIE8+' ></div>' +
            '<table class="timeChangeTable"><caption class="timeChangeHeader">' + changeType + '</caption>' +
            '<tr><td>时:<span>' + changeTime + '</span></td>' +
            '<td>量:<span>' + changeNum + '</span></td></tr>' +
            '<tr><td>价:<span style=" color: ' + priceColor + '">' + currentPrice + '</span></td>' +
            '<td>涨:<span style=" color: ' + priceColor + '">' + persentStr + '</span></td></tr></table>';
        
        timeChangePositionPad.style.display = "block";
        timeChangePositionPad.style.left = x - timeChangePositionPad.clientWidth/2+ 5 + "px";
        timeChangePositionPad.style.top = y + 50 + "px";
    });

    common.addEvent(img, 'mouseout', function(e) {
        timeChangePositionPad.style.display = "none";
    });
}

module.exports = drawPositionChange;
