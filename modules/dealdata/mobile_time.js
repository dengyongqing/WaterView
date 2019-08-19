/**
 * 处理数据 分时图
 */

var time_coordinate_range = require('./time_coordinate_range');

function deal(data) {

	//分时图标准数据格式
	var result = {
		max: 0, //最大值
		min: 0, //最小值
		coordinate_max : 0, // 坐标上限
		coordinate_min : 0, // 坐标下限
		pricelist: [], //数据
		zs: 0, //昨收
		name: '', //名称
		code: '', //代码
		time: '' //时间
	};

	result.zs = parseFloat(data.info.yc);
	result.name = data.name;
	result.code = data.code;
	result.time = data.info.time;

	var item;
	var array = data.data;
	for (var i = 0; i < array.length; i++) {
		item = array[i].split(',');
		item[1] = parseFloat(item[1]);
		result.pricelist.push({time: item[0], price: item[1], cprice: item[1] * 100 });

		if ( i == 0 ) {
			result.max = item[1];
			result.min = item[1];
		}
		else{
			if ( item[1] > result.max ) {
				result.max = item[1];
			}
			if( item[1] < result.min ){
				result.min = item[1];
			}
		}		
	}

	var coordinate_range = time_coordinate_range(result.max, result.min, result.zs);
	result.coordinate_max = coordinate_range.max;
	result.coordinate_min = coordinate_range.min;
	return result;
}

module.exports = deal;