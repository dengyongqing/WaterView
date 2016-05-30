/**
 * 默认主题
 */

var defaultopions = {
	default:{
		c_1_percent:0.6, //图表区域高度百分比，取值范围[0,1]
		spacing:0.4, //K线柱体的间距比例，取值范围[0,1]
		padding_left:30,//图表距离画布左侧的距离
		k_v_away:30,//K线图表和成交量之间的间距
		canvas_offset_top:40,//画布向下偏移的距离
		point_width:5,
		font_size:12,//默认字体大小
		point_color:"#8f8f8f",//鼠标指示线交点颜色
		up_color:"#d33f25",
		down_color:"#17b03e"
	},
	// 分时线图表配置参数
	chart_time:{
		crossline:true
	},
	// K线图表配置参数
	chart_k:{
		crossline:false
	},
	// 坐标轴配置参数
	draw_xy:{
        axis_color:"#fff", //坐标轴颜色
        y_max:100,//纵坐标最小值
        y_min:0,//纵坐标最小值
        sepe_num:5, 	//沿Y轴平均分割线的个数
        y_padding_per:0.05, //画布上线内间距占(y_max - y_min)的比例
        date_offset_top:15//横坐标轴上的日期刻度
	},
	// 分时图配置参数
	draw_line:{
     	avg_cost_color:"#f1ca15"   //平均线的颜色
	},
	draw_k:{
        
	},
	draw_ma:{
        
	},
	// 成交量配置参数
	draw_v:{
        
	},
	// 图表交互
	interactive:{

	}
};

module.exports = defaultopions;