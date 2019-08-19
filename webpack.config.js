var webpack = require('webpack');
var path = require('path');

module.exports = {
	//页面入口文件配置
	entry: {
		emcharts: ['./modules/tools/es5_shim.js', './modules/excanvas/excanvas.js', './dev/emcharts.js'],
		mobile_emcharts:'./dev/mobile_emcharts.js'
	},
	output: {
		filename: './bundle/[name].js'
	},
	
	module: //加载器配置
	{
		loaders: [
			{test: /\.css$/,loader: 'style!css'},
			{test: /\.(jpg|gif|png|htc)$/, loader: "url?limit=80000"}
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