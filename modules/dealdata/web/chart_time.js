/**
 * web分时的数据处理
 */
var coordinate = require('../../dealdata/time_coordinate_range'); //处理数据
var fix = require('common').fixed;
/**
 * 对分时图做的数据处理方便调用
 * @param  {[type]} json [description]
 * @return {[type]}      [description]
 */
function dealData(json, isCR, type, code) {
    var yc = json.info.yc;
    var result = {};
    result.v_max = 0;
    result.yc = json.info.yc;
    result.pricedigit = (json.info.pricedigit).split('.')[1].length;
    result.currentPrice = json.info.c;
    result.high = json.info.h === "-" ? json.info.yc : json.info.h;
    result.low = json.info.l === "-" ? json.info.yc : json.info.l;
    result.code = json.code;
    result.timeStrs = [];
    result.data = [];
    var timeStrs = [];

    //横坐标的时间列表
    var ticks = (json.info.ticks).split('|');
    if (ticks.length === 7) {
        //早上开始时间
        var AM_start = ticks[3] / 60;
        var AM_end = ticks[4] / 60;
        var PM_start = ticks[5] / 60;
        var PM_end = ticks[6] / 60;

        var AMnum = AM_end - AM_start;
        var PMnum = PM_end - PM_start;
        var totalTicks = AMnum + PMnum;
        var group = totalTicks + 2;
        if (isCR && group == 242) {
            timeStrs.push("09:15");
        }
        // debugger;
        for (var i = 0; i < 5; i++) {
            var currentTimeTick = AM_start + totalTicks / 4 * i;
            if (currentTimeTick > AM_end) {
                currentTimeTick = PM_start + (totalTicks / 4 * i - AMnum);
            }

            if (currentTimeTick == AM_end) {
                timeStrs.push(toFormDateTime(AM_end) + "/" + toFormDateTime(PM_start));
            } else {
                timeStrs.push(toFormDateTime(currentTimeTick));
            }
        }

    } else if (ticks.length === 5) {
        var start = ticks[3] / 60;
        var end = ticks[4] / 60;
        var totalTicks = end - start;
        var beforeQuater = start + totalTicks / 4;
        var middle = (start + end) / 2;
        var afterQuater = start + totalTicks * 3 / 4;
        var group = totalTicks + 2;
        if (isCR && group == 242) {
            timeStrs.push("09:15");
        }
        timeStrs.push(toFormDateTime(start));
        timeStrs.push(toFormDateTime(beforeQuater));
        timeStrs.push(toFormDateTime(middle));
        timeStrs.push(toFormDateTime(afterQuater));
        timeStrs.push(toFormDateTime(end));
    }


    //此处返回的为总共应该有多少数据
    result.total = json.info.total % group == 0 ? json.info.total : Math.floor(json.info.total / group + 1) * group;
    if (isCR && group == 242) {
            result.total += 15
    }
    var dateStrs = [];
    //计算每个数据点
    for (var i = 0, item; item = json.data[i]; i++) {
        var point = {};
        var dataItem = item.split(",");
        //成交量的最大值
        result.v_max = Math.max(dataItem[2] * 1.0, result.v_max);

        //涨跌百分比
        point.up = (dataItem[1] - yc) > 0 ? true : false;
        point.percent = (Math.abs(dataItem[1] - yc) / yc * 100).toFixed(2);

        //每个点的时间（小时：分钟），价格，均价
        point.time = dataItem[0].split(" ")[1];
        point.dateTime = dataItem[0].split(" ")[0];
        point.price = dataItem[1];
        point.avg_cost = (dataItem[3] * 1.0).toFixed(result.pricedigit);
        point.volume = dataItem[2] * 1.0;
        result.high = Math.max(result.high, point.price, point.avg_cost);
        result.low = Math.min(result.low, point.price, point.avg_cost);
        if (point.dateTime != dateStrs[dateStrs.length - 1]) {
            dateStrs.push(point.dateTime);
        }
        result.data.push(point);
    }

    //判断不同的请求种类，返回不同的时间数组
    if (type == 'r') {
        result.timeStrs = timeStrs;
    } else {
        result.timeStrs = dateStrs;
    }

    //坐标的最大最小值
    result.max = coordinate(result.high, result.low, result.yc).max;
    //坐标的最小值
    result.min = coordinate(result.high, result.low, result.yc).min;


    return result;
}

var toFormDateTime = function(ticks) {
    return fix(Math.floor(ticks / 60) % 24, 2) + ":" + fix(Math.floor((ticks) % 60), 2);
}

module.exports = dealData;
