/**
 * 绘制折线图
 *
 * this:{
 *     container:画布的容器
 *     interactive:图表交互
 * }
 * this.options:{
 *     data:    行情数据
 *     canvas:  画布对象
 *     ctx:     画布上下文
 *     
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
var extend = require('tools/extend2');
// 水印
var watermark = require('chart/watermark');
/*工具*/
var common = require('tools/common');


var ChartLine = (function() {

    // 构造函数
    function ChartLine(options) {
        this.defaultoptions = theme.chartLine;
        this.options = extend(this.defaultoptions, theme.defaulttheme, options);

        // 图表容器
        this.container = document.getElementById(options.container);
        
        this.container.className = this.container.className.replace(/emcharts-container/g, "").trim();
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
        // 容器中添加画布
        this.container.appendChild(canvas);
        // 兼容IE6-IE9
        try {
            var ctx = canvas.getContext('2d');
        } catch (error) {
            canvas = window.G_vmlCanvasManager.initElement(canvas);
            var ctx = canvas.getContext('2d');
        }
        this.options.canvas = canvas;
        this.options.context = ctx;
        // 设备像素比
        var dpr = this.options.dpr = 1;

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
       
        this.options.c_1_height = canvas.height * (8 / 9) - 10;

        canvas.style.width = this.options.width + "px";
        canvas.style.height = this.options.height + "px";
        canvas.style.border = "0";

        // 画布上部内间距
        ctx.translate("0", this.options.canvas_offset_top);
        // 画笔参数设置
        ctx.font = (this.options.font_size * this.options.dpr) + "px Arial";
        ctx.lineWidth = 1 * this.options.dpr;


        // 加水印
        watermark.apply(this,[this.options.context,90,20,82,20]);

    };

    // 绘图
    ChartLine.prototype.draw = function(callback) {
        // 删除canvas画布
        this.clear();
        // 初始化
        this.init();

        var ctx = this.options.context;

        // 折线数据
        var series = this.options.series;
        var maxAndMin = getMaxAndMin(series);
        this.options.data = {};
        this.options.data.max = maxAndMin.max;
        this.options.data.min = maxAndMin.min;
        
        // 画布内容偏移的距离
        this.options.padding_left = ctx.measureText("+9000万").width + 10;
        // this.options.padding_left = ctx.measureText(common.format_unit(this.options.data.max)).width + 20;
        this.options.drawWidth = ctx.canvas.width - this.options.padding_left;

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
        if (this.container) {
            this.container.innerHTML = "";
        } else {
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
        result.showLine = false;
        result.showTips = false;

        var canvas = this.options.canvas;
        var paddingLeft = this.options.padding_left;
        var offSetTop = this.options.canvas_offset_top;
        var radius = this.options.pointRadius = this.options.pointRadius == undefined ? 5 : this.options.pointRadius;
        var dpr = this.options.dpr;

        var series = this.options.series;
        var xaxis = this.options.xaxis;
        var unitWidth = (canvas.width - paddingLeft) / (xaxis.length - 1);

        //标识在从左到右第几个圆点上
        var num = (winX - paddingLeft + unitWidth/2) / (unitWidth);
        num = num < 0 ? 0 : Math.floor(num);

        //数据点点的圆心
        var pointX = ((canvas.width - paddingLeft) / (xaxis.length - 1)) * num + paddingLeft;

        for (var i = 0; i < series.length; i++) {
            //遍历获得
            var pointY = common.get_y.call(this, series[i].data[num]);
            //判断鼠标指定的点是不是在数据点周围
            if ((Math.abs(pointY - winY + offSetTop) < 2 * radius) && (Math.abs(pointX - winX + radius) < 2 * radius) && num != (xaxis.length -1)) {
                result.showTips = true;
                result.pointY = pointY + offSetTop / dpr;
                result.pointX = pointX;
                result.content = series[i].name + " : " + series[i].data[num];
            }
        }
        //判断虚线是否显示
        if (Math.abs(pointX - winX ) < 2*radius) {
            //对竖直的y轴做处理（可能是个bug）
            if (num !== 0 && num !== xaxis.length - 1) {
                result.showLine = true;
                result.lineX = pointX;
            } else {
                result.showLine = false;
            }
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

        tips.className = "web-tips";
        middleLine.className = "web-middleLine";
        _that.container.appendChild(tips);
        _that.container.appendChild(middleLine);

        common.addEvent.call(_that, canvas, "mousemove", function(e) {
            var winX, winY;
            //浏览器检测，获取到相对元素的x和y
            if (e.layerX) {
                winX = e.layerX;
                winY = e.layerY;
            } else if (e.x) {
                winX = e.x;
                winY = e.y;
            }

            //在坐标系外不显示
            if (winX * dpr >= (padding_left - radius) && (winY >= offSetTop && winY <= (offSetTop + yHeight))) {} else {
                tips.style.display = "none";
                middleLine.style.display = "none";
            }

            //通过鼠标移动获得交互的点
            var result = getTips.call(_that, winX * _that.options.dpr, winY * _that.options.dpr);

            if (result.showLine && (winY >= offSetTop && winY <= (offSetTop + yHeight))) {
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
                    tips.style.left = (result.pointX / dpr + radius) + "px";
                } else {
                    tips.style.left = (result.pointX / dpr - radius - tips.clientWidth) + "px";
                }
                tips.style.top = (result.pointY / dpr + radius) + "px";
            } else {
                tips.style.display = "none";
            }
        });
    }

    function getMaxAndMin(series){

        var max = 0,
            min = 0,
            seriesLength = series.length,
            tempObj = {};
        for (var i = 0; i < seriesLength; i++) {
            for (var j = 0; j < series[i].data.length; j++) {

                if(i == 0 && j == 0){
                    max = series[i].data[j];
                    min = series[i].data[j];
                }
                max = Math.max(max, series[i].data[j]);
                min = Math.min(min, series[i].data[j]);
            }
        }
       
        tempObj.max = max + Math.abs(max - min) * 0.05;
        tempObj.min = min;

        return tempObj;
    }
    return ChartLine;
})();

module.exports = ChartLine;
