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
var DrawXY = require('chart/web/bar-quarter/draw_xy');
// 主题
var theme = require('theme/default');
// 绘制分时折线图
var DrawBar = require('chart/web/bar-quarter/draw_bar'); 
// 拓展，合并，复制
var extend = require('tools/extend');
// 交互效果
var Interactive = require('interactive/interactive'); 
// 水印
var watermark = require('chart/watermark');

var ChartBarQuarter = (function() {

    // 构造函数
    function ChartBarQuarter(options) {
        this.defaultoptions = theme.default;
        this.options = {};
        extend(true, this.options, theme.default, this.defaultoptions, options);

        // 图表容器
        this.container = document.getElementById(options.container);
        // 图表加载完成事件
        this.onChartLoaded = options.onChartLoaded == undefined ? function(op){

        }:options.onChartLoaded;
        
    }

    // 初始化
    ChartBarQuarter.prototype.init = function() {

        this.options.type = "bar-quarter";
        var canvas = document.createElement("canvas");
        // 去除画布上粘贴效果
        this.container.style = "-moz-user-select:none;-webkit-user-select:none;";
        this.container.style.position = "relative";
        this.container.setAttribute("unselectable","on");
        // 画布
        var ctx = canvas.getContext('2d');
        this.options.canvas = canvas;
        this.options.context = ctx;
        // 设备像素比
        var dpr = this.options.dpr;
        // 画布的宽和高
        canvas.width = this.options.width * dpr;
        canvas.height = this.options.height * dpr;

        // 画布向下偏移的距离
        this.options.canvas_offset_top = canvas.height/5/4;
        // 画布内容向坐偏移的距离
        this.options.padding_left = this.options.context.measureText("+1000").width;
        this.options.c_1_height = 4 * canvas.height / 5;
        canvas.style.width = this.options.width + "px";
        canvas.style.height = this.options.height + "px";
        canvas.style.border = "0";

        // 画布上部内间距
        ctx.translate("0",this.options.canvas_offset_top);
        // 画笔参数设置
        ctx.font = (this.options.font_size * this.options.dpr) + "px Arial";
        ctx.lineWidth = 1 * this.options.dpr + 0.5;
        this.options.yearUnitSpacing = "0.2";
        this.options.quarterUnitSpacing = "0.4";
        
        // 容器中添加画布
        this.container.appendChild(canvas);
    };

    // 绘图
    ChartBarQuarter.prototype.draw = function(callback) {
        // 删除canvas画布
        this.clear();
        // 初始化
        this.init();
        // 初始化交互
        this.options.interactive = new Interactive(this.options);
        // 显示loading效果
        // inter.showLoading();
        // var _this = this;

        // 折线数据
        var series = this.options.series;
        var canvas = this.options.canvas;
        var getMaxMinValue = getMaxMark(series);
        this.options.data = {};
        this.options.data.max = getMaxMinValue.max;
        console.log(getMaxMinValue);
        this.options.data.min = getMaxMinValue.min;
        this.options.padding_left = this.options.context.measureText("+1000").width;
        this.options.yearUnit = get_rect.call(this,canvas.width-this.options.padding_left,this.options.data.length);
        this.options.quarterUnit = get_rect.call(this,this.options.yearUnit.rect_w,4);
        // 绘制坐标轴
        new DrawXY(this.options);
        // 绘制分时折线图
        // new DrawBar(this.options);

    };
    // 单位绘制区域
    function get_rect(width,num) {
        var rect_w = width / num;
        var bar_w = rect_w * (1 - this.options.quarterUnitSpacing);
        return {
            rect_w:rect_w,
            bar_w:bar_w
        };
    }

    // 将鼠标坐标转换为Canvas坐标
    function windowToCanvas(canvas,x,y){
        // var box = canvas.getBoundingClientRect();
        return {
            // x:(x-box.left)*(canvas.width/box.width),
            // y:(y-box.top)*(canvas.height/box.height)

            x: x*this.options.dpr,
            y: y*this.options.dpr
        };
    }
    // 将Canvas坐标转换为鼠标坐标
    function canvasToWindow(canvas,x,y){
        var box = canvas.getBoundingClientRect();
        // 相对于窗口
        // return {
        //     x:(x *(box.width/canvas.width)+box.left),
        //     y:(y *(box.height/canvas.height)+box.top + this.options.canvas_offset_top/this.options.dpr)
        // };
        return {
            x:x/this.options.dpr,
            // x:x * (box.width/canvas.width),
            y:(y+this.options.canvas_offset_top) * (box.height/canvas.height)
        };
    }
    // 图表y轴坐标计算
    function get_y(y) {
        return this.options.canvas.height - (this.options.canvas.height * (y - this.options.data.min)/(this.options.data.max - this.options.data.min));
    }
    // 图表x轴坐标计算
    function get_x(year_num,quarter_num) {
        var canvas = this.options.context.canvas;
        var type = this.options.type;
        var yearUnit = this.options.yearUnit;
        var quarterUnit = this.options.quarterUnit;
        var num = this.options.data.data.length;
        var total = this.options.data.total;
        var padding_left = this.options.padding_left;
        // var dpr = this.options.dpr;

        return (canvas.width-padding_left) / total * year_num + padding_left + quarterUnit.rect_w * quarter_num;
    }

    // 重绘
    ChartBarQuarter.prototype.reDraw = function() {
        // 删除canvas画布
        this.clear();
        // 初始化
        this.init();
        this.draw();
    }
    // 删除canvas画布
    ChartBarQuarter.prototype.clear = function(cb) {
        if(this.container){
            this.container.innerHTML = "";
        }else{
            document.getElementById(this.options.container).innerHTML = "";
        }
        if (cb) {
            cb();
        };
    }

    // 获取数组中的最大值
    function getMaxMark(series) {
        var max = 0,min = 0,seriesLength = series.length,tempObj = {};
        for(var i = 0;i < seriesLength; i++){
            for(var j = 0;j < series[i].data.length;j++) {
                max = Math.max(max,series[i].data[j].value);
                min = Math.min(min,series[i].data[j].value);
            }
        }
        tempObj.max = max;
        tempObj.min = min;
        return tempObj;
     }

    return ChartBarQuarter;
})();

module.exports = ChartBarQuarter;
