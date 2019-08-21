/**
 * web 端技术指标图数据
 * 获取的技术指标参数需要根据请求K线的格式来
 */
var dealData = require('../../dealData/web/chart_tecIndex');
var jsonp = require('jsonp');

function getData(options, callback){

	var url = "http://pdfm.eastmoney.com//EM_UBG_PDTI_Fast/api/js";
	var callbackStr = "fsDataTeac"+ options.extend.substring(0, 2) + (new Date()).getTime().toString();
	var urlData = {
		id: options.code,
        TYPE: options.type || "k",
        js: callbackStr + '((x))',
        'rtntype': 5,
        'extend' : options.extend || "RSI|MA",
        isCR :false,
        check:"kte"
	};
	if(options.authorityType != "" && options.authorityType != "undefined"){
		urlData.authorityType = options.authorityType;
	}
	jsonp(url, urlData, callbackStr, function(json){
		var result = dealData(json, urlData.extend);

		callback(result);
	});
}

module.exports = getData;