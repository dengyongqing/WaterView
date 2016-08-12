/**
 * web端技术指标图相关数据的处理
 * 返回各个指标对应的数据
 */

function dealData(json, percent, extendStr) {

    var result = {};
    result.name = json.name;
    result.code = json.code;
    result.pricedigit = (json.info.pricedigit).split('.')[1].length;

    var datas = json.data;
    //如果percent没定义，默认显示60个数据
    var askLength = !percent ? 60 : Math.floor(json.info.total * percent);
    for (var i = askLength - 1; i >= 0; i--) {
        //分割data中的字符串
        var itemBase = datas[json.info.total - i - 1].split(/\[|\]/)[1].split(",");
        var date = datas[json.info.total - i - 1].split(/\[|\]/)[0].split(",")[0];
        
        switch (extendStr.toLowerCase()) {
            case "rsi":
                intoArr.call(result, "rsi6", itemBase[0], date);
                intoArr.call(result, "rsi12", itemBase[1], date);
                intoArr.call(result, "rsi24", itemBase[2], date);
                break;
            case "kdj":
                intoArr.call(result, "k", itemBase[0], date);
                intoArr.call(result, "d", itemBase[1], date);
                intoArr.call(result, "j", itemBase[2], date);
                break;
            case "macd":
                intoArr.call(result, "diff", itemBase[0], date);
                intoArr.call(result, "dea", itemBase[1], date);
                intoArr.call(result, "macd", itemBase[2], date);
                break;
            case "wr":
                intoArr.call(result, "wr10", itemBase[0], date);
                intoArr.call(result, "wr6", itemBase[1], date);
                break;
            case "dmi":
                intoArr.call(result, "pdi", itemBase[0], date);
                intoArr.call(result, "mdi", itemBase[1], date);
                intoArr.call(result, "adx", itemBase[2], date);
                intoArr.call(result, "adxr", itemBase[3], date);
                break;
            case "bias":
                intoArr.call(result, "bias6", itemBase[0], date);
                intoArr.call(result, "bias12", itemBase[1], date);
                intoArr.call(result, "bias24", itemBase[2], date);
                break;
            case "obv":/*数据不对*/
                intoArr.call(result, "obv", itemBase[0], date);
                intoArr.call(result, "maobv", itemBase[1], date);
                break;
            case "cci":
                intoArr.call(result, "cci", itemBase[0], date);
                break;
            case "roc":
                intoArr.call(result, "roc", itemBase[0], date);
                intoArr.call(result, "rocma", itemBase[1], date);
                break;
            default:
                break;
        }
    }
    return result;
}

function intoArr(name, value, date) {
    if (value === "-") {
        value = null;
    }
    if (this[name] === undefined) {
        this[name] = [{value:value, date:date}];
    } else {
        this[name].push({value:value, date:date});
    }
}
module.exports = dealData;
