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
var fixed = require('common').fixed;


//计算均线
function average(num, data) {
    var result = [];
    var items = [];
    var i = 0;
    var j = 0;
    for (i = 0; i < data.length; i++) {
        items[i] = {};
        items[i].date = transform(data[i].split(',')[0]);
        items[i].value = data[i].split(',')[2];
    }

    for (i = 20; i < items.length; i++) {
        var countValue = 0;
        for (j = 0; j < num; j++) {
            countValue += items[i - j].value/1;
        }
        result[i - 20] = {};
        result[i - 20].date = items[i].date;
        result[i - 20].value = parseFloat((countValue / num).toFixed(pricedigit));
    }

    return result;
}

function dealData(json) {
    var info = json.info;
    var arr = json.data;

    var result = {};
    var max = 0;
    var min = 0;
    var maxVolume = 0;
    var i = 0;
    result.data = [];
    //昨日收盘价
    var yes_clo_price = 0;
    for (i = 20; i < arr.length; i++) {
        var item = arr[i].split(',');
        var rect = {};

        if(i == 20){
            max = min = Number(item[1]);
        }

        //进行最大最小值的计算
        max = (max > parseFloat(item[3])) ? max : parseFloat(item[3]);
        maxVolume = (maxVolume > parseFloat(item[5])) ? maxVolume : parseFloat(item[5]);
        min = (min < parseFloat(item[4])) ? min : parseFloat(item[4]);

        //进行各个柱体的计算
        rect.data_time = transform(item[0]);
        rect.open = item[1];
        rect.close = item[2];
        rect.highest = item[3];
        rect.lowest = item[4];
        rect.percent = ((parseFloat(item[2]) - parseFloat(arr[i - 1].split(',')[2])) / parseFloat(arr[i - 1].split(',')[2]) * 100).toFixed(2);
        rect.volume = item[5];

        // var close = rect.close;
        // var open = rect.open;
       
        // //成交量数据
        // if (close > open) {
        //     var cl = "#ff4b1f";
        // } else if (close == open && close >= open) {
        //     var cl = "#ff4b1f";
        // }else {
        //     var cl = "#00aa11";
        // }

        yes_clo_price = close;
        rect.up = rect.percent >= 0 ? true : false;

        result.data.push(rect);

    }

    //五日均线
    result.five_average = average(5, arr);
    //十日均线
    result.ten_average = average(10, arr);
    //二十日均线
    result.twenty_average = average(20, arr);
    //日期字符串
    
    var len = arr.length;
    result.timeStrs = [];
    result.timeStrs[0] = transform(arr[20].split(',')[0]);
    result.timeStrs[1] = transform(arr[20+Math.floor((len-20)/2)].split(',')[0]);
    result.timeStrs[2] = transform(arr[len-1].split(',')[0]);

    //坐标最大价格
    result.max = parseFloat(coordinate(max, min).max);

    //坐标最小价格
    result.min = parseFloat(coordinate(max, min).min);

    //最大成交量
    result.v_max = Number((maxVolume).toFixed(2));

    return result;
}

module.exports = dealData;
