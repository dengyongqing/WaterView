//进行y轴的分割（给arr添加yIndex）
module.exports = function(arr, resultLen, ySpace, radius, point, yBottom) {
    var arrLen = arr.length;
    //初始化，所有的都还没有被填充
    var overResult = [];
    for (var i = 0; i < resultLen; i++) {
        overResult[i] = 0;
    }
    for (i = 0; i < arrLen; i++) {
        if (arr[i].showInfo) { //如果需要显示触手
            var y = point.y + (radius + radius/10) * Math.sin(arr[i].middle) - yBottom;
            var tempIndex = Math.round(y / ySpace); //得到了调整之前的触手排列位置
            if(Math.sin(arr[i].middle) > 0){
                tempIndex = Math.floor(y / ySpace);
            }else{
                tempIndex = Math.ceil(y / ySpace);
            }
            //判断是否重叠并且进行调整
            if (overResult[tempIndex]) {
                //重叠，两头同时进行搜索，找到的第一个空，插入,跳出循环
                for (var j = 1, endJ = Math.max(tempIndex, (resultLen - tempIndex)); j < endJ; j++) {
                    if (tempIndex + j < resultLen && !overResult[tempIndex + j]) {
                        overResult[tempIndex + j] = 1;
                        break;
                    }

                    if (tempIndex - j < resultLen && !overResult[tempIndex - j]) {
                        overResult[tempIndex - j] = 1;
                        break;
                    }
                }
            } else {
                //未重叠
                overResult[tempIndex] = 1;
            }
        }
    }
    //排序之后才进行计算
    arr.sort(function(a, b) {
        return Math.sin(a.middle) - Math.sin(b.middle);
    });
    j = 0;
    //给每个饼状体加上他们的触角位置
    for (i = 0; i <= resultLen; i++) {
        if (overResult[i]) {
            if (arr[j].showInfo) {
                arr[j++].yIndex = i;
            } else { //一直到找到需要显示触角的饼状为止
                while (arr[j] && !arr[j].showInfo) {
                    j++;
                }
                arr[j++].yIndex = i;
            }
        }
    }
}
