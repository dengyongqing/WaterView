/**
 * 绘制web分时图
 *
 */

// 绘制坐标轴
var DrawXY = require('chart/web/time/draw_xy');
// 主题
var theme = require('theme/default');
// 获取分时图数据
var GetDataTime = require('getdata/mobile/chart_time');
// 工具
var common = require('chart/web/common/common');
var draw_dash = require('chart/web/common/draw_dash_line');
// 拓展，合并，复制
var extend = require('tools/extend2');
// 交互效果
var Interactive = require('chart/web/common/interactive');
// 水印
var watermark = require('chart/watermark');

var ChartTime = (function() {

    // 构造函数
    function ChartTime(options) {
        this.defaultoptions = theme.draw_xy_web;
        this.options = {};
        // this.options = extend(this.defaultoptions, options);
        this.options = extend(this.defaultTheme, this.options, this.defaultoptions, options);

        // 图表容器
        this.container = document.getElementById(options.container);
        // 图表加载完成事件
        this.onChartLoaded = options.onChartLoaded == undefined ? function(op) {

        } : options.onChartLoaded;

    }

    // 初始化
    ChartTime.prototype.init = function() {

        this.options.type = "TL";
        var canvas = document.createElement("canvas");
        // 去除画布上粘贴效果
        // this.container.style = "-moz-user-select:none;-webkit-user-select:none;";
        // this.container.setAttribute("unselectable","on");
        this.container.style.position = "relative";
        // 画布
        try {
            var ctx = canvas.getContext('2d');
        } catch (error) {
            canvas = window.G_vmlCanvasManager.initElement(canvas);
            var ctx = canvas.getContext('2d');
        }
        this.options.canvas = canvas;
        this.options.context = ctx;
        // 设备像素比
        var dpr = this.options.dpr;

        // 容器中添加画布
        this.container.appendChild(canvas);

        // 画布的宽和高
        canvas.width = this.options.width * dpr;
        canvas.height = this.options.height * dpr;
        // 画布向下偏移的距离
        this.options.canvas_offset_top = canvas.height / 8;
        // 行情图表（分时图或K线图）和成交量图表的间距
        this.options.k_v_away = canvas.height / 8;
        // 缩放默认值
        this.options.scale_count = 0;
        // 画布上第一个图表的高度
        this.options.c_1_height = canvas.height * 0.5;

        canvas.style.width = this.options.width + "px";
        canvas.style.height = this.options.height + "px";
        canvas.style.border = "0";

        // 画布上部内间距
        ctx.translate("0", this.options.canvas_offset_top);
        // 画笔参数设置
        ctx.font = (this.options.font_size * this.options.dpr) + "px Arial";
        ctx.lineWidth = 1 * this.options.dpr;
        ctx.strokeStyle = 'rgba(230,230,230, 1)';

        this.options.padding = {};
        this.options.padding.left = ctx.measureText("10000").width + 20;
        this.options.padding.right = ctx.measureText("10000").width;
        this.options.padding.top = 0;
        this.options.padding.bottom = 0;


    };

    // 绘图
    ChartTime.prototype.draw = function(callback) {
        // 删除canvas画布
        this.clear();
        // 初始化
        this.init();
        // 初始化交互
        var inter = this.options.interactive = new Interactive(this.options);
        // 显示loading效果
        inter.showLoading();
        var _this = this;
        try {

            GetDataTime(this.options.code,
                function(data) {

                    if (data) {
                        dataCallback.apply(_this, [data]);
                    } else {
                        dataCallback.apply(_this, [
                            []
                        ]);
                    }
                    /*绑定事件*/
                    bindEvent.call(_this, _this.options.context);
                    // 传入的回调函数
                    if (callback) {
                        callback();
                    }

                }, inter);

        } catch (e) {
            // 暂无数据
            inter.showNoData();
            // 隐藏loading效果
            inter.hideLoading();
        }

    };
    // 重绘
    ChartTime.prototype.reDraw = function() {
            // 删除canvas画布
            this.clear();
            // 初始化
            this.init();
            dataCallback.call(this);
        }
        /*删除canvas画布*/
    ChartTime.prototype.clear = function(cb) {
            if (this.container) {
                this.container.innerHTML = "";
            } else {
                document.getElementById(this.options.container).innerHTML = "";
            }
            if (cb) {
                cb();
            };
        }
        /*回调函数*/
    function dataCallback(data) {

        this.options.data = data == undefined ? this.options.data : data;

        // 图表交互
        var inter = this.options.interactive;

        try {
            if (!data || !data.data || data.data.length == 0) {
                // 隐藏loading效果
                // inter.hideLoading();
                // 暂无数据
                // inter.showNoData();
                // return;
            }

            // 保留的小数位
            this.options.pricedigit = data.pricedigit;
            // 获取单位绘制区域
            var rect_unit = common.get_rect.apply(this, [this.options.context.canvas, this.options.data.total]);
            this.options.rect_unit = rect_unit;

            // 绘制坐标轴
            new DrawXY(this.options);
            //绘制分时图
            draw_line.call(this);
            //绘制平均成本线
            draw_avg.call(this);
            //绘制交易量
            draw_v.call(this);
            // 隐藏loading效果
            inter.hideLoading();
            // 图表加载完成时间
            this.onChartLoaded(this);

        } catch (e) {
            // 暂无数据
            // inter.showNoData();
            // 隐藏loading效果
            inter.hideLoading();
        }

        // 加水印
        watermark.apply(this, [this.options.context, 170, 20 - this.options.canvas.height / 8]);

        return true;
    }

    // 绑定事件
    function bindEvent(ctx) {
        var _this = this;
        var timer_s, timer_m;
        var canvas = ctx.canvas;
        var inter = this.options.interactive;

        var delayed = false;
        var delaytouch = this.options.delaytouch = true;;

        // if(!delaytouch){
        common.addEvent.call(_this, canvas, "mousemove", function(event) {
            dealEvent.apply(_this, [inter, event]);
            try {
                event.preventDefault();
            } catch (e) {
                event.returnValue = false;
            }
        });

        common.addEvent.call(_this, canvas, "mouseleave", function(event) {
            inter.hide();
            try {
                event.preventDefault();
            } catch (e) {
                event.returnValue = false;
            }
        });

        common.addEvent.call(_this, canvas, "mouseenter", function(event) {
            dealEvent.apply(_this, [inter, event]);
            try {
                event.preventDefault();
            } catch (e) {
                event.returnValue = false;
            }
        });

        // }

    }
    // 处理交互事件
    function dealEvent(inter, eventposition) {
        inter.show();
        // 画布对象
        var canvas = this.options.canvas;
        // 分时行情数据
        var time_data = this.options.data.data;
        // 单位绘制区域
        var rect_unit = this.options.rect_unit;
        // 单位绘图区域的宽度
        var rect_w = rect_unit.rect_w;
        // K线柱体的宽度
        // var bar_w = rect_unit.bar_w;
        // 鼠标事件位置
        var w_x = eventposition.offsetX || (eventposition.clientX - this.container.getBoundingClientRect().left);
        var w_y = eventposition.offsetY || (eventposition.clientY - this.container.getBoundingClientRect().top);

        // 鼠标在画布中的坐标
        var c_pos = common.windowToCanvas.apply(this, [canvas, w_x, w_y]);
        var c_x = (c_pos.x).toFixed(0);
        // var c_y = (c_pos.y).toFixed(0);

        // 当前点在数组中的下标
        var index = Math.floor((c_x - this.options.padding.left) / rect_w);

        if (time_data[index]) {
            // Tip显示行情数据
            inter.showTip(canvas, w_x, time_data[index]);
            // 显示十字指示线的
            var cross = common.canvasToWindow.apply(this, [canvas, time_data[index].cross_x, time_data[index].cross_y]);
            var cross_w_x = cross.x;
            var cross_w_y = cross.y;
            inter.cross(canvas, cross_w_x, cross_w_y);
        }

    }
    //绘制分时图折线
    function draw_line() {
        var ctx = this.options.context;
        var data = this.options.data;
        var data_arr = data.data;

        drawStroke.apply(this, [ctx, data_arr]);
        drawFill.apply(this, [ctx, data_arr]);

        /*绘制分时线*/
        function drawStroke(ctx, data_arr) {
            ctx.beginPath();
            ctx.strokeStyle = "#639EEA";

            var arrs = [];
            for (var i = 0, item; item = data_arr[i]; i++) {
                var point = {};
                var x = common.get_x.call(this, i + 1);
                var y = common.get_y.call(this, item.price);
                ctx.lineTo(x, y);
                item.cross_x = x;
                item.cross_y = y;
            }
            ctx.stroke();
        }
        /*分时线填充渐变色*/
        function drawFill(ctx, data_arr) {
            var y_min = common.get_y.call(this, this.options.data.min);
            /* 指定渐变区域 */
            var grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            /* 指定几个颜色 */
            grad.addColorStop(0, 'rgba(200,234,250,0.7)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            var data_arr_length = data_arr.length;

            ctx.beginPath();
            ctx.fillStyle = grad;
            ctx.moveTo(this.options.padding.left, y_min);
            for (var i = 0, item; item = data_arr[i]; i++) {
                var x = common.get_x.call(this, i + 1);
                var y = common.get_y.call(this, item.price);
                if (i == data_arr_length - 1) {
                    ctx.lineTo(x, y_min);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.fill();
        }

    }
    //绘制平均成本
    function draw_avg() {
        var ctx = this.options.context;
        var data = this.options.data;
        ctx.save();
        this.options.avg_cost_color = theme.draw_line.avg_cost_color;
        var color = this.options.avg_cost_color;
        var data_arr = data.data;
        // var w = this.options.width - 30;
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        ctx.fillStyle = '';
        for (var i = 0; i < data_arr.length; i++) {
            var x = common.get_x.call(this, i + 1);
            var y = common.get_y.call(this, data_arr[i].avg_cost);
            if (i == 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        ctx.restore();
    }

    //绘制成交量
    function draw_v() {

        var that = this;
        drawVTime.call(that);
        /*绘制分时图成交量*/
        function drawVTime() {
            if (this.options.type == "TL") {
                this.options.data.v_max = getVMax(this.options.data);
            }
            var ctx = this.options.context;
            var data = this.options.data;
            /*成交量数组*/
            var data_arr = data.data;
            /*Y轴上的最大值*/
            // var y_max = data.max;
            /*Y轴上的最小值*/
            // var y_min = data.min;
            /*最大成交量*/
            var v_max = (data.v_max).toFixed(0);

            /*K线图表的高度*/
            // var c_1_height = this.options.c_1_height;
            //成交量图表的高度
            // var v_height = ctx.canvas.height - c_1_height - this.options.k_v_away - this.options.canvas_offset_top;
            var v_height = ctx.canvas.height / 4;

            var v_base_height = v_height * 0.9;
            var y_v_bottom = ctx.canvas.height - this.options.canvas_offset_top;
            var y_v_top = y_v_bottom - v_height;
            /*获取单位矩形对象*/
            var rect_unit = this.options.rect_unit;
            /*单位绘图矩形画布的宽度*/
            // var rect_w = rect_unit.rect_w;
            /*K线柱体的宽度*/

            var bar_w = rect_unit.bar_w;
            /*K线柱体的颜色*/
            var up_color = this.options.up_color;
            var down_color = this.options.down_color;
                //标识最大成交量
            ctx.beginPath();
            ctx.strokeStyle = '#999';
            var padding_left = this.options.padding.left;
            var padding_right = this.options.padding.right;

            //写字
            for (var i = 0; i < 3; i++) {
                ctx.fillText(common.format_unit(Math.floor(v_max / 3 * (3 - i))), 0, y_v_top + v_height / 3 * i + 10);
                if (i != 0) {
                    draw_dash(ctx, padding_left, y_v_top + v_height / 3 * i, ctx.canvas.width - padding_right, y_v_top + v_height / 3 * i, 5);
                }
            }
            ctx.strokeStyle = 'rgba(230,230,230, 1)';
            ctx.lineWidth = this.options.dpr;
            ctx.rect(this.options.padding.left, y_v_top, ctx.canvas.width - this.options.padding.left - 2 - this.options.padding.right, v_height);
            ctx.stroke();
            for (var i = 0, item; item = data_arr[i]; i++) {
                var volume = item.volume;
                var is_up = item.up;
                var bar_height = volume / v_max * v_base_height;
                var x = common.get_x.call(this, i + 1);
                var y = y_v_bottom - bar_height;

                ctx.beginPath();
                ctx.moveTo(x, y);

                if (i == 0) {
                    if (is_up) {
                        ctx.fillStyle = up_color;
                        ctx.strokeStyle = up_color;
                    } else {
                        ctx.fillStyle = down_color;
                        ctx.strokeStyle = down_color;
                    }
                } else {
                    if (item.price >= data_arr[i - 1].price) {
                        ctx.fillStyle = up_color;
                        ctx.strokeStyle = up_color;
                    } else {
                        ctx.fillStyle = down_color;
                        ctx.strokeStyle = down_color;
                    }
                }

                ctx.rect(x - bar_w / 2, y, bar_w, bar_height);
                ctx.stroke();
                ctx.fill();
            }

        }
        // 获取最大成交量
        function getVMax(data) {
            if (data.data[0]) {
                var max = data.data[0].volume;
            } else {
                var max = 0;
            }

            for (var i = 0, item = data.data; i < data.data.length; i++) {
                if (max < item[i].volume) {
                    max = item[i].volume;
                }
            }
            return max
        }
    }


    return ChartTime;
})();

module.exports = ChartTime;