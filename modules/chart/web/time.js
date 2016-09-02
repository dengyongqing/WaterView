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

        this.options.chartType = "TL";
        var canvas = document.createElement("canvas");

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
        this.options.c_k_height = this.options.c_1_height = canvas.height * 0.5;

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
        var param = {
            code: this.options.code,
            type: this.options.type,
            isCR: this.options.isCR
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
        var currentIndex = this.options.data.data.length-1;
        var currentMinute = (new Date()).getMinutes();
        var timer = this.options.intervalTimer;
        var _this = this;
        if(timer)
            clearInterval(timer);
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
            currentIndex = _this.options.data.data.length-1;
            if(tempMinute != currentMinute && flag){
                console.log("绘制");
                currentMinute = tempMinute;
                drawContinuePoint.call(_this);
            }
        }, 500*60);

        function drawContinuePoint() {
            var _this = this;
            var currentMax = _this.options.data.max;
            var currentMin = _this.options.data.min;
            var currentVMax = _this.options.data.v_max;
            var param = {
                code: _this.options.code,
                type: _this.options.type,
                isCR: _this.options.isCR
            };
            GetDataTime(param, function(error, data){
                if(error){
                    _this.options.interactive.showNoData();
                }else{
                    var max = data.max;
                    var min = data.min;
                    var v_max = data.v_max;
                    // debugger;
                    if(max > currentMax || min < currentMin || v_max < currentVMax){
                        allRePaint.call(_this, data);
                    }else{
                        addPoint.call(_this, data);
                    }
                    _this.options.interactive.showTipsTime(0, 0, data.data, data.data.length - 1);
                }
            });
        }

        function allRePaint(data){
            this.clear();
            this.options.data = data;
            dataCallback.apply(this, [data]);
        }

        function addPoint(data){
            var ctx = this.options.context;

            addAvgLine.call(this, ctx, data, currentIndex);
            addPriceLine.call(this, ctx, data, currentIndex);
            addVolume.call(this, ctx, data, currentIndex);
            this.options.data = data;
        }

        function addAvgLine(ctx, data, currentIndex){
            var x1 = common.get_x.call(this, currentIndex);
            var y1 = common.get_y.call(this, data.data[currentIndex].avg_cost);
            var x2 = common.get_x.call(this, data.data.length-1);
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
            var x1 = common.get_x.call(this, currentIndex);
            var y1 = common.get_y.call(this, data.data[currentIndex].price);
            var x2 = common.get_x.call(this, data.data.length-1);
            var y2 = common.get_y.call(this, data.data[data.data.length-1].price);
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
            var len = data.data.length;debugger;
            var v_height = ctx.canvas.height / 4;
            var v_base_height = v_height * 0.9;
            var x = common.get_x.call(this, len-1);;
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
            try{
                var ctx = this.options.context;
                ctx.clearRect(0,0,this.options.padding.left + this.options.drawWidth,this.options.canvas.height);
            }catch(e){
                this.container.innerHTML = "";
            }
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
            draw_positionChange.call(this);
            this.intervalDraw();
            // 隐藏loading效果
            inter.hideLoading();
            inter.showTipsTime(0, 0, data.data, data.data.length - 1);
            // 图表加载完成时间
            this.onChartLoaded(this);

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

        var delayed = false;

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
        // var c_y = (c_pos.y).toFixed(0);

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
            var ctx = this.options.context;
            var data = this.options.data;
            /*成交量数组*/
            var data_arr = data.data;
            /*最大成交量*/
            var v_max = (data.v_max).toFixed(0);

            var v_height = ctx.canvas.height / 4;

            var v_base_height = v_height * 0.9;
            var y_v_bottom = ctx.canvas.height - this.options.canvas_offset_top;
            var y_v_top = y_v_bottom - v_height;
            /*获取单位矩形对象*/
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
            ctx.fillStyle = "#666";
            for (var i = 0; i < 3; i++) {
                ctx.fillText(common.format_unit(Math.floor(v_max / 3 * (3 - i))), 10, y_v_top + v_height / 3 * i + 10);
                if (i != 0) {
                    draw_dash(ctx, padding_left, y_v_top + v_height / 3 * i, ctx.canvas.width - padding_right, y_v_top + v_height / 3 * i, 5);
                }
            }
            ctx.fill();
            ctx.strokeStyle = 'rgba(230,230,230, 1)';
            ctx.lineWidth = 1;
            ctx.rect(this.options.padding.left + 0.5, y_v_top - 0.5, ctx.canvas.width - this.options.padding.left - 2 - this.options.padding.right, v_height);
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
    }

    //绘制盘口异动的流程逻辑函数
    function draw_positionChange() {
        // debugger;
        //所有盘口移动的状态对应的图标

        var _that = this;
        var changeIconHeight = _that.options.canvas_offset_top+_that.options.c_1_height - 40;
        getChangePointData(this.options.code, function(error, data) {
            if (error) {} else {
                if (data[0].state === "false") {
                    return; }
                //分时数据
                var timeData_arr = _that.options.data.data;
                var timeIndex = (Math.floor(timeData_arr.length/242-1) > 0 ? Math.floor(timeData_arr.length/242-1) : 0) *242;
                //两个并行的循环，找到绘制盘口异动的点
                for (var i = data.length - 1; i >= 0; i--) {
                    var item = data[i].split(",");
                    //异动的相关信息
                    var positionChangeItem = {
                        changeTime : item[1],
                        changeName : item[2],
                        changeType : item[3],
                        changeInfo : item[4],
                        isProfit : item[5]
                    };

                    var changeTime = item[1];
                    var changeImg = "../modules/images/" + typeToImgMap(item[3]);
                    
                    for (; timeIndex < timeData_arr.length; timeIndex++) {
                        //如果检测到该时间点上有盘口异动，就绘制盘口异动图标
                        if (changeTime == _that.options.data.data[timeIndex].time) {
                            drawIcon(_that.container, common.get_x.call(_that, timeIndex + 1), changeIconHeight, changeImg, positionChangeItem)//绘制盘口异动
                            break;
                        }
                    }
                }
            }
        });

        //绘制盘口动态的图标,并且添加交互
        function drawIcon(container, x, y, imgUrl, info) {
            
            var img = document.createElement("img");
            img.setAttribute("src", imgUrl);
            img.style.position = "absolute";
            img.style.top = "100px";
            container.appendChild(img);
            img.style.left = x  + "px";
            img.style.top = y  + "px";
            img.title = info.changeName+":"+info.changeType+":"+info.changeInfo;

            common.addEvent(img, 'mouseover', function(e){console.log("hellow")});
        }

    }


    //一个类型图片的映射
    function typeToImgMap(type) {
        var img;
        switch (type) {
            case "火箭发射": img = "icom_08.gif"; break;
            case "快速下跌": img = "icom_11.gif"; break;
            case "封涨停板": img = "icom_41.gif"; break;
            case "封跌停板": img = "icom_43.gif"; break;
            case "机构买单": img = "icom_45.gif"; break;
            case "机构卖单": img = "icom_47.gif"; break;
            case "快速反弹": img = "icom_14.gif"; break;
            case "高台跳水": img = "icom_16.gif"; break;
            case "大笔买入": img = "icom_19.gif"; break;
            case "大笔卖出": img = "icom_21.gif"; break;
            case "有大买盘": img = "icom_23.gif"; break;
            case "有大卖盘": img = "icom_25.gif"; break;
            case "向上缺口": img = "icom_58.gif"; break;
            case "向下缺口": img = "icom_55.gif"; break;
            case "竟价上涨": img = "icom_27.gif"; break;
            case "竞价下跌": img = "icom_29.gif"; break;
            case "高开5日线": img = "icom_03.gif"; break;
            case "低开5日线": img = "icom_05.gif"; break;
            case "60日新高": img = "icom_32.gif"; break;
            case "60日新低": img = "icom_34.gif"; break;
            case "打开跌停板": img = "icom_50.gif"; break;
            case "打开涨停板": img = "icom_52.gif"; break;
            case "大幅上涨": img = "icom_36.gif"; break;
            case "大幅下跌": img = "icom_38.gif"; break;
        }

        return img;
    }

    return ChartTime;
})();

module.exports = ChartTime;
