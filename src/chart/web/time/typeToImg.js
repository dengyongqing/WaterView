//一个类型图片的映射
function typeToImgMap(type) {
    var img;
    var baseUrl = "images/";
    switch (type) {
        case "火箭发射":
            img = require("images/icom_08.gif");
            break;
        case "快速下跌":
            img = require("images/icom_11.gif");
            break;
        case "封涨停板":
            img = require("images/icom_41.gif");
            break;
        case "封跌停板":
            img = require("images/icom_43.gif");
            break;
        case "机构买单":
            img = require("images/icom_45.gif");
            break;
        case "机构卖单":
            img = require("images/icom_47.gif");
            break;
        case "快速反弹":
            img = require("images/icom_14.gif");
            break;
        case "高台跳水":
            img = require("images/icom_16.gif");
            break;
        case "大笔买入":
            img = require("images/icom_19.gif");
            break;
        case "大笔卖出":
            img = require("images/icom_21.gif");
            break;
        case "有大买盘":
            img = require("images/icom_23.gif");
            break;
        case "有大卖盘":
            img = require("images/icom_25.gif");
            break;
        case "向上缺口":
            img = require("images/icom_58.gif");
            break;
        case "向下缺口":
            img = require("images/icom_55.gif");
            break;
        case "竞价上涨":
            img = require("images/icom_27.gif");
            break;
        case "竞价下跌":
            img = require("images/icom_29.gif");
            break;
        case "高开5日":
            img = require("images/icom_03.gif");
            break;
        case "低开5日":
            img = require("images/icom_05.gif");
            break;
        case "60日新高":
            img = require("images/icom_32.gif");
            break;
        case "60日新低":
            img = require("images/icom_34.gif");
            break;
        case "打开跌停":
            img = require("images/icom_50.gif");
            break;
        case "打开涨停":
            img = require("images/icom_52.gif");
            break;
        case "大幅上涨":
            img = require("images/icom_36.gif");
            break;
        case "大幅下跌":
            img = require("images/icom_38.gif");
            break;
    }
    return img;
}

module.exports = typeToImgMap;
