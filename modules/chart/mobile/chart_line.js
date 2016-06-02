/**
 * 绘制手机K线图
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
var DrawXY = require('chart/draw_xy');
// 主题
var theme = require('theme/default');
// 获取K线图数据
var GetDataDay = require('getdata/mobile/chart_day'); 
var GetDataWeek = require('getdata/mobile/chart_week'); 
var GetDataMonth = require('getdata/mobile/chart_month'); 
// 绘制K线图
var DrawK = require('chart/draw_k'); 
// 绘制均线图
var DrawMA = require('chart/draw_ma'); 
// 绘制成交量图
var DrawV = require('chart/draw_v'); 
// 工具
var common = require('tools/common'); 
// 交互效果
var Interactive = require('interactive/interactive'); 
// 拓展，合并，复制
var extend = require('tools/extend');
// 水印
var watermark = require('chart/watermark');
// 缩放
var Scale = require('interactive/scale'); 

var ChartLine = (function() {

    function ChartLine(options) {
        this.defaultoptions = theme.chart_k;
        this.options = {};
        extend(true, this.options, theme.default, this.defaultoptions, options);

        // 图表容器
        this.container = document.getElementById(options.container);
        // 图表加载完成事件
        this.options.onChartLoaded = options.onChartLoaded == undefined ? function(op){

        }:options.onChartLoaded;
    }

    /*初始化*/
    ChartLine.prototype.init = function() {
        var type = this.options.type = this.options.type == undefined ? "DK" : this.options.type;
        var canvas = document.createElement("canvas");
        // 去除画布上粘贴效果
        this.container.style = "-moz-user-select:none;-webkit-user-select:none;";
        this.container.style.position = "relative";
        this.container.setAttribute("unselectable","on");
        // 画布
        var ctx = canvas.getContext('2d');
        this.options.canvas = canvas;
        this.options.context = ctx;
        // 第一个图表的高度占画布高度比例
        var c_1_percent = this.options.c_1_percent;
        // 设备像素比
        var dpr = this.options.dpr;
        // 画布的宽和高
        canvas.width = this.options.width * dpr;
        canvas.height = this.options.height * dpr;

        // 画布向下偏移的距离
        this.options.canvas_offset_top = canvas.height / 8;
        // 画布内容向坐偏移的距离
        this.options.padding_left = theme.default.padding_left * dpr;
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
        ctx.translate("0",this.options.canvas_offset_top);
        // 画笔参数设置
        ctx.font = (this.options.font_size * this.options.dpr) + "px Arial";
        ctx.lineWidth = 1 * this.options.dpr;
       
        // 加水印
        watermark.apply(this,[ctx]);
        // 容器中添加画布
        this.container.appendChild(canvas);
    };

    // 绘图
    ChartLine.prototype.draw = function(callback) {
        var _this = this;
        // 删除canvas画布
        _this.clear();
        // 初始化
        _this.init();

        // 初始化交互
        var inter = _this.options.interactive = new Interactive(_this.options);
        // 显示loading效果
        inter.showLoading();

        var type = _this.options.type;
        if(type == "DK"){
            GetDataDay(getParamsObj.call(_this),function(data){
                dataCallback.apply(_this,[data]);
                // 均线数据标识
                inter.markMA(_this.options.canvas);
                // 缩放
                inter.scale(_this.options.canvas);
                // 绑定事件
                bindEvent.call(_this,_this.options.context);
                // 传入的回调函数
                if(callback){
                    callback(_this.options);
                }
            });
        }else if(type == "WK"){
            GetDataWeek(getParamsObj.call(_this),function(data){
                dataCallback.apply(_this,[data]);
                // 均线数据标识
                inter.markMA(_this.options.canvas);
                // 缩放
                inter.scale(_this.options.canvas);
                // 绑定事件
                bindEvent.call(_this,_this.options.context);
                // 传入的回调函数
                if(callback){
                    callback(_this.options);
                }
            });
        }else if(type == "MK"){
            GetDataMonth(getParamsObj.call(_this),function(data){
                dataCallback.apply(_this,[data]);
                // 均线数据标识
                inter.markMA(_this.options.canvas);
                // 缩放
                inter.scale(_this.options.canvas);
                // 绑定事件
                bindEvent.call(_this,_this.options.context);
                // 传入的回调函数
                if(callback){
                    callback(_this.options);
                }
            });
        }

    };
    // 重绘
    ChartLine.prototype.reDraw = function() {
        // 删除canvas画布
        this.clear();
        // 初始化
        this.init();
        dataCallback.call(this);
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

    // 获取上榜日标识dom
    ChartLine.prototype.getMarkPointsDom = function(cb) {
        var points =  this.options.interactive.options.pointsContainer.children;
        return points;
    }

    // 缩放图表
    function scaleClick() {
        var _this = this;
        var type = _this.options.type;

        try{
            if(type == "DK"){
                GetDataDay(getParamsObj.call(_this),function(data){
                    if(data){
                        dataCallback.apply(_this,[data]);
                        // 缩放按钮点击有效
                        _this.options.clickable = true;
                    }
                });
            }else if(type == "WK"){
                GetDataWeek(getParamsObj.call(_this),function(data){
                    if(data){
                        dataCallback.apply(_this,[data]);
                        // 缩放按钮点击有效
                        _this.options.clickable = true;
                    }
                });
            }else if(type == "MK"){
                GetDataMonth(getParamsObj.call(_this),function(data){
                    if(data){
                        dataCallback.apply(_this,[data]);
                        // 缩放按钮点击有效
                        _this.options.clickable = true;
                    }
                });
            }

        }catch(e){
            // 缩放按钮点击有效
            _this.options.clickable = true;
        }
        
        // 加水印
        watermark.apply(_this,[_this.options.context]);
    };

    // 获取参数对象
    function getParamsObj(){
        var obj = {};
        obj.code = this.options.code;
        obj.count = this.options.scale_count;
        return obj;
    }
    // 回调函数
    function dataCallback(data){
        var ctx = this.options.context;
        var canvas = ctx.canvas;
        this.options.data = data == undefined ? this.options.data : data;
        data = this.options.data;

        // 图表交互
        var inter = this.options.interactive;

        // 默认显示均线数据
        var five_average = data.five_average;
        var ten_average = data.ten_average;
        var twenty_average = data.twenty_average;
        inter.default_m5 = five_average[five_average.length - 1];
        inter.default_m10 = ten_average[ten_average.length - 1];
        inter.default_m20 = twenty_average[twenty_average.length - 1];

        // 获取单位绘制区域
        var rect_unit = common.get_rect.apply(this,[canvas,data.data.length]);
        this.options.rect_unit = rect_unit;

        // 绘制坐标轴
        new DrawXY(this.options);
        // 绘制日K线图
        new DrawK(this.options);
        // 绘制均线图
        new DrawMA(this.options);
        // 绘制成交量图
        new DrawV(this.options);

        // 上榜日标识点
        if(this.options.interactive.options.pointsContainer){
            var points =  this.options.interactive.options.pointsContainer.children;
            this.markPointsDom = points;
        }

        // 隐藏loading效果
        inter.hideLoading();
        // 图表加载完成时间
        this.options.onChartLoaded(this);
       
    }
    // 绑定事件
    function bindEvent(ctx){
        var _this = this;
        var timer_s,timer_m,timer_e;
        var canvas = ctx.canvas;
        var inter = _this.options.interactive;
        //缩放按钮是否可点击
        this.options.clickable = true;

        // 触摸事件
        canvas.addEventListener("touchstart",function(event){
            // 显示交互效果
            inter.show();
            dealEvent.apply(_this,[inter,event.changedTouches[0]]);
            event.preventDefault();
        });

        
        // 手指滑动事件
        canvas.addEventListener("touchmove",function(event){
            // dealEvent.apply(_this,[inter,event]);
            dealEvent.apply(_this,[inter,event.changedTouches[0]]);
            event.preventDefault();
        });

        // 手指离开事件
        canvas.addEventListener("touchend",function(event){
            // 隐藏交互效果
            inter.hide();
            event.preventDefault();
        });


        canvas.addEventListener("mousemove",function(event){
            //console.info(event);
            dealEvent.apply(_this,[inter,event]);
            event.preventDefault();
        });

        canvas.addEventListener("mouseleave",function(event){
            //console.info(event);
            inter.hide();
            event.preventDefault();
        });

        canvas.addEventListener("mouseenter",function(event){
            //console.info(event);
            inter.show();
            event.preventDefault();
        });

        // 放大按钮
        var scale_plus = inter.options.scale.plus;
        // 缩小按钮
        var scale_minus = inter.options.scale.minus;

        // 点击放大
        scale_plus.addEventListener("click",function(event){
            var scale_count = _this.options.scale_count;
            if(scale_count < 2 && _this.options.clickable){
                // 缩放按钮点击无效
                _this.options.clickable = false;
                scale_minus.style.opacity = "1";
                _this.options.scale_count = scale_count + 1;

                // 清除上榜日标识
                if(_this.options.interactive.options.pointsContainer){
                    _this.options.interactive.options.pointsContainer.innerHTML = "";
                }
                // 清空画布
                ctx.clearRect(0,-_this.options.canvas_offset_top,canvas.width,canvas.height);
                scaleClick.apply(_this);
            }

            if(_this.options.scale_count >= 2){
                scale_plus.style.opacity = "0.5";
            }
            
        });

        // 点击缩小
        scale_minus.addEventListener("click",function(event){
            var scale_count = _this.options.scale_count;
            if(scale_count > -2 && _this.options.clickable){
                // 缩放按钮点击无效
                _this.options.clickable = false;
                scale_plus.style.opacity = "1";
                _this.options.scale_count = scale_count - 1;

                // 清除上榜日标识
                if(_this.options.interactive.options.pointsContainer){
                    _this.options.interactive.options.pointsContainer.innerHTML = "";
                }
                // 清空画布
                ctx.clearRect(0,-_this.options.canvas_offset_top,canvas.width,canvas.height);
                scaleClick.apply(_this);
            }

            if(_this.options.scale_count <= -2){
                scale_minus.style.opacity = "0.5";
            }
            
        });

    }
    // 图表交互
    function dealEvent(inter,eventposition){

        var canvas = this.options.canvas;

        var k_data = this.options.data.data;
        var ma_5_data = this.options.data.five_average;
        var ma_10_data = this.options.data.ten_average;
        var ma_20_data = this.options.data.twenty_average;

        // 单位绘制区域
        var rect_unit = this.options.rect_unit;
        // 单位绘制区域的宽度
        var rect_w = rect_unit.rect_w;
        // K线柱体的宽度
        var bar_w = rect_unit.bar_w;

        // 鼠标事件位置
        // var w_x = eventposition.clientX;
        // var w_y = eventposition.clientY;

        var w_x = eventposition.offsetX || (eventposition.clientX - this.container.getBoundingClientRect().left);
        var w_y = eventposition.offsetY || (eventposition.clientY - this.container.getBoundingClientRect().top);

        // 鼠标在画布中的坐标
        var c_pos = common.windowToCanvas.apply(this,[canvas,w_x,w_y]);
        var c_x = (c_pos.x).toFixed(0);
        var c_y = (c_pos.y).toFixed(0);

        // 当前K线在数组中的下标
        var index = Math.floor((c_x - this.options.padding_left)/rect_w);

        if(k_data[index]){
            // 显示行情数据
            inter.showTip(canvas,w_x,k_data[index]);
            
            // 显示十字指示线的
            var cross = common.canvasToWindow.apply(this,[canvas,k_data[index].cross_x,k_data[index].cross_y]);
            var cross_w_x = cross.x;
            var cross_w_y = cross.y;
            inter.cross(canvas,cross_w_x,cross_w_y);
        }

        if(ma_5_data[index]){
             // 标识均线数据
             inter.markMA(canvas,ma_5_data[index],ma_10_data[index],ma_20_data[index]);
        }

    }

    return ChartLine;
})();

module.exports = ChartLine;
