/**
 * web的k线图的数据处理
 * json为根据id和type获得的k线数据
 */

function dealData(json, percent, extendType) {

    var result = {};
    result.data = [];
    result.max = 0;
    result.min = json.info.yc;
    result.v_max = 0;
    result.total = json.info.total;
    result.name = json.name;
    result.code = json.code;
    result.pricedigit = (json.info.pricedigit).split('.')[1].length;

    var datas = json.data;
    //如果percent没定义，默认显示60个数据（需要改进）
    var askLength = 60;

    
    for (var i = askLength-1; i >= 0; i--) {
        //分割data中的字符串
        var items = datas[result.total - i - 1].split(/\[|\]/);
        var itemBase = datas[result.total - i - 1].split(/\[|\]/)[0].split(",");

        //得到每个时间点的数据
        var rect = {};
        rect.date_time = itemBase[0];
        rect.highest = itemBase[3];
        rect.lowest = itemBase[4];
        rect.open = itemBase[1];
        rect.close = itemBase[2];
        rect.volume = itemBase[5];
        rect.percent = (Math.abs(rect.close * 1.0 - rect.open * 1.0) / rect.open * 1.0).toFixed(2);
        rect.up = (rect.close * 1.0 - rect.open * 1.0) > 0 ? true : false;
        var volume_5 = avgDays(datas, result.total - i - 1, 5);
        var volume_10 = avgDays(datas, result.total - i - 1, 10);
        
        intoArr.call(result, "v_ma_5", volume_5, rect.date_time);
        intoArr.call(result, "v_ma_10", volume_10, rect.date_time);
        //当extend分别为MA, EXPMA, SAR, BOLL, BBI时对应的数据(除了ma，其他都有差错)
        switch (extendType.toLowerCase()) {
            case "bbi":
                intoArr.call(result, "bbi", items[1], rect.date_time);
                break;
            case "expma":
                var expmas = items[1].split(",");
                intoArr.call(result, "expma12", expmas[0], rect.date_time);
                intoArr.call(result, "expma50", expmas[1], rect.date_time);
            case "sar":
                intoArr.call(result, "sar", items[1], rect.date_time);
                break;
            case "boll":
                var bolls = items[1].split(",");
                intoArr.call(result, "bollmb", bolls[0], rect.date_time);
                intoArr.call(result, "bollup", bolls[1], rect.date_time);
                intoArr.call(result, "bolldn", bolls[2], rect.date_time);
                break;
            case "ma":
                var mas = items[1].split(",");
                intoArr.call(result, "five_average", mas[0], rect.date_time);
                intoArr.call(result, "ten_average", mas[1], rect.date_time);
                intoArr.call(result, "twenty_average", mas[2], rect.date_time);
                intoArr.call(result, "thirty_average", mas[3], rect.date_time);
                break;
            default:
                break;
        }
        result.data.push(rect);

        //获取时间段内的价格最大最小值和成交量的最大值
        result.max = result.max > rect.highest ? result.max : rect.highest;
        result.min = result.min > rect.lowest ? rect.lowest : result.min;
        result.v_max = result.v_max > rect.volume * 1.0 ? result.v_max : rect.volume;
    }
    return result;
}

function testData(data) {
    return data === "-" ? null : data;
}
//创建一个数组，并且push值
function intoArr(name, value, date) {
    if (value === "-") {
        value = null;
    }
    if (this[name] === undefined) {
        this[name] = [{ value: value, date: date }];
    } else {
        this[name].push({ value: value, date: date });
    }
}
//计算前n天的平均成交量
function avgDays(datas, i, n) {
    var result = 0;
    var len = datas.length;
    if(i < n){
    	result = null;
    }else{
    	for(var j = 0; j < n; j++){
    		result += datas[i-j].split(",")[5]*1.0;
    	}
    	result = result/n;
    }
    return result.toFixed(2);
}

module.exports = dealData;
