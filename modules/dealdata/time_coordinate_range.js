/**
 * 分时图坐标上下限算法
 */

/*
1.遍历出当前价的最高(high),最低点(low)
2.和昨收(pre)价进行比较
	Math.Abs(pre-high)   
	Math.Abs(pre-low)  
		取两个中比较大的值 设为offset
			top=pre+offset*1.05;
			fall=pre-offset*1.05;
	
	同时满足如果fall<=0则为fall=0
	如果high==low==pre则
		top=pre*1.08
		fall=pre*0.92

	如果pre==0 则top==fall==0
 */

/**
 * 分时图坐标上下限
 * @param  {[type]} high 最高
 * @param  {[type]} low 最低
 * @param  {[type]} pre  昨收
 */
function coordinate(high, low, pre) {
	var top = 0;
	var fall = 0;
	var offset = Math.max(Math.abs(pre - high), Math.abs(pre - low));

	top = Number(pre) + offset * 1.05;
	fall = Number(pre) - offset * 1.05;
	if ( fall <= 0 ) {
		fall = 0;
	}
	if ( high == low && low == pre ) {
		top = pre * 1.08;
		fall = pre * 0.92;
	}
	if ( pre == 0 ) {
		top = 0;
		fall = 0;
	}

	return { max: top, min: fall };
}

module.exports = coordinate;