// 指定分割区间个数(num：希望分割为多少个区间, arr：传入的数组);返回步长
function divide(num, arr) {
    var max = arr[0],
        min = 0;
    if(arr.length === 1){
        arr.push(0);
    }
    var len = arr.length;
    var result = {};
    var flag = 1;
    // 找到数组中的最大最小值
    for (var i = len - 1; i >= 0; i--) {
        max = Math.max(max, arr[i]);
        min = Math.min(min, arr[i]);
    }
    if(max <= 0){
        max = Math.abs(min);
        min = Math.abs(max);
        flag = -1;
    }
    // 对最大最小值情况判断，进行不同求值过程
    var stepHeight = getStepLength(num, max, min);
    var base = getBase(stepHeight);
    var intStepHeight = stepHeight * Math.pow(10, Math.abs(base) + 1);
    // 正数的分割个数
    var integerStepNum = Math.floor(max / stepHeight + 1);
    if(flag === 1){
        result.max = moveDot((integerStepNum) * intStepHeight, -Math.abs(base) - 1) * 1.0;
        result.min = -moveDot((num - integerStepNum) * intStepHeight, -Math.abs(base) - 1) * 1.0;
    }else{//如果都是负数，交换最大最小值
        result.min = moveDot((integerStepNum) * intStepHeight, -Math.abs(base) - 1) * 1.0*flag;
        result.max = -moveDot((num - integerStepNum) * intStepHeight, -Math.abs(base) - 1) * 1.0*flag;
    }
    result.stepHeight = stepHeight;
    return result;
}

function moveDot(n, num) {
    var str = (n + "");
    var len = str.length;
    var numberArry = str.split("");
    var dotIndex = str.indexOf(".");
    if (dotIndex === -1) {
        dotIndex = len;
    }
    var needTo = dotIndex + num;
    numberArry.splice(dotIndex, 1);
    if (needTo >= len) {
        for (var i = 0; i <= needTo - len; i++) {
            numberArry.push("0");
        }
    } else if (needTo <= 0) {
        for (var i = 0; i >= needTo; i--) {
            numberArry.unshift("0");
        }
        needTo = 1;
    }

    if (needTo < dotIndex) {
        numberArry.splice(needTo, 0, ".");
    } else {
        numberArry.splice(needTo, 0, ".");
    }

    return numberArry.join("");

}


function getStepLength(num, max, min) {
    var tempNum = num;
    var totalHeight = max;
    if (min < 0 && max > 0) {
        totalHeight = max + Math.abs(min);
        tempNum = num - 1;
    }
    if (totalHeight === 0 && num === 0) {
        return 0;
    }
    var tempStepHeight = totalHeight / tempNum;
    return selfRound(tempStepHeight);
}

// 自定义的舍入规则（对于最大的两位数，第二位大于3进10，小于等于3进5）
function selfRound(n) {
    var base = getBase(n);
    // 找到第一个和第二个非零数字
    var str = n + "";
    if (base < 0) {
        str = n.toFixed(Math.abs(base) + 2);
    }
    var str = str.replace(/\./g, "");
    var first, second;
    first = (str + "").match(/[1-9]/g)[0];
    if (str.indexOf(first + "") + 1 > str.length) {
        second = "0";
    } else {
        second = str.charAt(str.indexOf(first + "") + 1);
    }
    // 进行进位操作
    if (second <= 3) {
        second = "5";
    } else {
        second = 0;
        first = first * 1.0 + 1;
        if (first === 10) {
            first = "1";
            second = "0";
            base += 1;
        }
    }
    return ((first + "" + second) * Math.pow(10, base - 1)).toFixed(Math.abs(base) + 2) * 1;
}


//获取一个数字的数量级，如：20-->2, 1.0002-->1, 0.001 --> -3 
function getBase(max) {
    var arr = (max + "").split(".");
    if (arr[0] == 0 && arr[1]) {
        return -(arr[1].match(/^[0]*/g) + "").length - 1;
    } else {
        return arr[0].length - 1;
    }
}


module.exports = divide;