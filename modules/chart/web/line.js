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
 *    
 * }
 *
 */

// 绘制坐标轴
var DrawXY = require('chart/web/line/draw_xy');
// 主题
var theme = require('theme/default');
// 绘制分时折线图
var DrawLine = require('chart/web/line/draw_line');
// 拓展，合并，复制
var extend = require('tools/extend2');
// 交互效果
var Interactive = require('interactive/interactive');
// 水印
var watermark = require('chart/watermark');
// 添加通用工具
var common = require('tools/common');
// 获取步长，最大值，最小值
var divide = require('chart/web/common/divide');

var ChartLine = (function() {

    // 构造函数
    function ChartLine(options) {
        this.options = {};
        this.options = extend(theme.defaulttheme, options);
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

        // 容器中添加画布
        this.container.appendChild(canvas);

        // 画布向下偏移的距离
        this.options.canvas_offset_top = 15;


        // 缩放默认值
        this.options.scale_count = 0;
        this.options.decimalCount = this.options.decimalCount == undefined ? 2 : this.options.decimalCount;
        // 画布上第一个图表的高度
        this.options.c_1_height = canvas.height - 40;
        // if(this.options.showflag){
        //     this.options.c_1_height = canvas.height * (5/9);
        // }else{
        //     this.options.c_1_height = canvas.height * (7/9);
        // }
        if (this.options.showname === undefined) {
            this.options.showname = true;
        }
        this.options.sepeNum = this.options.sepeNum == undefined ? 4 : this.options.sepeNum;
        if (this.options.sepeNum < 2) {
            this.options.sepeNum = 2;
        }


        canvas.style.width = this.options.width + "px";
        canvas.style.height = this.options.height + "px";
        canvas.style.border = "0";

        // 画布上部内间距
        ctx.translate("0", this.options.canvas_offset_top);
        // 画笔参数设置
        var font = "";
        var fontSize = "";
        var fontFamily = "";
        if (this.options.font) {
            if (this.options.font.fontFamily) {
                fontFamily = this.options.font.fontFamily;
            } else {
                fontFamily = "Arial";
            }

            if (this.options.font.fontSize) {
                fontSize = this.options.font.fontSize;
            } else {
                fontSize = 12;
            }

            font = fontSize + "px " + fontFamily;
        } else {
            font = "12px Arial";
        }
        ctx.font = font;
        ctx.lineWidth = 1 * this.options.dpr;

        //锚点半径
        this.options.pointRadius = this.options.pointRadius == undefined ? 5 : this.options.pointRadius;


    }

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

        // 第一坐标轴折线数据
        var series = this.options.series;
        this.options.data = {};
        var maxAndMin = getMaxMark.call(this, series);
        this.options.data.max = maxAndMin.max;
        this.options.data.min = maxAndMin.min;
        this.options.data.step = maxAndMin.step;

        // 画布内容偏移的距离
        this.options.padding_left = Math.round(maxAndMin.maxPaddingLeftWidth + 20);
        if (this.options.series2) {
            this.options.drawWidth = Math.round(ctx.canvas.width - this.options.padding_left);
            // 加水印
            watermark.apply(this, [ctx, 100 + this.options.padding_left, 10, 82, 20]);
        } else {
            this.options.drawWidth = Math.round(ctx.canvas.width - 10);
            // 加水印
            watermark.apply(this, [ctx, 100, 10, 82, 20]);
        }


        // 第二坐标轴折线数据
        if (this.options.series2) {
            var series2 = this.options.series2;
            var maxAndMin2 = getMaxMark.call(this, series2);
            this.options.data.max2 = maxAndMin2.max;
            this.options.data.min2 = maxAndMin2.min;
            this.options.data.step2 = maxAndMin2.step;
        }

        // 绘制坐标轴
        new DrawXY(this.options);
        // 绘制分时折线图
        new DrawLine(this.options);
        this.addInteractive();

    };

    //添加交互
    ChartLine.prototype.addInteractive = function() {
        var canvas = this.options.canvas;
        var dateArr = this.options.xaxis;
        var series = this.options.series;
        var series2 = this.options.series2;
        var ctx = this.options.context;
        var padding_left = this.options.padding_left;
        var padding_top = this.options.canvas_offset_top;
        var unit; //单位宽度
        if (dateArr.length === 1) {
            unit = this.options.drawWidth - padding_left;
        } else {
            unit = (this.options.drawWidth - padding_left) / (dateArr.length - 1); //单位宽度
        }
        var that = this;
        var dpr = this.options.dpr;
        var y_max = this.options.data.max;
        var y_min = this.options.data.min;
        var y_max2 = this.options.data.max2;
        var y_min2 = this.options.data.min2;
        var c_1_height = this.options.c_1_height;
        var radius = this.options.pointRadius;
        common.addEvent.call(that, canvas, "touchmove", function(e) {
            var winX, winY;
            //浏览器检测，获取到相对元素的x和y
            if (e.layerX) {
                winX = e.layerX;
                winY = e.layerY;
            } else if (e.x) {
                winX = e.x;
                winY = e.y;
            }

            eventHanlder.call(that, winX, winY);
        });
        //添加交互事件
        common.addEvent.call(that, canvas, "mousemove", function(e) {
            var winX, winY;
            //浏览器检测，获取到相对元素的x和y
            if (e.layerX) {
                winX = e.layerX;
                winY = e.layerY;
            } else if (e.x) {
                winX = e.x;
                winY = e.y;
            }

            eventHanlder.call(that, winX, winY);

        });

        function eventHanlder(winX, winY) {
            var canvasX = winX * dpr - padding_left; //转换为canvas中的坐标
            var canvasY = winY * dpr - padding_top;

            //下标
            var cursor = 0;
            //用来显示tips的一组数据
            var tipArr = [];
            //获取交互需要的坐标数据
            if (canvasX % unit < unit / 2) {
                cursor = Math.floor(canvasX / unit);
            } else {
                cursor = Math.ceil(canvasX / unit);
            }

            if (cursor < 0) { cursor = 0; }
            if (cursor > dateArr.length - 1) { cursor = dateArr.length - 1; }

            for (var i = 0, len = series.length; i < len; i++) {
                tipArr.push({
                    color: series[i].color,
                    data: series[i].data[cursor] + (series[i].suffix || ""),
                    name: series[i].name,
                    y: padding_top + common.get_y.call(that, series[i].data[cursor])
                });
            }
            if (that.options.series2) {
                for (i = 0, len = series2.length; i < len; i++) {
                    tipArr.push({
                        color: series2[i].color,
                        data: series2[i].data[cursor] + (series2[i].suffix || ""),
                        name: series2[i].name,
                        y: padding_top + (c_1_height - c_1_height * (series2[i].data[cursor] - y_min2) / (y_max2 - y_min2))
                    });
                }
            }

            //排序
            tipArr.sort(function(a, b) {
                return a.y - b.y;
            });

            var left = 0,
                flag = false;
            if (dateArr.length == 1) {
                left = (cursor * unit / dpr + unit / dpr * (1 / 2) + padding_left);
            } else {
                left = (cursor * unit / dpr + padding_left);
            }

            //添加交互
            if (!that.options.interOption) {
                that.options.interOption = {};
                //提示
                var tips = document.createElement("div");
                tips.className = "chart_line_tips";

                that.container.appendChild(tips);

                tips.style.top = (tipArr[0].y + tipArr[tipArr.length - 1].y) / 2 / dpr + "px";
                var title = document.createElement("div");
                title.className = "chart_line_tips_title";
                title.innerHTML = dateArr[cursor].value;
                tips.appendChild(title);
                if ((cursor * unit / dpr + padding_left / dpr) > canvas.width / 2) {
                    tips.style.left = (left - padding_left / 2 - tips.clientWidth) + "px";
                } else {
                    tips.style.left = (left + padding_left / 2) + "px";
                }
                //交互的竖线
                var yLine = document.createElement("div");
                yLine.className = "chart_line_yline";
                //交互的竖线
                yLine.style.left = left + "px";
                yLine.style.top = padding_top / dpr + "px";
                yLine.style.height = c_1_height / dpr + "px";
                that.container.appendChild(yLine);
                var circles = [];
                for (i = 0, len = tipArr.length; i < len; i++) {
                    //tips内容
                    var lineTip = document.createElement("div");
                    lineTip.className = "chart_line_tips_line";
                    var color = document.createElement("span");
                    color.className = "chart_line_tips_color";
                    color.style.backgroundColor = tipArr[i].color;
                    lineTip.appendChild(color);
                    var content = document.createElement("span");
                    content.innerHTML = (that.options.showname ? tipArr[i].name : "") + tipArr[i].data
                    lineTip.appendChild(content);
                    tips.appendChild(lineTip);
                    //圆圈
                    var cir = document.createElement("div");
                    cir.className = "chart_line_cir";
                    cir.style.width = 2 * radius + "px";
                    cir.style.height = 2 * radius + "px";
                    cir.style.top = (tipArr[i].y / dpr - radius) + "px";
                    cir.style.left = (left - radius) + "px";
                    cir.style.borderColor = tipArr[i].color;
                    that.container.appendChild(cir);
                    circles.push(cir);
                }

                that.options.interOption.tips = tips;
                that.options.interOption.yLine = yLine;
                that.options.interOption.circles = circles;
            } else {
                var tips = that.options.interOption.tips;

                var children = tips.children;
                children[0].innerHTML = dateArr[cursor].value;
                for (var j = 0, len = tipArr.length; j < len; j++) {
                    if (tipArr[j].data === "") {
                        children[j + 1].style.display = "none";
                    } else {
                        flag = true;
                        children[j + 1].style.display = "block";
                        children[j + 1].children[0].style.backgroundColor = tipArr[j].color;
                        children[j + 1].children[1].innerHTML = (that.options.showname ? tipArr[j].name : "") + " " + tipArr[j].data
                    }
                }
                if (flag) {
                    tips.style.display = "block";
                } else {
                    tips.style.display = "none";
                }
                if ((cursor * unit / dpr + padding_left / dpr) >= canvas.width / dpr / 2) {
                    tips.style.left = (left - padding_left / 2 - tips.clientWidth) + "px";
                } else {
                    tips.style.left = (left + padding_left / 2) + "px";
                }
                tips.style.top = (tipArr[0].y + tipArr[tipArr.length - 1].y) / 2 / dpr - 50 + "px";
                var yLine = that.options.interOption.yLine;
                yLine.style.left = left + "px";
                var circles = that.options.interOption.circles;
                for (var k = 0, kLen = circles.length; k < kLen; k++) {
                    if (tipArr[k].data === "") {
                        circles[k].style.display = "none";
                    } else {
                        circles[k].style.display = "block";
                        circles[k].style.top = tipArr[k].y / dpr - radius + "px";
                        circles[k].style.left = (left - radius) + "px";
                        circles[k].style.borderColor = tipArr[k].color;
                    }
                }
                if (!flag) {
                    that.options.interOption.tips.style.display = "block";
                    yLine.style.display = "block";
                }
            }

            var padding_right = this.options.series2 ? padding_left : 10;

            //当超出坐标系框就不显示交互
            if (canvasX >= 0 && canvasX < (canvas.width - padding_left - padding_right - 3) && canvasY >= 0 && canvasY <= c_1_height && flag) {                that.options.interOption.tips.style.display = "block";
                for (var k = 0, kLen = circles.length; k < kLen; k++) {
                    circles[k].style.display = "block";
                }
                yLine.style.display = "block";
            } else {
                that.options.interOption.tips.style.display = "none";
                for (var k = 0, kLen = circles.length; k < kLen; k++) {
                    circles[k].style.display = "none";
                }
                yLine.style.display = "none";
            }
        }
    }


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
    function getMaxMark(series) {

        var seriesLength = series.length;
        var arr = [];
        for (var i = 0; i < seriesLength; i++) {
            arr = arr.concat(series[i].data);
        }
        var tempObj = divide(this.options.sepeNum, arr);

        var ctx = this.options.context;
        if(tempObj.stepHeight >= 10000){
            var backWidth = ctx.measureText(common.format_unit(tempObj.stepHeight)).width - ctx.measureText(common.format_unit(parseInt(tempObj.stepHeight))).width;
        }else{
            var backWidth = ctx.measureText(tempObj.stepHeight).width - ctx.measureText(parseInt(tempObj.stepHeight)).width;
        }
        var frontMaxWidth = ctx.measureText(common.format_unit(parseInt(tempObj.max))).width;
        var frontMinWidth = ctx.measureText(common.format_unit(parseInt(tempObj.min))).width;
        var frontWidth = frontMaxWidth > frontMinWidth ? frontMaxWidth : frontMinWidth;
        var maxPaddingLeftWidth = frontWidth + backWidth;

        return {
            max: tempObj.max,
            min: tempObj.min,
            step: tempObj.stepHeight,
            maxPaddingLeftWidth: maxPaddingLeftWidth
        };
    }

    return ChartLine;
})();

module.exports = ChartLine;
