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
function dealData(json, isCR, type) {
    var yc = json.info.yc;
    var result = {};
    result.v_max = 0;

    result.yc = json.info.yc;
    result.pricedigit = (json.info.pricedigit).split('.')[1].length;
    result.currentPrice = json.info.c;
    result.high = json.info.h;
    result.low = json.info.l;
    result.code = json.code;
    result.timeStrs = [];
    result.data = [];
    result.total = json.info.total%242 == 0 ? json.info.total : Math.floor(json.info.total/242+1)*242;
    var timeStrs = [];
    if(isCR){
        result.total = result.total*1 + 15;
        timeStrs.push("09:15");
    }
    //横坐标的时间列表
    
    var ticks = (json.info.ticks).split('|');
    if (ticks.length === 7) {
        //早上开始时间
        var AM_start = ticks[3];
        timeStrs.push(toFormDateTime(AM_start));
        var AM_middle = Math.floor((ticks[3] * 1.0 + ticks[4] * 1.0) / 2);
        timeStrs.push(toFormDateTime(AM_middle));
        var AM_end = ticks[4];
        var PM_start = ticks[5];
        timeStrs.push(toFormDateTime(AM_end) + "/" + toFormDateTime(PM_start));
        var PM_middle = Math.floor((ticks[5] * 1.0 + ticks[6] * 1) / 2);
        timeStrs.push(toFormDateTime(PM_middle));
        var PM_end = ticks[6];
        timeStrs.push(toFormDateTime(PM_end));
    }

    var dateStrs = [];
    //计算每个数据点
    for (var i = 0, item; item = json.data[i]; i++) {
        var point = {};
        var dataItem = item.split(",");
        //成交量的最大值
        result.v_max = Math.max(dataItem[2]*1.0, result.v_max); 

        //涨跌百分比
        point.up = (dataItem[1] - yc) > 0 ? true : false;
        point.percent = (Math.abs(dataItem[1] - yc) / yc * 100).toFixed(2);

        //每个点的时间（小时：分钟），价格，均价
        point.time = dataItem[0].split(" ")[1];
        point.dateTime = dataItem[0].split(" ")[0];
        point.price = dataItem[1];
        point.avg_cost = dataItem[3];
        point.volume = dataItem[2]*1.0;
        result.high = Math.max(result.high, point.price);
        result.low = Math.min(result.low, point.price);
        if(point.dateTime != dateStrs[dateStrs.length-1]){
            dateStrs.push(point.dateTime);
        }
        result.data.push(point);
    }

    //判断不同的请求种类，返回不同的时间数组
    if(type == 'r'){
        result.timeStrs = timeStrs;
    }else{
        result.timeStrs = dateStrs;
    }

    //坐标的最大最小值
    result.max = coordinate(result.high, result.low, result.yc).max;
    //坐标的最小值
    result.min = coordinate(result.high, result.low, result.yc).min;


    return result;
}

var toFormDateTime = function(ticks) {
    return fix(Math.floor(ticks / 3600), 2) + ":" + fix(Math.floor((ticks / 60) % 60), 2);
}

module.exports = dealData;
