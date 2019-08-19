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

var dealData = function(json, type, id) {
    /*归属地（美股，港股，内地）*/
    var blongTo = id.charAt(id.length - 1);
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
            dateStrs.push(dateArr[1] + "/" + dateArr[2]);
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

    //一下算出总的时刻数
    var totalTicks = 0;
    var te = [];
    //所有开闭的时间点（成对出现）
    var changeTicks = ticks.slice(3);
    for (i = 0, len = changeTicks.length; i < len; i += 2) {
        var preTicks = totalTicks;
        totalTicks += (changeTicks[i + 1] - changeTicks[i]) / 60;
        if (i !== 0) {
            te.push({ "str": tickToStr(changeTicks[i - 1]) + "/" + tickToStr(changeTicks[i]), "tick": preTicks });
            if (i === len - 2) {
                te.push({ "str": tickToStr(changeTicks[i + 1]), "tick": totalTicks});
            }
        } else {
            te.push({ "str": tickToStr(changeTicks[i]), "tick": 0 });
            if (i === len - 2) {
                te.push({ "str": tickToStr(changeTicks[i + 1]), "tick": totalTicks });
            }
        }

    }
    //获取时间点对应的时间字符串数组 

    if(type === 'r'){
        result.timeStrs = [].concat(te);
    }else{
        result.timeStrs = dateStrs;
        if(type.match(/[0-9]/)[0] < dateStrs.length){
            result.timeStrs = dateStrs.slice(1);
        }
    }
    result.total = totalTicks;
    if(type.match(/[0-9]/)){
        result.total = totalTicks*type.match(/[0-9]/)[0];
    }
    
    result.max = coordinate(max, min, yc).max;
    result.min = coordinate(max, min, yc).min;
    return result;

};

function tickToStr(tick){
    var hour = Math.floor((tick/60)/60);
    var minute = (tick/60)%60;
    return fix(hour%24,2)+":"+fix(minute, 2);
}

module.exports = dealData;
