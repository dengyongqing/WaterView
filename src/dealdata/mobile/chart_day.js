/**
 * 进行日K各个柱体的计算
 *
 * return {
 *     max,//所有柱体中的最大值
 *     min,//所有柱体中的最小值
 *     fiv_average //五日均线
 *     ten_average //十日均线
 *     twenty_average //二十日均线
 *     timeStrs //三个时间点日期字符串
 *     data[ //所有的柱体
 *          date_time： 日期
 *          open : 开盘价
 *          close: 收市价格
 *          percent: 百分比
 *          highest : 最高
 *          lowest : 最低
 *          volume: 换手数
 *          up:涨跌标志
 *     ]
 * }
 *     
 */

//转换日期（20121112 -> 2012-11-12）
var transform = require('common').transform;
var coordinate = require('../../dealdata/K_coordinate_range');
// var fixed = require('common').fixed;
function dealData(json, num) {
    // var info = json.info;
    var arr = json.data;
    var result = {};
    var max = 0;
    var min = 100000;
    var maxVolume = 0;
    var i = 0;
    result.data = [];
    //昨日收盘价
    var yes_clo_price = json.info.yc;
    var len = arr.length;
    var start = (len - num) > 0 ? (len - num) : 0;
    if(start === 0){
        yes_clo_price = arr[0].split(/\[|\]/)[0].split(",")[2];
    }else{
        yes_clo_price = arr[start-1].split(/\[|\]/)[0].split(",")[2];
    }
    for (i = start; i < len; i++) {
        try {
            var item = arr[i].split(/\[|\]/);
            var itemBase = arr[i].split(/\[|\]/)[0].split(",");
        } catch (e) {

        }

        var rect = {};

        //进行各个柱体的计算
        rect.data_time = itemBase[0];
        rect.open = itemBase[1];
        rect.close = itemBase[2];
        rect.highest = itemBase[3];
        rect.lowest = itemBase[4];

        if (i > 0) {
            rect.percent = ((rect.close * 1.0 - yes_clo_price) * 100/yes_clo_price * 1.0).toFixed(2);
        } else {
            rect.percent = 0;
            max = min = rect.open;
        }
        rect.volume = itemBase[5];

        yes_clo_price = rect.close;
        rect.up = (rect.close * 1.0 - rect.open * 1.0) > 0 ? true : false;

        var mas = item[1].split(",");
        intoArr.call(result, "five_average", mas[0], rect.data_time);
        intoArr.call(result, "ten_average", mas[1], rect.data_time);
        intoArr.call(result, "twenty_average", mas[2], rect.data_time);
        intoArr.call(result, "thirty_average", mas[3], rect.data_time);

        max = Math.max(max,rect.highest);
        min = Math.min(min,rect.lowest);
        maxVolume = maxVolume > rect.volume*1.0 ? maxVolume : rect.volume*1.0;

        result.data.push(rect);

    }


    //日期字符串
    result.timeStrs = [];

    result.timeStrs[0] = transform(arr[start].split(',')[0]);
    result.timeStrs[1] = transform(arr[Math.floor((len + start) / 2)].split(',')[0]);
    result.timeStrs[2] = transform(arr[len - 1].split(',')[0]);

    //坐标最大价格
    result.max = parseFloat(coordinate(max, min).max);

    //坐标最小价格
    result.min = parseFloat(coordinate(max, min).min);

    //最大成交量
    result.v_max = Number((maxVolume).toFixed(2));

    return result;
}

//创建一个数组，并且push值
function intoArr(name, value, date) {
    
    if (this[name] === undefined) {
        this[name] = [{ value: value, date: date }];
    } else {
        this[name].push({ value: value, date: date });
    }
}



module.exports = dealData;
