var webpack = require('webpack');
var path = require('path');

module.exports = {
	//页面入口文件配置
	entry: {
		// './dev/wap_time_chart.js',	//手机分时图
		emchart:'./dev/mobile/emchart.js',
		emchart_mobile_time:'./dev/mobile/emchart_mobile_time.js',
		emchart_mobile_k:'./dev/mobile/emchart_mobile_k.js',
		emchart_mobile_time_k:'./dev/mobile/emchart_mobile_time_k.js'
	},
	output: {
		filename: './bundle/mobile/[name].js'
	},
	
	module: //加载器配置
	{
		loaders: [
			{test: /\.css$/,loader: 'style!css'},
			{test: /\.(jpg|png)$/, loader: "url?limit=81920"}
		]
	},
	devtool: 'source-map',
	resolve: { //解决方案配置
		root: [
		    path.resolve('./modules/')
		  ],
	    alias: { //模块简称
	        extend: 'tools/extend',
	        jsonp: 'tools/jsonp',
	        datetime: 'tools/datetime',
	        fixed:'tools/fixed',
	        date_transform: 'tools/date_transform',
	        common:'tools/common',
	        default_theme: "theme/default"
	    }
	}
};