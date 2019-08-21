var jsonp = require('jsonp');
/**
 * 返回盘口异动的数据
 * @param  string   code     股票代码
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function getData(code, callback){
    var url = "http://nuyd.eastmoney.com/EM_UBG_PositionChangesInterface/api/js";
    var callbackStr = "changeData" + (new Date()).getTime().toString().substring(0, 10);
    var urlData = {
        id: code,
        style:  "top",
        js:  callbackStr+'([(x)])',
        ac: "normal",
        check:"itntcd",
        cd : callbackStr
    };

    jsonp(url, urlData, callbackStr, function(json) {
        // debugger;
        var error;  
        if (json) { 
            error = false;
        } else { 
            error = true; 
        }
        callback(error, json);
    });

}

module.exports = getData;