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

var jsonp = require('jsonp');


function getdata(option, callback, interactive) {

    var url = 'http://pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js';
    var callbackstring = 'fsdata';
    var type = option.type.toLowerCase();
    if(type === "t1"){
        type = "r";
    }
    var urldata = {
        id: option.id,
        TYPE: type,
        js: callbackstring + '((x))',
        'rtntype': 5,
        isCR :false
    };
    jsonp(url, urldata, callbackstring, function(json) {
        try{
            if (!json) {
                callback(null);
            } else {
                var result = dealdata(json, type, option.id);
                callback(result);
            }

        }catch(e){
            // 暂无数据
            interactive.showNoData();
            // 隐藏loading效果
            interactive.hideLoading();
        }

    });
}

module.exports = getdata;
