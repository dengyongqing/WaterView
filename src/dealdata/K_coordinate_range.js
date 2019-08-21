/**
 * 分时图坐标上下限算法
 */

/*
1.遍历出当前价的最高(high),最低点(low)
2.取最高和最低的平均值
3.(最高-平均)/2*1.05 得到偏移
4.最高+偏移得最高， 最低加偏移得最低
 */

/**
 * 分时图坐标上下限
 * @param  {[type]} high 最高
 * @param  {[type]} low 最低
 */
function coordinate(high, low) {
	var top = 0;
	// var fall = 0;
	var offset = (high-low)/2*0.05;

	top = high+offset;
	low = low-offset;

	return { max: top, min: low };
}

module.exports = coordinate;