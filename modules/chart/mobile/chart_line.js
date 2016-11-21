/**
 * 绘制手机分时图
 *
 * this:{
 *     container:画布的容器
 *     interactive:图表交互
 * }
 * this.options:{
 *     data:    行情数据
 *     type:    "TL"(分时图),"DK"(日K线图),"WK"(周K线图),"MK"(月K线图)
 *     canvas:  画布对象
 *     ctx:     画布上下文
 *     canvas_offset_top:   画布中坐标轴向下偏移量
 *     padding_left:    画布左侧边距
 *     k_v_away:    行情图表（分时图或K线图）和成交量图表的间距
 *     scale_count:     缩放默认值
 *     c_1_height:  行情图表（分时图或K线图）的高度
 *     rect_unit:   分时图或K线图单位绘制区域
 * }
 *
 */

// 绘制坐标轴
var DrawXY = require('chart/mobile/line/draw_xy');
// 主题
var theme = require('theme/default');
// 绘制分时折线图
var DrawLine = require('chart/mobile/line/draw_line');
// 拓展，合并，复制
var extend = require('tools/extend');
// 交互效果
var Interactive = require('interactive/interactive');
// 水印
var watermark = require('chart/watermark');
// 添加通用工具
var common = require('tools/common');

var ChartLine = (function() {

    // 构造函数
    function ChartLine(options) {
        this.defaultoptions = theme.chartLine;
        this.options = {};
        extend(true, this.options, theme.defaulttheme, this.defaultoptions, options);

        // 图表容器
        this.container = document.getElementById(options.container);

        this.container.className = this.container.className + " emcharts-container";
        // 图表加载完成事件
        this.onChartLoaded = options.onChartLoaded == undefined ? function(op) {

        } : options.onChartLoaded;

    }

    // 初始化
    ChartLine.prototype.init = function() {
        this.options.type = "line";
        var canvas = document.createElement("canvas");
        // 去除画布上粘贴效果
        // this.container.style = "-moz-user-select:none;-webkit-user-select:none;";
        // this.container.setAttribute("unselectable","on");
        this.container.style.position = "relative";
        // 画布
        var ctx = canvas.getContext('2d');
        this.options.canvas = canvas;
        this.options.context = ctx;
        // 设备像素比
        var dpr = this.options.dpr;
        // 画布的宽和高
        canvas.width = dpr;
        canvas.height = this.options.height * dpr;

       // 画布分割区域
        this.options.sepeNum = 7;

        // 画布向下偏移的距离
        this.options.canvas_offset_top = canvas.height / this.options.sepeNum /2;
        // 画布内容向坐偏移的距离
        this.options.padding_left = 0;
        // 行情图表（分时图或K线图）和成交量图表的间距
        this.options.k_v_away = canvas.height / this.options.sepeNum;
        // 缩放默认值
        this.options.scale_count = this.options.scale_count == undefined ? 0 : this.options.scale_count;
        // 画布上第一个图表的高度
        if(this.options.showV){
            this.options.c_1_height = canvas.height * 4/this.options.sepeNum;
        }else{
            this.options.c_1_height = canvas.height - 90 * dpr;
        }

        canvas.style.width = this.options.width + "px";
        canvas.style.height = this.options.height + "px";
        canvas.style.border = "0";

        // 画布上部内间距
        ctx.translate("0", this.options.canvas_offset_top);
        // 画笔参数设置
        ctx.font = (this.options.font_size * this.options.dpr) + "px Arial";
        ctx.lineWidth = 1 * this.options.dpr + 0.5;

        // 容器中添加画布
        this.container.appendChild(canvas);
    };

    // 绘图
    ChartLine.prototype.draw = function(callback) {
        // 删除canvas画布
        this.clear();
        // 初始化
        this.init();
        // 初始化交互
        this.options.interactive = new Interactive(this.options);
        var ctx = this.options.context;
        // 显示loading效果
        // inter.showLoading();
        // var _this = this;

        // 折线数据
        var series = this.options.series;
        this.options.data = {};
        var maxAndMin = getMaxMark(series);

        this.options.data.max = maxAndMin.max;
        this.options.data.min = maxAndMin.min;
        this.options.padding_left = ctx.measureText("+9000万").width + 20;

        // 绘制坐标轴
        new DrawXY(this.options);
        // 绘制分时折线图
        new DrawLine(this.options);
        // 加水印
        watermark.apply(this, [ctx, 190, 20]);

    };
    // 重绘
    ChartLine.prototype.reDraw = function() {
            // 删除canvas画布
            this.clear();
            // 初始化
            this.init();
            this.draw();
        }
        // 删除canvas画布
    ChartLine.prototype.clear = function(cb) {
        if (this.container) {
            this.container.innerHTML = "";
        } else {
            document.getElementById(this.options.container).innerHTML = "";
        }
        if (cb) {
            cb();
        };
    }

    // 获取数组中的最大值
    function getMaxMark(data) {
        var max = -1000000,
            min = 0,
            count = [];
        for (var i = 0; i < data.length; i++) {
            count = count.concat(data[i].data);
        }
        max = count[0];
        min = count[0];

        for (var i = 1; i < count.length; i++) {
            if (count[i]) {
                max = Math.max(max, count[i]);
                min = Math.min(min, count[i]);
            }

        }

        max = max / 1 + (max - min) * 0.05;
        min = min / 1 - (max - min) * 0.05;
        return {
            max: max,
            min: min
        };
    }

    return ChartLine;
})();

module.exports = ChartLine;
