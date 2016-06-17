/**
 * 获取手机分时图数据
 * 返回数据对象
 *   result{
 *      name://股票名字
 *      data: [//当前各个时间点
 *          {   //一个对象代表一个点
 *              price:价格：45.50
 *              time:时间: 10:00
 *              volume:换手数 12000
 *              percent:涨跌百分比 -8.9%
 *              up:涨跌标志: false(跌)
 *              isCR:false(不包含盘前数据),true(包含盘前数据)
 *          }   
 *      ]
 *      v_max: //最大成交量
 *      max://坐标最大值
 *      min://坐标最小值
 *      yc://昨收
 *   }
 */

var dealdata = require('../../dealdata/mobile/chart_time'); //处理数据
var coordinate = require('../../dealdata/time_coordinate_range'); //处理数据
var fix = require('common').fixed;

var jsonp = require('jsonp');


function getdata(id, callback) {

    var url = 'http://pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js';
    var callbackstring = 'fsdata';
    var urldata = {
        id: id,
        TYPE: 'R',
        js: callbackstring + '((x))',
        'rtntype': 5,
        isCR :false
    };
    jsonp(url, urldata, callbackstring, function(json) {

        if (!json) {
            callback(null);
        } else {
            //拿到股票的数据
            var info = json.info;
            // var dataArray = json.data;
            var ticks = info.ticks.split('|');

            // 保留小数位
            window.pricedigit = info.pricedigit.split(".")[1].length == 0 ? 2 : info.pricedigit.split(".")[1].length;

            var result = {};

            //股票名称
            result.name = json.name;
            //总比数
            result.total = info.total;

            var returnData = dealdata(json, info.yc)
            //股票数据
            result.data = returnData[0];

            //最下面的时间
            result.timeStrs = [];
            var morning_start_hour = Math.floor(ticks[0] / 3600) > 24 ? (Math.floor(ticks[0] / 3600) - 24) : Math.floor(ticks[0] / 3600);

            result.timeStrs.push(fix(morning_start_hour, 2) + ":" + fix((ticks[0] / 60) % 60, 2));

            var morning_end_hour = Math.floor(ticks[4] / 3600) > 24 ? (Math.floor(ticks[4] / 3600) - 24) : Math.floor(ticks[4] / 3600);

            if(ticks.length <= 5){
                result.timeStrs.push("");
            }else{
                var afternoon_start_hour = Math.floor(ticks[5] / 3600) > 24 ? (Math.floor(ticks[5] / 3600) - 24) : Math.floor(ticks[5] / 3600);
                result.timeStrs.push(fix(morning_end_hour, 2) + ":" + fix((ticks[4] / 60) % 60, 2) + " / " + fix(afternoon_start_hour) + ":" + fix((ticks[5] / 60) % 60, 2));
            }
            
            var afternoon_end_hour = Math.floor(ticks[1] / 3600) > 24 ? (Math.floor(ticks[1] / 3600) - 24) : Math.floor(ticks[1] / 3600);
            result.timeStrs.push(fix(afternoon_end_hour, 2) + ":" + fix((ticks[1] / 60) % 60, 2));
            //坐标的最大最小值
            result.max = coordinate(returnData[1], returnData[2], info.yc).max;
            //坐标的最小值
            result.min = coordinate(returnData[1], returnData[2], info.yc).min;
            //昨收
            result.yc = info.yc;

            // 保留小数位
            result.pricedigit = window.pricedigit;

            callback(result);
        }

    });
}

module.exports = getdata;
