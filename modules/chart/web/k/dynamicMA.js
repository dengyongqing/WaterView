/*根据用户指定的ma天数，动态的计算一个均线数组*/
function dm(num){
	var dataArry = this.options.data.data;
	var result = [];
	var count = 0;

	for(var i = 0; i < dataArry.length; i++){
		var item = {};
		if(i < num-1){
			count += dataArry[i].close*1.0;
			item.value = null;
		}else{
			count += dataArry[i].close*1.0;
			item.value = (count/num).toFixed(2);
			count -= dataArry[i-num+1].close;
		}
		item.date = dataArry[i].date_time;

		result.push(item);
	}

	return result;
}

module.exports = dm;