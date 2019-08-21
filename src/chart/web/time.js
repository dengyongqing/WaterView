/**
 * 绘制web分时图
 *
 */

// 绘制坐标轴
var DrawXY = require('chart/web/time/draw_xy');
// 主题
var theme = require('theme/default');
// 获取分时图数据
var GetDataTime = require('getdata/web/chart_time');
var getChangePointData = require('getdata/web/getPositionChangeData');
// 工具
var common = require('chart/web/common/common');
var draw_dash = require('chart/web/common/draw_dash_line');
// 拓展，合并，复制
var extend = require('tools/extend2');
// 交互效果
var Interactive = require('chart/web/time/interactive');
// 水印
var watermark = require('chart/watermark');
var drawPositionChange = require('chart/web/time/drawPositionChange');

var ChartTime = (function() {

    // 构造函数
    function ChartTime(options) {
        this.defaultoptions = theme.draw_xy_web;
        this.options = {};
        // this.options = extend(this.defaultoptions, options);
        this.options = extend(this.defaultTheme, this.options, this.defaultoptions, options);

        // 图表容器
        this.container = document.getElementById(options.container);

        this.container.className = this.container.className.replace(/emcharts-container/g, "").trim();
        this.container.className = this.container.className + " emcharts-container";
        // 图表加载完成事件
        this.onChartLoaded = options.onChartLoaded == undefined ? function(op) {

        } : options.onChartLoaded;

    }

    // 初始化
    ChartTime.prototype.init = function() {

        this.options.chartType = "TL";
        var canvas = document.createElement("canvas");

        this.container.style.position = "relative";
        // 容器中添加画布
        this.container.appendChild(canvas);
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


        // 画布的宽和高
        canvas.width = this.options.width * dpr;
        canvas.height = this.options.height * dpr;

        this.options.y_sepe_num = 13;
        // 画布向下偏移的距离
        this.options.canvas_offset_top = canvas.height / this.options.y_sepe_num;
        // 行情图表（分时图或K线图）和成交量图表的间距
        this.options.k_v_away = canvas.height / this.options.y_sepe_num;
        // 缩放默认值
        this.options.scale_count = 0;
        // 画布上第一个图表的高度
        this.options.c_k_height = this.options.c_1_height = canvas.height * 8/this.options.y_sepe_num;
        this.options.c_v_height = canvas.height * 3/this.options.y_sepe_num;
        this.options.unit_height =  canvas.height * 1/this.options.y_sepe_num;
        this.options.c1_y_top = canvas.height * 1 / this.options.y_sepe_num;
        this.options.c2_y_top = canvas.height * 9 / this.options.y_sepe_num;

        canvas.style.width = this.options.width + "px";
        canvas.style.height = this.options.height + "px";
        canvas.style.border = "0";

        // 画布上部内间距
        ctx.translate("0", Math.round(this.options.canvas_offset_top));
        // 画笔参数设置
        this.options.color = {};
        this.options.color.strokeStyle = 'rgba(230,230,230, 1)';
        this.options.color.fillStyle = '#717171';
        ctx.fillStyle = this.options.color.fillStyle;
        ctx.font = "12px Arial";
        ctx.lineWidth = 1 * this.options.dpr;
        ctx.strokeStyle = 'rgba(230,230,230, 1)';

        this.options.padding = {};
        this.options.padding.left = ctx.measureText("10000").width + 20;
        this.options.padding.right = ctx.measureText("+10.00%").width;
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
        /*根据股票编码指示盘前*/
        var codeTypeNumber = this.options.code.charAt(this.options.code.length-1);
        if(codeTypeNumber == 7 || codeTypeNumber == 5){
            this.options.isCR = false;
        }
        var param = {
            code: this.options.code,
            type: this.options.type,
            isCR: !!this.options.isCR
        };
        try {
            GetDataTime(param,
                function(error, data) {
                    if (error) {
                        // 暂无数据
                        inter.showNoData();
                        // 隐藏loading效果
                        inter.hideLoading();
                    } else {
                        if (data) {
                            dataCallback.apply(_this, [data]);
                        } else {
                            dataCallback.apply(_this, [
                                []
                            ]);
                        }
                        /*绑定事件*/
                        bindEvent.call(_this, _this.options.context);
                    }
                });
        } catch (e) {
            // 暂无数据
            inter.showNoData();
            // 隐藏loading效果
            inter.hideLoading();
        }
        
    };

        /*持续绘图*/
    ChartTime.prototype.intervalDraw = function(){
        var currentIndex;
        var currentMinute = (new Date()).getMinutes();
        var timer = this.options.intervalTimer;
        var _this = this;
        if(timer){
            clearInterval(timer);
        }
        this.options.intervalTimer = setInterval(function(){
            var dateNow = new Date();
            var tempMinute = dateNow.getMinutes();
            var flag = true;
            if( dateNow.getHours() >= 15 && dateNow.getMinutes() >= 0){
                clearInterval(_this.options.intervalTimer);
                flag = false;
            }
            if(dateNow.getHours() <= 9 && dateNow.getMinutes() < 30 && _this.options.isCR === false){
                clearInterval(_this.options.intervalTimer);
                flag = false;
            }
            if(dateNow.getHours() <= 9 && dateNow.getMinutes() < 15 && _this.options.isCR === true){
                clearInterval(_this.options.intervalTimer);
                flag = false;
            }
            console.log("cur ");
            if(tempMinute !== currentMinute && flag){
                console.log("绘制");
                currentMinute = tempMinute;
                drawContinuePoint.call(_this);
            }
        }, 1000*10);

        function drawContinuePoint() {
            var _this = this;
            var currentMax = _this.options.data.max;
            var currentMin = _this.options.data.min;
            var currentVMax = _this.options.data.v_max;
            var param = {
                code: _this.options.code,
                type: _this.options.type,
                isCR: !!_this.options.isCR
            };
            GetDataTime(param, function(error, data){
                if(error){
                    _this.options.interactive.showNoData();
                }else{
                    currentIndex = data.data.length-2;
                    console.log("pre: "+_this.options.data.data.length-1);
                    console.log("cur: "+currentIndex);
                    console.log(data.data.length-1);
                    console.log(data);
                    var max = data.max;
                    var min = data.min;
                    var v_max = data.v_max;
                    // debugger;
                    _this.options.data = data;
                    if(max > currentMax || min < currentMin || v_max < currentVMax){
                        allRePaint.call(_this, data);
                    }else{
                        addPoint.call(_this, data);
                    }
                    currentIndex = _this.options.data.data.length-1;
                    console.log("in"+currentIndex);
                    // _this.options.interactive.showTipsTime(0, 0, data.data, data.data.length - 1);
                }
            });
        }

        function allRePaint(data){
            this.clear();
            dataCallback.apply(this, [data]);
        }

        function addPoint(data){
            var ctx = this.options.context;

            addAvgLine.call(this, ctx, data, currentIndex);
            addPriceLine.call(this, ctx, data, currentIndex);
            addVolume.call(this, ctx, data, currentIndex);
        }

        function addAvgLine(ctx, data, currentIndex){
            var x1 = common.get_x.call(this, currentIndex+1);
            var y1 = common.get_y.call(this, data.data[currentIndex].avg_cost);
            var x2 = common.get_x.call(this, data.data.length);
            var y2 = common.get_y.call(this, data.data[data.data.length-1].avg_cost);
            ctx.save();
            ctx.strokeStyle = "#F1CA15";
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2)
            ctx.stroke();
            ctx.restore();
        }

        function addPriceLine(ctx, data, currentIndex){
            var y_min = common.get_y.call(this, this.options.data.min);
            var x1 = common.get_x.call(this, currentIndex+1);
            var y1 = common.get_y.call(this, data.data[currentIndex].price);
            var x2 = common.get_x.call(this, data.data.length);
            var y2 = common.get_y.call(this, data.data[data.data.length-1].price);
            console.log("("+x1+","+y1+")");
            console.log("("+x2+","+y2+")");
            ctx.save();
            ctx.strokeStyle = "#639EEA";
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2)
            ctx.stroke();

            var grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            /* 指定几个颜色 */
            grad.addColorStop(0, 'rgba(200,234,250,0.7)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.beginPath();
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x2, y_min);
            ctx.lineTo(x1, y_min);
            ctx.lineTo(x1, y1)
            ctx.fill();
            ctx.restore();
        }

        function addVolume(ctx, data, currentIndex){
            var len = data.data.length;
            var v_height = ctx.canvas.height / 4;
            var v_base_height = v_height * 0.9;
            var x = common.get_x.call(this, len);;
            var bar_height = v_height*data.data[len-1].volume/data.v_max;
            var y = v_base_height - bar_height;
            var bar_w = this.options.rect_unit.bar_w;

            ctx.save();
            ctx.fillStyle = this.options.avg_cost_color;
            ctx.rect(x - bar_w / 2, y, bar_w, bar_height);
            ctx.restore();
        }

    }

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
            this.container.innerHTML = "";
        }
        /*回调函数*/
    function dataCallback(data) {

        this.options.data = data == undefined ? this.options.data : data;

        // 图表交互
        var inter = this.options.interactive;

        try {
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
            //绘制盘口动态
            if(this.options.type === "r"){
                draw_positionChange.call(this);
            }
            // this.intervalDraw();
            // 隐藏loading效果
            inter.hideLoading();
            inter.showTipsTime(this.options.padding.left, common.get_y.call(this, data.data[0].price), data.data, data.data.length - 1);
            // 图表加载完成时间
            this.onChartLoaded(this);
            watermark.apply(this,[this.options.context,95 + this.options.padding.right,10,82,20]);
        } catch (e) {
            // 暂无数据
            // inter.showNoData();
            // 隐藏loading效果
            inter.hideLoading();
            console.log(e);
        }

        return true;
    }

    // 绑定事件
    function bindEvent(ctx) {
        var _this = this;
        var canvas = ctx.canvas;
        var inter = this.options.interactive;
        var container = this.container;

        common.addEvent.call(_this, canvas, "touchmove",function(event){
            dealEvent.apply(_this,[inter,event.changedTouches[0]]);
            // dealEvent.apply(_this,[inter,event]);
            try {
                event.preventDefault();
            } catch (e) {
                event.returnValue = false;
            }
        });

        common.addEvent.call(_this, canvas, "mousemove", function(event) {
            dealEvent.apply(_this, [inter, event]);
            try {
                event.preventDefault();
            } catch (e) {
                event.returnValue = false;
            }
        });

        common.addEvent.call(_this, container, "mouseleave", function(event) {
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
        var w_x = (eventposition.clientX - this.container.getBoundingClientRect().left);
        var w_y = (eventposition.clientY - this.container.getBoundingClientRect().top);

        // 鼠标在画布中的坐标
        var c_pos = common.windowToCanvas.apply(this, [canvas, w_x, w_y]);
        var c_x = (c_pos.x * 1.0).toFixed(0);

        // 当前点在数组中的下标
        var index = Math.floor((c_x - this.options.padding.left) / rect_w);

        if (time_data[index]) {
            // 显示十字指示线的
            var cross = common.canvasToWindow.apply(this, [canvas, time_data[index].cross_x, time_data[index].cross_y]);
            var cross_w_x = cross.x;
            var cross_w_y = cross.y;
            inter.crossTime(canvas, cross_w_x, cross_w_y);
            /*显示交互数据*/
            inter.showTipsTime(cross_w_x, cross_w_y, time_data, index);
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
            ctx.strokeStyle = "#59A7FF";

            for (var i = 0, item; item = data_arr[i]; i++) {
                var x = common.get_x.call(this, i + 1);
                var y = common.get_y.call(this, item.price);
                if(i === 0){
                    ctx.moveTo(x, y);
                }else{
                    ctx.lineTo(x, y);
                }
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
                if (i === data_arr_length - 1) {
                    ctx.lineTo(x, y);
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
            var ctx = this.options.context;
            var data = this.options.data;
            /*成交量数组*/
            var data_arr = data.data;
            /*最大成交量*/
            var v_max = (data.v_max).toFixed(0);
            var unit_height = this.options.unit_height;

            var v_height = 3*unit_height;
            var v_base_height = v_height;
            var y_v_bottom = ctx.canvas.height - this.options.canvas_offset_top;

            var y_v_top = that.options.c2_y_top;            /*获取单位矩形对象*/
            var rect_unit = this.options.rect_unit;

            var bar_w = rect_unit.bar_w;
            /*K线柱体的颜色*/
            var up_color = this.options.up_color;
            var down_color = this.options.down_color;
            //标识最大成交量
            ctx.beginPath();
            ctx.strokeStyle = '#999';
            var padding_left = this.options.padding.left;
            var padding_right = this.options.padding.right;

            ctx.lineWidth = 1;
            //写字
            ctx.fillStyle = this.options.color.fillStyle;
            ctx.strokeStyle = 'rgba(230,230,230, 1)';
            for (var i = 0; i <= 3; i++) {
                var text = common.format_unit(Math.floor(v_max / 3 * (3 - i)));
                ctx.fillText(text, padding_left - ctx.measureText(text).width-5, y_v_top + (v_height / 3) * i);
                if (i != 0 && i!= 3) {
                    draw_dash(ctx, padding_left, Math.floor(y_v_top + v_height / 3 * i), ctx.canvas.width - padding_right+4, Math.floor(y_v_top + v_height / 3 * i), 5);
                }
            }
            ctx.fill();
            ctx.strokeStyle = 'rgba(230,230,230, 1)';
            ctx.lineWidth = 1;
            ctx.rect(this.options.padding.left - 0.5, Math.round(y_v_top), ctx.canvas.width - this.options.padding.left - this.options.padding.right, v_height);
            ctx.stroke();
            for (var i = 0, item; item = data_arr[i]; i++) {
                var volume = item.volume;
                var is_up = item.up;
                var bar_height = volume / v_max * v_base_height*0.95;
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
                if(bar_height !== 0){
                    ctx.rect(x - bar_w / 2, y, bar_w, bar_height);
                }
                ctx.stroke();
                ctx.fill();
            }

        }
    }

    //绘制盘口异动的流程逻辑函数
    function draw_positionChange() {
        // debugger;
        var _that = this;
        
        getChangePointData(this.options.code, function(error, data) {
            if (error) {} else {
                if (data[0].state === "false") {
                    return;
                }
                //进行盘口异动绘制
                drawPositionChange.call(_that, data);
            }
        });
    }

    return ChartTime;
})();

module.exports = ChartTime;
