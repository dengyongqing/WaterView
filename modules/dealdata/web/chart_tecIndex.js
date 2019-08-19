/**
 * web端技术指标图相关数据的处理
 * 返回各个指标对应的数据
 */

function dealData(json,  extendStr) {

    var result = {};
    result.name = json.name;
    result.code = json.code;
    result.pricedigit = (json.info.pricedigit).split('.')[1].length;

    var datas = json.data;
    var askLength =  json.info.total ;
    for (var i = askLength - 1; i >= 0; i--) {
        //分割data中的字符串
        var strGroup = datas[json.info.total - i - 1].split(/\[|\]/);
        var itemBase = [];
        for(var k = 0; k < strGroup.length; k++){
            if(strGroup[k] !== ","){
                itemBase.push(strGroup[k]);
            }
        }
        //获得的日期
        var date = datas[json.info.total - i - 1].split(/\[|\]/)[0].split(",")[0];
        //技术指标的名字
        var Tname = extendStr.split('|');
        var pricedigit = result.pricedigit;
        for (var j = 0; j < Tname.length; j++) {
            var item = itemBase[j+1].split(",");
            switch (Tname[j].toLowerCase().split(",")[0]) {
                //K线的技术指标
                case "bbi":
                    intoArr.call(result, "bbi", item[0], date, pricedigit);
                    break;
                case "expma":
                    intoArr.call(result, "expma12", item[0], date, pricedigit);
                    intoArr.call(result, "expma50", item[1], date, pricedigit);
                case "sar":
                    intoArr.call(result, "sar", item[0], date, pricedigit);
                    break;
                case "boll":
                    intoArr.call(result, "bollmb", item[0], date, pricedigit);
                    intoArr.call(result, "bollup", item[1], date, pricedigit);
                    intoArr.call(result, "bolldn", item[2], date, pricedigit);
                    break;
                case "cma":
                    intoArr.call(result, "five_average", item[0], date, pricedigit);
                    intoArr.call(result, "ten_average", item[1], date, pricedigit);
                    intoArr.call(result, "twenty_average", item[2], date, pricedigit);
                    intoArr.call(result, "thirty_average", item[3], date, pricedigit);
                    break;
                    //单独的技术指标
                case "rsi":
                    intoArr.call(result, "rsi6", item[0], date, pricedigit);
                    intoArr.call(result, "rsi12", item[1], date, pricedigit);
                    intoArr.call(result, "rsi24", item[2], date, pricedigit);
                    break;
                case "kdj":
                    intoArr.call(result, "k", item[0], date, pricedigit);
                    intoArr.call(result, "d", item[1], date, pricedigit);
                    intoArr.call(result, "j", item[2], date, pricedigit);
                    break;
                case "macd":
                    intoArr.call(result, "diff", item[0], date, pricedigit);
                    intoArr.call(result, "dea", item[1], date, pricedigit);
                    intoArr.call(result, "macd", item[2], date, pricedigit);
                    break;
                case "wr":
                    intoArr.call(result, "wr10", item[0], date, pricedigit);
                    intoArr.call(result, "wr6", item[1], date, pricedigit);
                    break;
                case "dmi":
                    intoArr.call(result, "pdi", item[0], date, pricedigit);
                    intoArr.call(result, "mdi", item[1], date, pricedigit);
                    intoArr.call(result, "adx", item[2], date, pricedigit);
                    intoArr.call(result, "adxr", item[3], date, pricedigit);
                    break;
                case "bias":
                    intoArr.call(result, "bias6", item[0], date, pricedigit);
                    intoArr.call(result, "bias12", item[1], date, pricedigit);
                    intoArr.call(result, "bias24", item[2], date, pricedigit);
                    break;
                case "obv":
                    /*数据不对*/
                    intoArr.call(result, "obv", item[0], date, pricedigit);
                    intoArr.call(result, "maobv", item[1], date, pricedigit);
                    break;
                case "cci":
                    intoArr.call(result, "cci", item[0], date, pricedigit);
                    break;
                case "roc":
                    intoArr.call(result, "roc", item[0], date, pricedigit);
                    intoArr.call(result, "rocma", item[1], date, pricedigit);
                    break;
                default:
                    break;
            }
        }

    }
    return result;
}

function intoArr(name, value, date, pricedigit) {
    if (value === "-") {
        value = null;
    }
    if (this[name] === undefined) {
        this[name] = [{ value: (value*1.0).toFixed(pricedigit), date: date }];
    } else {
        this[name].push({ value: (value*1.0).toFixed(pricedigit), date: date });
    }
}
module.exports = dealData;
