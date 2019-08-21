// 工具
var common = require('chart/web/common/common')

/*单位转换工具*/
function changeUnit(num, unitName) {
    var afterSwitch = common.format_unit(num, 2);
    if (afterSwitch.charAt(afterSwitch.length - 1) == "万") {
        afterSwitch = parseFloat(afterSwitch) + "(万" + unitName + ")";
    } else if (afterSwitch.charAt(afterSwitch.length - 1) == "亿") {
        afterSwitch = parseFloat(afterSwitch) + "(亿" + unitName + ")";
    } else {
        afterSwitch = parseFloat(afterSwitch) + "(" + unitName + ")";
    }
    return afterSwitch;
}

module.exports = changeUnit;