/**
 * web的k线图的数据处理
 * json为根据id和type获得的k线数据
 */

function dealData(json, percent, extendType){

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
	for(var i = 0; i < askLength; i++){
		//分割data中的字符串
		var items = datas[result.total - i - 1].split(/\[|\]/);
		var itemBase = datas[result.total - i - 1].split(/\[|\]/)[0].split(",");

		//得到每个时间点的数据
		var rect = {};
		rect.date_time = itemBase[0];
		rect.height = itemBase[3];
		rect.low = itemBase[4];
		rect.open = itemBase[1];
		rect.close = itemBase[2];
		rect.volume = itemBase[5];
		rect.percent = (Math.abs(rect.close*1.0 - rect.open*1.0)/rect.open*1.0).toFixed(2);
		rect.up = (rect.close*1.0 - rect.open*1.0) > 0 ? true : false;
		//当extend分别为MA, EXPMA, SAR, BOLL, BBI时对应的数据(除了ma，其他都有差错)
		switch(extendType.toLowerCase()){
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
				intoArr.call(result, "bollmb", bolls[0],rect.date_time); 
				intoArr.call(result, "bollup", bolls[1], rect.date_time); 
				intoArr.call(result, "bolldn", bolls[2], rect.date_time); 
				break;
			case "ma": 
				var mas = items[1].split(",");
				intoArr.call(result, "five_average", mas[0], rect.date_time);  
				intoArr.call(result, "ten_average", mas[1], rect.date_time); 
				intoArr.call(result, "twenty_average", mas[2], rect.date_time); 
				intoArr.call(result, "ma30", mas[3], rect.date_time);  
				break;
			default:
				break;
		}
		result.data.push(rect);

		//获取时间段内的价格最大最小值和成交量的最大值
		result.max = result.max > rect.height ? result.max : rect.height;
		result.min = result.min > rect.low ? rect.low : result.min;
		result.v_max = result.v_max > rect.volume*1.0 ? result.v_max : rect.volume;
	}
	return result;
}

function testData(data){
	return data === "-" ? null : data;
}

function intoArr(name, value, date) {
    if (value === "-") {
        value = null;
    }
    if (this[name] === undefined) {
        this[name] = [{value:value, date:date}];
    } else {
        this[name].push({value:value, date:date});
    }
}

module.exports = dealData;