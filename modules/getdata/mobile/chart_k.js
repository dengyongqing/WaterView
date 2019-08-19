/**
 * 获取手机分日K数据
 * 传入option:{code:股票代码, count: 点击加减按钮的参数}
 *     option.count取值对应的情况
 *     0 ： 默认60根
 *     1 ： 点击了一次放大， 显示45根
 *     2 ： 点击了两次放大，显示36根
 *     -1 ： 点击了一次缩小， 显示105根
 *     -2 ： 点击了两次缩小，显示205根
 *
 * 返回result{
 *     max: 坐标最大值
 *     min: 坐标最小值
 *     v_max:最大成交量
 *     rect:[//每天天的情况
 *         {
 *              date_time：2015-11-12//日期
 *              open : 64.50//开盘价 
 *              close:  64.10 //收市价格
 *              percent: 百分比 -8.1
 *              height : 最高 65.4
 *              low : 最低 63.10
 *              volume: 换手数 10200
 *              up: 涨跌标志 true(涨)
 *         }，.....
 *     ]
 *     five_average:[{data:2016-02-11, value:63.41}] //五日均线
 *     ten_average:[{data:2016-02-11, value:63.41}] //十日均线
 *     twenty_average:[{data:2016-02-11, value:63.41}] //二十日均线
 *     
 * }
 */

// var transform = require('common').transform;
var jsonp = require('jsonp');
var dealData = require('../../dealdata/mobile/chart_day');
var fixed = require('common').fixed;


//传入参数取数据
function getdata(option, callback, interactive) {

    var url = 'http://pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js';
    var callbackstring = 'fsdata' + (new Date()).getTime().toString().substring(0, 10);
    var id = option.code || option; //如果只传入了一个参数，就把那个参数当股票代码；如果传入两个，则id代表股票代码
    var type = "k";
    if(option.type.toLowerCase() !== "dk"){
        type = option.type;
    }
    var count = 0 | option.count;
    var num = 60;
    //判断count进行相应的根数变化
    switch(count){
        case 0: num = 60; break;
        case 1: num = 45; break;
        case 2: num = 36; break;
        case -1: num = 105; break;
        case -2: num = 205; break;
    }
    var today = new Date();
    //获取当天的时间，成为 20160426 格式,查询从当天开始，往前的80天的数据
    var today_number_str = today.getFullYear().toString() + fixed((today.getMonth() + 1).toString(), 2) + fixed(today.getDate(), 2);
    var QuerySpan = today_number_str + ','+(num+20);
    if(type.match("M") !== null && type !== 'MK'){
        QuerySpan = today_number_str+fixed(today.getHours(), 2)+fixed(today.getMinutes(), 2) + ','+(num+20);
    }
    var urldata = {
        id: id,
        TYPE: type,
        js: callbackstring + '((x))',
        'rtntype': 5,
        "QueryStyle": "2.2",
        'QuerySpan': QuerySpan,
        'extend':"ma",
        isCR :false
    };
    if(option.authorityType !== "" && option.authorityType){
        urldata.authorityType = option.authorityType;
    }

    jsonp(url, urldata, callbackstring, function(json) {
        try{    
            if (!json) {
                callback(null);
            } else {
                var info = json.info;
                // var data = json.data;

                // 保留小数位
                if(info.pricedigit.split(".").length > 1){
                    window.pricedigit = info.pricedigit.split(".")[1].length == 0 ? 2 : info.pricedigit.split(".")[1].length;
                }else{
                    window.pricedigit = 0;
                }

                //获取数据处理后的结果
                if(info.total < num){
                    var result = dealData(json,info.total);
                }else{
                    var result = dealData(json,num);
                }

                result.name = json.name;
                result.total = info.total;
                result.count = num-20;

                // 保留小数位
                result.pricedigit = window.pricedigit;

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
