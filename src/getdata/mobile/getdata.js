/**
 * 获取手机分时图数据
 */

function getdata(callback) {
	callback({
		zs: 44.74, //
		cross_max: 45.58, //
		cross_min: 43.9, //
		sum: 300, //
		date:[] //
		data:[
			{
				time:'2016-04-15 21:30',
				price: 44.05,
				cjl: 72300,
				jx: 45.00,
				zd: 1.4,
				zdq: 1
			},
			{
				time:'2016-04-15 21:30',
				price: 46.05,
				cjl: 75300,
				jx: 45.00,
				zd: 1.4,
				zdq: 1
			},
			{
				time:'2016-04-15 21:30',
				price: 47.05,
				cjl: 72300,
				jx: 45.00,
				zd: 1.4,
				zdq: -1
			},
			{
				time:'2016-04-15 21:30',
				price: 48.05,
				cjl: 78300,
				jx: 45.00,
				zd: 1.4,
				zdq: -1
			}
		]		
	});
}

module.exports = getdata;