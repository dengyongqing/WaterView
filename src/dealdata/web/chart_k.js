/**
 * web的k线图的数据处理
 * json为根据id和type获得的k线数据
 */

function dealData(json,  extendType) {

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
    var askLength = json.data.length;
    for (var i = askLength-1; i >= 0; i--) {
        //分割data中的字符串
        var items = datas[result.total - i - 1].split(/\[|\]/);
        var itemBase = datas[result.total - i - 1].split(/\[|\]/)[0].split(",");
        var temp_arr = datas[result.total - i - 1].split(",");
        var temp_arr_length = temp_arr.length;

        var yc;
        if(!datas[result.total - i - 2]){
            yc = itemBase[1];
        }else{
            yc = datas[result.total - i - 2].split(/\[|\]/)[0].split(",")[2]*1.0;
        }

        //得到每个时间点的数据
        var rect = {};
        rect.date_time = itemBase[0];
        rect.highest = itemBase[3];
        rect.lowest = itemBase[4];
        rect.open = itemBase[1];
        rect.close = itemBase[2];
        rect.volume = itemBase[5];
        rect.amplitude = temp_arr[temp_arr_length-1];
        if(itemBase[6]){
            rect.volumeMoney = itemBase[6];
        }else{
            rect.volumeMoney = "--";
        }
        rect.priceChange = (Math.abs(rect.close - yc)).toFixed(2);
        rect.percent = (rect.priceChange/yc*100).toFixed(2);
        rect.up = (rect.close * 1.0 - rect.open * 1.0) > 0 ? true : false;
        var volume_5 = avgDays(datas, result.total - i - 1, 5);
        var volume_10 = avgDays(datas, result.total - i - 1, 10);
        
        intoArr.call(result, "v_ma_5", volume_5, rect.date_time);
        intoArr.call(result, "v_ma_10", volume_10, rect.date_time);
        result.data.push(rect);
        //获取时间段内的价格最大最小值和成交量的最大值
        result.max = getMax([result.max, rect.lowest, rect.highest*1.0, items[1].split(",")[0], items[1].split(",")[1], items[1].split(",")[2], items[1].split(",")[3]]); 
        result.min = getMin([result.min, rect.lowest, rect.highest, items[1].split(",")[0], items[1].split(",")[1], items[1].split(",")[2], items[1].split(",")[3]]);
        result.v_max = result.v_max > rect.volume * 1.0 ? result.v_max : rect.volume;
    }
    return result;
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
    if(i < n){
        return "-";
    }else{
    	for(var j = 0; j < n; j++){
    		result += datas[i-j].split(",")[5]*1.0;
    	}
        result = result/n;
        return result.toFixed(2) ;
    }
    
}
//数组冒泡得到最大值
function getMax(arr){
    var max = 0;
    for(var i = 0; i < arr.length; i++){
        max = max > arr[i]*1.0 ? max : arr[i]*1.0;
    }
    return max;
}
//数组冒泡得到最小值
function getMin(arr){
    var min = 100000;
    for(var i = 0; i < arr.length; i++){
        min = min < arr[i]*1.0 ? min : arr[i]*1.0;
    }
    return min;
}

module.exports = dealData;
