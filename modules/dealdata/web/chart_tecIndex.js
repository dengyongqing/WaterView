/**
 * web端技术指标图相关数据的处理
 * 返回各个指标对应的数据
 */

function dealData(json, percent, extendStr) {

    var result = {};
    result.name = json.name;
    result.code = json.code;

    var datas = json.data;
    //如果percent没定义，默认显示60个数据
    var askLength = !percent ? 60 : Math.floor(json.info.total * percent);
    for (var i = askLength - 1; i >= 0; i--) {
        //分割data中的字符串
        var itemBase = datas[json.info.total - i - 1].split(/\[|\]/)[1].split(",");
        switch (extendStr.toLowerCase()) {
            case "rsi":
                intoArr.call(result, "rsi6", itemBase[0]);
                intoArr.call(result, "rsi12", itemBase[1]);
                intoArr.call(result, "rsi24", itemBase[2]);
                break;
            case "kdj":
                intoArr.call(result, "k", itemBase[0]);
                intoArr.call(result, "d", itemBase[1]);
                intoArr.call(result, "j", itemBase[2]);
                break;
            case "macd":
                intoArr.call(result, "diff", itemBase[0]);
                intoArr.call(result, "dea", itemBase[1]);
                intoArr.call(result, "macd", itemBase[2]);
                break;
            case "wr":
                intoArr.call(result, "wr10", itemBase[0]);
                intoArr.call(result, "wr6", itemBase[1]);
                break;
            case "dmi":
                intoArr.call(result, "pdi", itemBase[0]);
                intoArr.call(result, "mdi", itemBase[1]);
                intoArr.call(result, "adx", itemBase[2]);
                intoArr.call(result, "adxr", itemBase[3]);
                break;
            case "bias":
                intoArr.call(result, "bias6", itemBase[0]);
                intoArr.call(result, "bias12", itemBase[1]);
                intoArr.call(result, "bias24", itemBase[2]);
                break;
            case "obv":/*数据不对*/
                intoArr.call(result, "obv", itemBase[0]);
                intoArr.call(result, "maobv", itemBase[1]);
                break;
            case "cci":
                intoArr.call(result, "cci", itemBase[0]);
                break;
            case "roc":
                intoArr.call(result, "roc", itemBase[0]);
                intoArr.call(result, "rocma", itemBase[1]);
                break;
            default:
                break;
        }
    }
    return result;
}

function intoArr(name, data) {
    if (data === "-") {
        data = null;
    }
    if (this[name] === undefined) {
        this[name] = [data];
    } else {
        this[name].push(data);
    }
}

module.exports = dealData;
