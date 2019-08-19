/**
 * web端 k线图数据获取
 *
 * 返回的数据: result = {
 *			     			name: 名字,
 *			        		code: 编码,
 *			          		total: 总共的数据个数,
 *			          		extend(为 均线， sar等参数线): [{date:2012-11-22, value: 1000}, ....]
 *			          		data:[	
 *			          			{date_time(日期交易), 
 *			          			height(当天最高价), 
 *			          			low(最低价), 
 *			          			open(开盘价), 
 *			          			close(收盘价), 
 *			          			volume(当日成交量), 
 *			          			up(涨跌), 
 *			          			percent(涨跌百分比),
 *			          			(根据传入的extend参数不同会返回（ma, bbi, sar, expmas, bolls等数据）)
 *			          			},
 *			          			.....
 *			          			{}
 *			          		]
 * 						}
 */

var jsonp = require('jsonp');
var dealData = require('../../dealdata/web/chart_k');

/**
 * 根据传入的options获取相应的k线数据
 * @param 	obj   options  {
 *                        		code : 股票id
 *                        		type： 数据类型：K（日K）,WK（周K）,MK（月K），T2（两天分时），
 *                        				T3（三天分时），T4（四天分时），T5（五天分时），m5k（历史五分钟），
 *                        		 		m15k（历史十五分钟），m30k（历史三十分钟），m60k（历史六十分钟）
 *                        		percent：返回数据的长度（[0,1]）,
 *                        		extend: MA, EXPMA, SAR, BOLL, BBI 
 *                        	}
 * @param  {Function} callback 返回得到的数据
 */
function getData(options, callback){
	var url = "http://pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js";
	var callbackStr = "fsData" + (new Date()).getTime().toString();
	if(options.type.toLowerCase() == "dk"){
		options.type = 'k';
	}
	var urlData = {
		id: options.code,
        TYPE: options.type,
        js: callbackStr + '((x))',
        'rtntype': 5,
        'extend' : options.extend || "MA",
        isCR:false
	};/*debugger;*/
	if(options.authorityType !== "" && options.authorityType != "undefined"){
		urlData.authorityType = options.authorityType;
	}
	jsonp(url, urlData, callbackStr, function(json){
		var result = dealData(json, urlData.extend);
		callback(result);
	});
}

module.exports = getData;