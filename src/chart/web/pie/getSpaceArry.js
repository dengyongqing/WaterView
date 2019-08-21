var getResult = require('./getResult.js');
var getMinArr = require('./getMinArr.js');

//获取y轴上的指标分布
module.exports = function(arr, resultLen, ySpace, radius, point, yBottom) {
    var leftArr = [];
    var rightArr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        //分左右两边
        if (Math.cos(arr[i].middle) < 0) {
            leftArr.push(arr[i]);
        } else {
            rightArr.push(arr[i]);
        }
    }
    //对于左边，
    if (leftArr.length > resultLen) {
        //y轴上的实际饼状分割数大于总的容纳分割数，部分数据不显示（最小的几块儿）
        var minLenLeft = leftArr.length - resultLen;
        var minArrLeft = getMinArr(leftArr, minLenLeft);
        for (i = 0; i < minLenLeft; i++) {
            leftArr[minArrLeft[i]].showInfo = false;
        }
    }
    //进行赋yIndex
    getResult(leftArr, resultLen, ySpace, radius, point, yBottom);

    //对于右边，
    if (rightArr.length > resultLen) {
        //y轴上的实际饼状分割数大于总的容纳分割数，部分数据不显示（最小的几块儿）
        var minLenRight = rightArr.length - resultLen;
        var minArrRight = getMinArr(rightArr, minLenRight);
        for (i = 0; i < minLenRight; i++) {
            rightArr[minArrRight[i]].showInfo = false;
        }
    }
    //进行赋yIndex
    getResult(rightArr, resultLen, ySpace, radius, point, yBottom);

    //数据合并
    return leftArr.concat(rightArr);
}
