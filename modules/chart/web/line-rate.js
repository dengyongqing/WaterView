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
var DrawXY = require('chart/web/line-rate/draw_xy');
// 主题
var theme = require('theme/default');
// 绘制利率折线图
var DrawLine = require('chart/web/line-rate/draw_line'); 
// 拓展，合并，复制
var extend = require('tools/extend');
// 交互效果
var Interactive = require('interactive/interactive'); 
// 水印
var watermark = require('chart/watermark');
/*工具*/
var common = require('common');

var ChartLine = (function() {

    // 构造函数
    function ChartLine(options) {
        this.defaultoptions = theme.chartLine;
        this.options = {};
        extend(true, this.options, theme.default, this.defaultoptions, options);

        // 图表容器
        this.container = document.getElementById(options.container);
        // 图表加载完成事件
        this.onChartLoaded = options.onChartLoaded == undefined ? function(op){

        }:options.onChartLoaded;
        
    }

    // 初始化
    ChartLine.prototype.init = function() {

        this.options.type = "line";
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
        this.options.canvas_offset_top = canvas.height / (9 * 2);
        // 画布内容向坐偏移的距离
        this.options.padding_left = canvas.width / 6;

        // 行情图表（分时图或K线图）和成交量图表的间距
        this.options.k_v_away = canvas.height / (9 * 2);
        // 缩放默认值
        this.options.scale_count = 0;
        // 画布上第一个图表的高度
        if(this.options.showflag){
            this.options.c_1_height = canvas.height * (5/9);
        }else{
            this.options.c_1_height = canvas.height * (7/9);
        }

        canvas.style.width = this.options.width + "px";
        canvas.style.height = this.options.height + "px";
        canvas.style.border = "0";

        // 画布上部内间距
        ctx.translate("0",this.options.canvas_offset_top);
        // 画笔参数设置
        ctx.font = (this.options.font_size * this.options.dpr) + "px Arial";
        ctx.lineWidth = 1 * this.options.dpr + 0.5;
        // 加水印
        watermark.apply(this,[ctx,190,20]);
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
        // 显示loading效果
        // inter.showLoading();
        // var _this = this;

        // 折线数据
        var series = this.options.series;
        this.options.data = {};
        this.options.data.max = 1;
        this.options.data.min = 0;
        this.options.padding_left = this.options.context.measureText("1000万").width + 20;

        // 绘制坐标轴
        new DrawXY(this.options);
        // 绘制利率折线图
        new DrawLine(this.options);

        this.addInteractive();

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
        if(this.container){
            this.container.innerHTML = "";
        }else{
            document.getElementById(this.options.container).innerHTML = "";
        }
        if (cb) {
            cb();
        };
    }

        //获得tips的显示位置和tips的相关内容(传入的值是乘过dpr值的)
    function getTips(winX, winY) {
        //需要被返回的值
        var result = {};

        var canvas = this.options.canvas;
        var paddingLeft = this.options.padding_left;
        var offSetTop = this.options.canvas_offset_top;
        var radius = this.options.pointRadius;
        var dpr = this.options.dpr;

        var series = this.options.series;
        var xaxis = this.options.xaxis;

        //标识在从左到右第几个圆点上
        var num = (winX - paddingLeft + radius) / ((canvas.width - paddingLeft) / (xaxis.length - 1));
        num = num < 0 ? 0 : Math.floor(num);

        //数据点点的圆心
        var pointX = ((canvas.width - paddingLeft) / (xaxis.length - 1)) * num + paddingLeft;

        for (var i = 0; i < series.length; i++) {
            //遍历获得
            var pointY = common.get_y.call(this, series[i].data[num]);
            //判断鼠标指定的点是不是在数据点周围
            if ((Math.abs(pointY - winY + offSetTop) < 2 * radius) && (Math.abs(pointX - winX) < 2 * radius)) {
                result.showTips = true;
                result.showLine = true;
                result.pointY = pointY + offSetTop/dpr;
                result.pointX = pointX;
                result.content = series[i].name + " : " + series[i].data[num];
            }
        }
        //判断虚线是否显示
        if (Math.abs(pointX - winX) < 4 * radius) {
            //对竖直的y轴做处理（可能是个bug）
            if (num !== 0 && num !== xaxis.length - 1) {
                result.showLine = true;
                result.lineX = pointX;
            } else {
                result.showLine = false;
            }
        }

        //如果没有被赋值，赋值为false
        if (!result.showTips) {
            result.showTips = false;
        }
        if (!result.showLine) {
            result.showLine = false;
        }

        return result;
    }

    //添加交互
    ChartLine.prototype.addInteractive = function() {
        var canvas = this.options.canvas;
        var _that = this;
        var tips = document.createElement("div");
        var middleLine = document.createElement("div");
        //用于canvas与windows相互转化
        var dpr = this.options.dpr ? this.options.dpr : 1;
        var padding_left = this.options.padding_left;
        var offSetTop = this.options.canvas_offset_top / dpr;
        var yHeight = this.options.c_1_height / dpr;
        var radius = this.options.pointRadius;
        //用于减少div移动的setTimeout
        var timeId;



        tips.setAttribute("class", "web-tips");
        middleLine.setAttribute("class", "web-middleLine");
        _that.container.appendChild(tips);
        _that.container.appendChild(middleLine);

        canvas.addEventListener('mousemove', function(e) {
            // showTips(e, status);

            var winX, winY;
            //浏览器检测，获取到相对元素的x和y
            if (e.layerX) {
                winX = e.layerX;
                winY = e.layerY;
            } else if (e.offsetX) {
                winX = e.offsetX;
                winY = e.offsetY;
            }

            console.log(winY+":"+offSetTop+":"+yHeight+":"+dpr);

            //在坐标系外不显示
            if (winX * dpr >= (padding_left - radius) && (winY >= offSetTop && winY <= (offSetTop + yHeight))) {} else {
                tips.style.display = "none";
                middleLine.style.display = "none";
            }

            //通过鼠标移动获得交互的点
            var result = getTips.call(_that, winX * _that.options.dpr, winY * _that.options.dpr);

            if (result.showLine) {
                middleLine.style.display = "inline-block";
                //绘制中线
                middleLine.style.height = yHeight + "px";
                middleLine.style.left = result.lineX / dpr + "px";
                middleLine.style.top = offSetTop + "px";
            } else {
                middleLine.style.display = "none";
            }
            //如果在数据点上，显示tips
            if (result.showTips) {
                tips.style.display = "inline-block";
                tips.innerHTML = result.content;
                if (winX * dpr - padding_left < canvas.width / 2) {
                    tips.style.left = (result.pointX / dpr + radius ) + "px";
                } else {
                    tips.style.left = (result.pointX / dpr - radius- tips.clientWidth) + "px";
                }
                console.log();
                tips.style.top = (result.pointY / dpr + radius) + "px";
            } else {
                tips.style.display = "none";
            }

        }, false);
    }

    return ChartLine;
})();

module.exports = ChartLine;
