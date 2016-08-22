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
    //如果percent没定义，默认显示60个数据
    var askLength =  json.info.total * 1;
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

        for (var j = 0; j < Tname.length; j++) {
            var item = itemBase[j+1].split(",");
            switch (Tname[j].toLowerCase()) {
                //K线的技术指标
                case "bbi":
                    intoArr.call(result, "bbi", item[0], date);
                    break;
                case "expma":
                    intoArr.call(result, "expma12", item[0], date);
                    intoArr.call(result, "expma50", item[1], date);
                case "sar":
                    intoArr.call(result, "sar", item[0], date);
                    break;
                case "boll":
                    intoArr.call(result, "bollmb", item[0], date);
                    intoArr.call(result, "bollup", item[1], date);
                    intoArr.call(result, "bolldn", item[2], date);
                    break;
                case "ma":
                    intoArr.call(result, "five_average", item[0], date);
                    intoArr.call(result, "ten_average", item[1], date);
                    intoArr.call(result, "twenty_average", item[2], date);
                    intoArr.call(result, "thirty_average", item[3], date);
                    break;
                    //单独的技术指标
                case "rsi":
                    intoArr.call(result, "rsi6", item[0], date);
                    intoArr.call(result, "rsi12", item[1], date);
                    intoArr.call(result, "rsi24", item[2], date);
                    break;
                case "kdj":
                    intoArr.call(result, "k", item[0], date);
                    intoArr.call(result, "d", item[1], date);
                    intoArr.call(result, "j", item[2], date);
                    break;
                case "macd":
                    intoArr.call(result, "diff", item[0], date);
                    intoArr.call(result, "dea", item[1], date);
                    intoArr.call(result, "macd", item[2], date);
                    break;
                case "wr":
                    intoArr.call(result, "wr10", item[0], date);
                    intoArr.call(result, "wr6", item[1], date);
                    break;
                case "dmi":
                    intoArr.call(result, "pdi", item[0], date);
                    intoArr.call(result, "mdi", item[1], date);
                    intoArr.call(result, "adx", item[2], date);
                    intoArr.call(result, "adxr", item[3], date);
                    break;
                case "bias":
                    intoArr.call(result, "bias6", item[0], date);
                    intoArr.call(result, "bias12", item[1], date);
                    intoArr.call(result, "bias24", item[2], date);
                    break;
                case "obv":
                    /*数据不对*/
                    intoArr.call(result, "obv", item[0], date);
                    intoArr.call(result, "maobv", item[1], date);
                    break;
                case "cci":
                    intoArr.call(result, "cci", item[0], date);
                    break;
                case "roc":
                    intoArr.call(result, "roc", item[0], date);
                    intoArr.call(result, "rocma", item[1], date);
                    break;
                default:
                    break;
            }
        }

    }
    return result;
}

function intoArr(name, value, date) {
    if (value === "-") {
        value = null;
    }
    if (this[name] === undefined) {
        this[name] = [{ value: value, date: date }];
    } else {
        this[name].push({ value: value, date: date });
    }
}
module.exports = dealData;
