/**
 * [dealData description]
 * @return [
 *         data1:{
 *              价格：price
 *              时间:time
 *              换手数:volume
 *              涨跌百分比: percent
 *              涨跌标志:up?
 *              平均成本：avg_cost
 *              成交量最大值：v_max
 *         }]
 * 
 */

var coordinate = require('../../dealdata/time_coordinate_range'); //处理数据
var fix = require('common').fixed;

var dealData = function(json, type) {
    var info = json.info;
    var ticks = info.ticks.split('|');
    var yc = info.yc;
    var pricedigit = 0;
    // 保留小数位
    if (info.pricedigit.split(".").length > 1) {
        pricedigit = info.pricedigit.split(".")[1].length == 0 ? 2 : info.pricedigit.split(".")[1].length;
    }
    var max = 0;
    var min = yc;
    var v_max = 0;
    var tempDate = "";
    var dateStrs = [];
    var arryData = json.data;
    var result = {};
    result.name = json.name;
    result.pricedigit = pricedigit;
    result.yc = yc;
    result.data = [];
    result.total = info.total;
    result.timeStrs = [];

    /*时间刻度数组*/

    for (var i = 0; i < arryData.length; i++) {
        var items = arryData[i].split(",");
        if (tempDate !== items[0].split(" ")[0]) {
            var dateArr = items[0].split(" ")[0].split("-");
            tempDate = items[0].split(" ")[0];
            dateStrs.push(dateArr[1]+"/"+dateArr[2]);
        }

        v_max = v_max > Number(items[2]) ? v_max : Number(items[2]);

        if (items[1] >= items[3]) {
            var _max = items[1];
            var _min = items[3];
        } else {
            var _min = items[1];
            var _max = items[3];
        }

        max = Math.max(max, _max);
        min = Math.min(min, _min);

        var point = {};
        point.time = items[0].split(" ")[1];
        point.price = items[1];
        /*涨跌幅和涨跌幅标志*/
        if (i != 0) {
            point.percent = ((items[1] - yc) / yc * 100).toFixed(2);
            point.up = items[1] - yc > 0 ? true : false;
        } else {
            point.percent = ((items[1] - yc) / yc * 100).toFixed(2);
            point.up = items[1] - yc > 0 ? true : false;
        }

        point.volume = Number((Number(items[2])).toFixed(0));
        point.avg_cost = items[3];
        result.data.push(point);
    }

    /*对应不同情况返回时间刻度数组*/
    if (type === "r") {
        var morning_start_hour = Math.floor(ticks[0] / 3600) > 24 ? (Math.floor(ticks[0] / 3600) - 24) : Math.floor(ticks[0] / 3600);

        result.timeStrs.push(fix(morning_start_hour, 2) + ":" + fix((ticks[0] / 60) % 60, 2));

        var morning_end_hour = Math.floor(ticks[4] / 3600) > 24 ? (Math.floor(ticks[4] / 3600) - 24) : Math.floor(ticks[4] / 3600);

        if (ticks.length <= 5) {
            result.timeStrs.push("");
        } else {
            var afternoon_start_hour = Math.floor(ticks[5] / 3600) > 24 ? (Math.floor(ticks[5] / 3600) - 24) : Math.floor(ticks[5] / 3600);
            result.timeStrs.push(fix(morning_end_hour, 2) + ":" + fix((ticks[4] / 60) % 60, 2) + " / " + fix(afternoon_start_hour) + ":" + fix((ticks[5] / 60) % 60, 2));
        }

        var afternoon_end_hour = Math.floor(ticks[1] / 3600) > 24 ? (Math.floor(ticks[1] / 3600) - 24) : Math.floor(ticks[1] / 3600);
        result.timeStrs.push(fix(afternoon_end_hour, 2) + ":" + fix((ticks[1] / 60) % 60, 2));
    }
    
    if (ticks.length === 7) {
        if (dateStrs.length >= 2) {
            result.timeStrs = dateStrs;
        }
    } else {
        if (dateStrs.length > 2) {
            result.timeStrs = dateStrs.slice(1);
        }
    }

    result.max = coordinate(max, min, yc).max;
    result.min = coordinate(max, min, yc).min;
    return result;

};

module.exports = dealData;
