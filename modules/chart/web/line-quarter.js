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
// 绘制季度折线图
var DrawLine = require('chart/web/line-quarter/draw_line');
// 拓展，合并，复制
var extend = require('tools/extend');
// 交互效果
var Interactive = require('interactive/interactive');
// 水印
var watermark = require('chart/watermark');

var ChartBarQuarter = (function() {

    // 构造函数
    function ChartBarQuarter(options) {
        this.defaultoptions = theme.defaulttheme;
        this.options = {};
        extend(true, this.options, theme.defaulttheme, this.defaultoptions, options);

        // 图表容器
        this.container = document.getElementById(options.container);
        // 图表加载完成事件
        this.onChartLoaded = options.onChartLoaded == undefined ? function(op) {

        } : options.onChartLoaded;

    }

    // 初始化
    ChartBarQuarter.prototype.init = function() {

        this.options.type = "quarter-line";
        var canvas = document.createElement("canvas");
        // 去除画布上粘贴效果
        this.container.style = "-moz-user-select:none;-webkit-user-select:none;";
        this.container.style.position = "relative";
        this.container.setAttribute("unselectable", "on");
        // 画布
        var ctx = canvas.getContext('2d');
        this.options.canvas = canvas;
        this.options.context = ctx;
        // 设备像素比
        var dpr = this.options.dpr = 1;
        // 画布的宽和高
        canvas.width = this.options.width * dpr;
        canvas.height = this.options.height * dpr;

        // 画布向下偏移的距离
        this.options.canvas_offset_top = canvas.height / 5 / 4;
        // 画布内容向坐偏移的距离
        this.options.c_1_height = 4 * canvas.height / 5;
        canvas.style.width = this.options.width + "px";
        canvas.style.height = this.options.height + "px";
        canvas.style.border = "0";

        // 画布上部内间距
        ctx.translate("0", this.options.canvas_offset_top);
        // 画笔参数设置
        ctx.font = (this.options.font_size * this.options.dpr) + "px Arial";
        ctx.lineWidth = 1 * this.options.dpr;
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
        if (getMaxMinValue.min < 0) {
            this.options.isLessZero = true;
        }
        this.options.data = {};
        this.options.data.max = getMaxMinValue.max;
        this.options.data.min = getMaxMinValue.min;
        this.options.padding_left = this.options.context.measureText("+10000").width + 10;;
        this.options.yearUnit = getYearRect.call(this, canvas.width - this.options.padding_left, this.options.series.length);
        this.options.quarterUnit = getQuarterRect.call(this, this.options.yearUnit.bar_w, 4);

        // 绘制坐标轴
        new DrawXY(this.options);
        // 绘制季度折线图
        new DrawLine(this.options);
        //添加交互
        this.addInteractive();

    };
    // 单位绘制区域
    function getYearRect(width, num) {
        var rect_w = width / num;
        var bar_w = rect_w * (1 - this.options.yearUnitSpacing);
        return {
            rect_w: rect_w,
            bar_w: bar_w
        };
    }

    // 单位绘制区域
    function getQuarterRect(width, num) {
        var rect_w = width / num;
        var bar_w = rect_w * (1 - this.options.quarterUnitSpacing);
        return {
            rect_w: rect_w,
            bar_w: bar_w
        };
    }

    // 将鼠标坐标转换为Canvas坐标
    function windowToCanvas(canvas, x, y) {
        // var box = canvas.getBoundingClientRect();
        return {
            // x:(x-box.left)*(canvas.width/box.width),
            // y:(y-box.top)*(canvas.height/box.height)

            x: x * this.options.dpr,
            y: y * this.options.dpr
        };
    }
    // 将Canvas坐标转换为鼠标坐标
    function canvasToWindow(canvas, x, y) {
        var box = canvas.getBoundingClientRect();
        // 相对于窗口
        // return {
        //     x:(x *(box.width/canvas.width)+box.left),
        //     y:(y *(box.height/canvas.height)+box.top + this.options.canvas_offset_top/this.options.dpr)
        // };
        return {
            x: x / this.options.dpr,
            // x:x * (box.width/canvas.width),
            y: (y + this.options.canvas_offset_top) * (box.height / canvas.height)
        };
    }
    // 图表y轴坐标计算
    function get_y(y) {
        if (!this.options.isLessZero) {
            return this.options.c_1_height - (this.options.c_1_height * (y - this.options.data.min) / (this.options.data.max - this.options.data.min));
        } else {
            return this.options.c_1_height / 2 - (this.options.c_1_height / 2 * (-y) / (this.options.data.max));
        }
    }
    // 图表x轴坐标计算
    function get_x(year_num, quarter_num) {
        var canvas = this.options.context.canvas;
        var quarterUnit = this.options.quarterUnit;
        var total = this.options.series.length;
        var padding_left = this.options.padding_left;
        // var dpr = this.options.dpr;

        return (canvas.width - padding_left) / total * year_num + padding_left + quarterUnit.rect_w * quarter_num + quarterUnit.rect_w / 2;
    }

    //通过clientX获得交互需要的tips的坐标和虚线中x坐标
    function getCoordinateByClient(clientX) {
        var canvasX = windowToCanvas.call(this, this.options.canvas, clientX, 0).x;
        //被返回的两个数据
        var result = {};

        //需要用到的参数
        var paddingLeft = this.options.padding_left,
            yearUnit = this.options.yearUnit,
            quarterUnit = this.options.quarterUnit,
            canvas = this.options.canvas,
            num = this.options.series.length;

        // 求得鼠标所指的位置属于哪一年的哪一个季度
        var numYear = Math.floor((canvasX - paddingLeft) / yearUnit.rect_w);
        if (numYear < 0) {
            numYear = 0;
        }
        var numQuarter = Math.floor((canvasX - paddingLeft - numYear * yearUnit.rect_w - (yearUnit.rect_w - yearUnit.bar_w) / 2) / quarterUnit.rect_w);
        if (numQuarter < 0) {
            numQuarter = 0;
        } else if (numQuarter > 3) {
            numQuarter = 3;
        }

        // 绘制的虚线的x坐标
        result.midddleLine = get_x.call(this, numYear, numQuarter) + 3 * quarterUnit.bar_w / 4;
        //绘制tips的坐标
        result.tipsX = result.midddleLine + quarterUnit.bar_w / 2;
        result.tipsY = get_y.call(this, -this.options.series[numYear].data[numQuarter]);
        if (result.tipsX > canvas.width / 2) {
            result.tipsX = result.midddleLine - quarterUnit.bar_w / 2;
        }


        result.midddleLineHeight = result.tipsY;

        result.content = this.options.series[numYear].data[numQuarter];
        result.arr = numYear + ":" + numQuarter;

        return result;
    }


    //添加交互
    ChartBarQuarter.prototype.addInteractive = function() {
        var canvas = this.options.canvas;
        var _that = this;
        var tips = document.createElement("div");
        var middleLine = document.createElement("div");
        var interactiveInfo, coordinateWindow = {};
        //用于状态记录
        var status = "x:x";
        //用于canvas与windows相互转化
        var dpr = this.options.dpr;
        var padding_left = this.options.padding_left;
        var offSetTop = this.options.canvas_offset_top;
        var yHeight = this.options.c_1_height;
        var timeId;

        tips.setAttribute("class", "web-tips");
        middleLine.setAttribute("class", "web-middleLine");
        _that.container.appendChild(tips);
        _that.container.appendChild(middleLine);

        canvas.addEventListener('mousemove', function(e) {
            if (timeId) {
                clearTimeout(timeId);
            }

            timeId = setTimeout(function() {
                // showTips(e, status);
                (function(e, status) {
                    var winX, winY;
                    //浏览器检测，获取到相对元素的x和y
                    if (e.layerX) {
                        winX = e.layerX;
                        winY = e.layerY;
                    } else if (e.offsetX) {
                        winX = e.offsetX;
                        winY = e.offsetY;
                    }
                    //当超出坐标系框就不显示交互
                    if (winX >= padding_left && (winY >= offSetTop && winY * dpr < (offSetTop * dpr + yHeight))) {
                        tips.style.display = "inline-block";
                        middleLine.style.display = "inline-block";
                    } else {
                        tips.style.display = "none";
                        middleLine.style.display = "none";
                    }
                    //获取交互的信息，包括tips的坐标，middline的坐标和tips的内容
                    interactiveInfo = getCoordinateByClient.call(_that, winX);

                    if (status !== interactiveInfo.arr) {
                        coordinateWindow.midddleLine = canvasToWindow.call(_that, canvas, interactiveInfo.midddleLine, 0);
                        coordinateWindow.tips = canvasToWindow.call(_that, canvas, interactiveInfo.tipsX, interactiveInfo.tipsY);
                        //绘制tips
                        tips.innerHTML = interactiveInfo.content;
                        if(winX > canvas.width/2){
                            tips.style.left = (coordinateWindow.tips.x - tips.clientWidth) + "px";
                        }else{
                            tips.style.left = (coordinateWindow.tips.x - tips.style.width) + "px";
                        }
                        tips.style.top = coordinateWindow.tips.y + "px";
                       
                        //绘制中线
                        middleLine.style.height = yHeight + "px";
                        middleLine.style.left = coordinateWindow.midddleLine.x + "px";
                        middleLine.style.top = offSetTop + "px";
                        status = interactiveInfo.arr;
                    }
                })(e, status);
            }, 10);

        }, false);
    };

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
    function getMaxMark(series) {
        var max = 0,
            min = 0,
            seriesLength = series.length,
            tempObj = {};
        for (var i = 0; i < seriesLength; i++) {
            for (var j = 0; j < series[i].data.length; j++) {
                max = Math.max(max, series[i].data[j]);
                min = Math.min(min, series[i].data[j]);
            }
        }
        if (max < Math.abs(min)) {
            max = Math.abs(min) + Math.abs(min) / 16;
        } else {
            max = max + max / 16;
        }
        tempObj.max = max;
        tempObj.min = min;
        return tempObj;
    }

    return ChartBarQuarter;
})();

module.exports = ChartBarQuarter;
