/**
 * web的k线图的数据处理
 * json为根据id和type获得的k线数据
 * percen为需要展现出来的数据量（默认显示60个数据， 最少20个）(应该交互时控制)
 */

function dealData(json, percent, extendType){

	var result = {};
	result.data = [];
	/*result.max = 0;
	result.min = json.info.yc;
	result.v_max = 0;*/
	result.total = json.info.total;
	result.name = json.name;
    result.code = json.code;

	var datas = json.data;
	//如果percent没定义，默认显示60个数据
	var askLength = result.total;
	var start = new Date();
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
				rect.bbi = testData(items[1]);
				break; 
			case "expma":
				var expmas = items[1].split(",");
				rect.expma12 = testData(expmas[0]);
				rect.expma50 = testData(expmas[1]); 
				break;
			case "sar":
				rect.sar = items[1];
				break;
			case "boll":
				var bolls = items[1].split(",");
				rect.bollmb = testData(bolls[0]);
				rect.bollup = testData(bolls[1]);
				rect.bolldn = testData(bolls[2]);
				break;
			case "ma": 
				var mas = items[1].split(",");
				rect.ma5 = testData(mas[0]); 
				rect.ma10 = testData(mas[1]);
				rect.ma20 = testData(mas[2]);
				rect.ma30 = testData(mas[3]);
				break;
			default:
				break;
		}
		result.data.push(rect);

		//获取时间段内的价格最大最小值和成交量的最大值
		/*result.max = result.max > rect.height ? result.max : rect.height;
		result.min = result.min > rect.low ? rect.low : result.min;
		result.v_max = result.v_max > rect.volume*1.0 ? result.v_max : rect.volume;*/
	}
	console.log(new Date() - start);
	return result;
}

function testData(data){
	return data === "-" ? null : data;
}

module.exports = dealData;