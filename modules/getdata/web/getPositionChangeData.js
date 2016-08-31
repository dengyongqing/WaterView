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
        num: 5,
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

    /*var url = "http://nuyd.eastmoney.com/EM_UBG_PositionChangesInterface/api/js?style=top&num=5&ac=normal&check=itntcd&js=[(x)]&cb=var%20dataChange=&id=6018111";
    var scri = document.createElement("script");

    scri.setAttribute("src", url);

    var htmlE = document.getElementsByTagName('html')[0];

    htmlE.appendChild(scri);

    scri.onload = function(){
        callback(false, dataChange);

    }*/
//http://nuyd.eastmoney.com/EM_UBG_PositionChangesInterface/api/js?id=6018111&style=top&js=changeData1472543155((x))&num=5&ac=normal&check=itntcd&cb=changeData1472543155&changeData1472543155=changeData1472543155

}

module.exports = getData;