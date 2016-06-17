/**
 * [dealData description]
 * @return [
 *         data1:{
 *         		价格：price
 *         		时间:time
 *         		换手数:volume
 *         		涨跌百分比: percent
 *         		涨跌标志:up?
 *              平均成本：avg_cost
 *              成交量最大值：v_max
 *         }]
 * 
 */
var dealData = function(json, yc) {
    // var info = json.info;
    var arryData = json.data;
	var result = [];
    var v_max = 0;
    var max = 0;
    var min = 0;
    var total_cost = 0;//成交总额
    var total_num = 0;//成交总量

    for (var i = 0; i < arryData.length; i++) {
        var items = arryData[i].split(",");
        v_max = v_max > Number(items[2])? v_max: Number(items[2]);

        if(i == 0){
            max = min = Number(items[1]);
        }
        
        max = max > Number(items[1])? max: Number(items[1]);
        min = min < Number(items[1])? min: Number(items[1]);

        var point = {};
        point.time = items[0].split(" ")[1];
        point.price = items[1];
      
        point.volume = Number((Number(items[2])).toFixed(0));
        //计算平均成本
        total_num += Number(items[2]);
        total_cost += Number(items[2])*parseFloat(items[1]);
        point.avg_cost = parseFloat((total_cost/total_num).toFixed(2));
        
        if (i != 0) {
            // point.percent = ((items[1] - arryData[i - 1].split(',')[1]) / items[1] * 100).toFixed(2);
            point.percent = ((items[1] - yc) / yc * 100).toFixed(2);
            // point.up = items[1] - arryData[i - 1].split(',')[1] > 0 ? true : false;
            point.up = items[1] - yc > 0 ? true : false;
        }else{
        	point.percent = ((items[1] - yc) / yc * 100).toFixed(2);
        	point.up = items[1] - yc > 0 ? true : false;
        }
        result.push(point);
    }
    result.v_max = Number((v_max).toFixed(0));

    return [result, max, min];
};

module.exports = dealData;
