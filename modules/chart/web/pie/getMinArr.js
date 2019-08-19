//一个计算数组arr中，minArrLen个最小值的方法
module.exports = function (arr, minArrLen) {
    var minArr = [];
    var arrLen = arr.length;
    for (var i = 0; i < minArrLen; i++) {
        minArr[i] = i;
    }
    minArr.sort(function(a, b) {
        return arr[b].value - arr[a].value;
    });
    for (i = minArrLen - 1; i < arrLen; i++) {
        //进行比较(每次替换最大的)
        for (var j = 0; j < minArrLen; j++) {
            if (arr[i].value < arr[minArr[j]].value) {
                minArr[j] = i;
                minArr.sort(function(a, b) {
                    return arr[a].value - arr[b].value;
                });
                break;
            }
        }
    }
    return minArr;
}
