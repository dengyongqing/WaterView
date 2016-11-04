//一个计算数组arr中，minArrLen个最小值的方法
module.exports = function (arr, minArrLen) {
    var minArr = [];
    var arrLen = arr.length;
    for (var i = 0; i < minArrLen; i++) {
        minArr[i] = i;
    }
    minArr.sort(function(a, b) {
        return arr[a] - arr[b];
    });
    for (i = minArrLen - 1; i < arrLen; i++) {
        //进行比较(每次替换最大的)
        for (var j = 0; j < minArrLen; j++) {
            if (arr[i] < arr[minArr[j]]) {
                minArr[j] = i;
                minArr.sort(function(a, b) {
                    return arr[b] - arr[a];
                });
                break;
            }
        }
    }
    return minArr;
}
