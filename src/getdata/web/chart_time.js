/**
 * web端分时图数据
 *
 *	返回数据：result = {
 *			name:股票名称，
 *			code: 股票编码,
 *			yc: 昨收价,
 *			high: 最高价,
 *			low: 最低价,
 *			v_max: 成交量最大值,
 *			timeStrs: ["09:30","10:30","11:30/13:00","14:00","15:00"] 时间点数组,
 *			data:[	
 *				time(时间), price(价格), up(涨跌), percent(涨跌百分比), avg_cost(均价)
 *			]
 *	}
 * 
 */

var jsonp = require('jsonp');

var dealData = require('../../dealData/web/chart_time');

var fix = require('common').fixed;

/**
 * 获取不同时间段的分时数据（默认当日）
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function getData(options, callback) {
    var url = "http://pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js";
    var callbackStr = "fsData" + (new Date()).getTime().toString().substring(0, 10);
    var urlData = {
        id: options.code,
        TYPE: options.type || 'R',
        js: callbackStr + '((x))',
        'rtntype': 5,
        isCR: options.isCR
    };

    jsonp(url, urlData, callbackStr, function(json) {
        /*区分美股港股*/
        var code = options.code;
        var error;
        if (json) { 
        	error = false;
            var result = dealData(json, urlData.isCR, options.type, code); 
        } else { 
        	error = true; 
        }
        callback(error, result);
    });
}

module.exports = getData;
