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
	},

	// devServer: {
    //     contentBase: path.join(__dirname, "sample"), //静态文件根目录
    //     port: 3824, // 端口
    //     host: 'localhost',
    //     overlay: true,
    //     compress: false // 服务器返回浏览器的时候是否启动gzip压缩
    // },
    // watch: true, // 开启监听文件更改，自动刷新
    // watchOptions: {
    //     ignored: /node_modules/, //忽略不用监听变更的目录
    //     aggregateTimeout: 500, //防止重复保存频繁重新编译,500毫米内重复保存不打包
    //     poll:1000 //每秒询问的文件变更的次数
	// },


	// entry: {
    //     emcharts: ['./modules/tools/es5_shim.js', './modules/excanvas/excanvas.js', './dev/emcharts.js'],
	// 	mobile_emcharts:'./dev/mobile_emcharts.js'
    // },
    // output:{
	// 	filename: './bundle/[name].js'
    // },
    // resolve:{
    //     extensions: [".js",".css",".json"],
    //     alias: { //模块简称
	// 		extend: 'tools/extend',
	// 		jsonp: 'tools/jsonp',
	// 		datetime: 'tools/datetime',
	// 		fixed:'tools/fixed',
	// 		date_transform: 'tools/date_transform',
	// 		common:'tools/common',
	// 		default_theme: "theme/default"
	// 	}
    // },
    // module: {
    //     // 多个loader是有顺序要求的，从右往左写，因为转换的时候是从右往左转换的
    //     rules:[
    //         {
    //             test: /\.css$/,
    //             use: ['style-loader', 'css-loader', 'postcss-loader'], // 不再需要style-loader放到html文件内
    //             include: path.join(__dirname, 'modules'), //限制范围，提高打包速度
    //             exclude: /node_modules/
	// 		},
	// 		{
    //             test: /\.less$/,
    //             use: ['style-loader', 'css-loader', 'postcss-loader'], // 不再需要style-loader放到html文件内
    //             include: path.join(__dirname, 'modules'), //限制范围，提高打包速度
    //             exclude: /node_modules/
	// 		},
	// 		{
    //             test: /\.scss$/,
    //             use: ['style-loader', 'css-loader', 'postcss-loader'], // 不再需要style-loader放到html文件内
    //             include: path.join(__dirname, 'modules'), //限制范围，提高打包速度
    //             exclude: /node_modules/
    //         },
    //         { //file-loader 解决css等文件中引入图片路径的问题
    //         // url-loader 当图片较小的时候会把图片BASE64编码，大于limit参数的时候还是使用file-loader 进行拷贝
    //             test: /\.(png|jpg|jpeg|gif|svg)/,
    //             use: {
    //               loader: 'url-loader',
    //               options: {
    //                 outputPath: 'images/', // 图片输出的路径
    //                 limit: 1 * 1024
    //               }
    //             }
	// 		}
    //     ]
    // },
    // plugins: [
    // ],
    // devtool: 'source-map', // 指定加source-map的方式
    // devServer: {
    //     contentBase: path.join(__dirname, "sample"), //静态文件根目录
    //     port: 3824, // 端口
    //     host: 'localhost',
    //     overlay: true,
    //     compress: false // 服务器返回浏览器的时候是否启动gzip压缩
    // },
    // watch: true, // 开启监听文件更改，自动刷新
    // watchOptions: {
    //     ignored: /node_modules/, //忽略不用监听变更的目录
    //     aggregateTimeout: 500, //防止重复保存频繁重新编译,500毫米内重复保存不打包
    //     poll:1000 //每秒询问的文件变更的次数
	// },
	
};