/**
 * 绘制web分时图
 *
 */

// 绘制坐标轴
var DrawXY = require('chart/web/time/draw_xy');
// 主题
var theme = require('theme/default');
var common = require('tools/common'); 
// 获取分时图数据
var GetDataTime = require('getdata/mobile/chart_time'); 
// 绘制分时折线图
var DrawLine = require('chart/web/time/draw_line'); 
// 绘制分时折线图中的平均线
var DrawAvgCost = require('chart/web/time/draw_avg'); 
// 绘制成交量图
var DrawV = require('chart/web/time/draw_v');
// 工具
var common = require('tools/common'); 
// 拓展，合并，复制
var extend = require('tools/extend');
// 交互效果
var Interactive = require('interactive/interactive'); 
// 水印
var watermark = require('chart/watermark');

var ChartTime = (function() {

    // 构造函数
    function ChartTime(options) {
        this.defaultoptions = theme.chartTime;
        this.options = {};
        // this.options = extend(this.defaultoptions, options);
        extend(true, this.options, theme.defaulttheme, this.defaultoptions, options);

        // 图表容器
        this.container = document.getElementById(options.container);
        // 图表加载完成事件
        this.onChartLoaded = options.onChartLoaded == undefined ? function(op){

        }:options.onChartLoaded;
        
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
        var ctx = canvas.getContext('2d');
        this.options.canvas = canvas;
        this.options.context = ctx;
        // 设备像素比
        var dpr = this.options.dpr;
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
        ctx.translate("0",this.options.canvas_offset_top);
        // 画笔参数设置
        ctx.font = (this.options.font_size * this.options.dpr) + "px Arial";
        ctx.lineWidth = 1 * this.options.dpr + 0.5;

        this.options.padding = {};
        this.options.padding.left = ctx.measureText("10000").width + 20;
        this.options.padding.right = 0;
        this.options.padding.top = 0;
        this.options.padding.bottom = 0;
        
        // 容器中添加画布
        this.container.appendChild(canvas);
        
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
        try{
            
            GetDataTime(this.options.code,
                function(data){
                    if(data){
                        dataCallback.apply(_this,[data]);
                    }else{
                        dataCallback.apply(_this,[[]]);
                    }
                    /*绑定事件*/
                    bindEvent.call(_this,_this.options.context);
                    // 传入的回调函数
                    if(callback){
                        callback();
                    }
                    
                },inter);

        }catch(e){
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
        if(this.container){
            this.container.innerHTML = "";
        }else{
            document.getElementById(this.options.container).innerHTML = "";
        }
        if (cb) {
            cb();
        };
    }
    /*回调函数*/
    function dataCallback(data){

        this.options.data = data == undefined ? this.options.data : data;

        // 图表交互
        var inter = this.options.interactive;

        try{
            if(!data || !data.data || data.data.length == 0){
                // 隐藏loading效果
                // inter.hideLoading();
                // 暂无数据
                // inter.showNoData();
                // return;
            }

            // 保留的小数位
            this.options.pricedigit = data.pricedigit;
            // 获取单位绘制区域
            var rect_unit = common.get_rect.apply(this,[this.options.context.canvas,this.options.data.total]);
            this.options.rect_unit = rect_unit;

            // 绘制坐标轴
            new DrawXY(this.options);
            // 绘制分时折线图
            new DrawLine(this.options);
            // 绘制分时折线图平均线
            new DrawAvgCost(this.options);
            // 绘制分时图成交量
            new DrawV(this.options);
            // 隐藏loading效果
            inter.hideLoading();
            // 图表加载完成时间
            this.onChartLoaded(this);

        }catch(e){
            // 暂无数据
            // inter.showNoData();
            // 隐藏loading效果
            inter.hideLoading();
        }
        
        // 加水印
        watermark.apply(this,[this.options.context,170,20 - this.options.canvas.height / 8]);

        return true;
    }

    // 绑定事件
    function bindEvent(ctx){
        var _this = this;
        var timer_s,timer_m;
        var canvas = ctx.canvas;
        var inter = this.options.interactive;

        var delayed = false;
        var delaytouch = this.options.delaytouch = true;;

        // 触摸事件
        canvas.addEventListener("touchstart",function(event){
            // 显示交互效果
            if(delaytouch){
                delayed = false;
                timer_s = setTimeout(function(){
                    delayed = true;
                    inter.show();
                    dealEvent.apply(_this,[inter,event.changedTouches[0]]);
                    event.preventDefault();
                },200);
            }else{
                inter.show();
                dealEvent.apply(_this,[inter,event.changedTouches[0]]);
            }

            if(_this.options.preventdefault){
                event.preventDefault();
            }

        });
        // 手指滑动事件
        canvas.addEventListener("touchmove",function(event){
            if(delaytouch){
                clearTimeout(timer_s);
                if(delayed){
                    dealEvent.apply(_this,[inter,event.changedTouches[0]]);
                    event.preventDefault();
                }
            }else{
                dealEvent.apply(_this,[inter,event.changedTouches[0]]);
            }
            
            if(_this.options.preventdefault){
                event.preventDefault();
            }

        });
         // 手指离开事件
        canvas.addEventListener("touchend",function(event){
            if(delaytouch){
                clearTimeout(timer_s);
            }
            // 隐藏交互效果
            inter.hide();
            if(_this.options.preventdefault){
                event.preventDefault();
            }

        });

        canvas.addEventListener("touchcancel",function(event){
            if(delaytouch){
                clearTimeout(timer_s);
                // delay.style.display = "none";
            }
            // 隐藏交互效果
            inter.hide();
            if(_this.options.preventdefault){
                event.preventDefault();
            }
        });


        // if(!delaytouch){
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
                dealEvent.apply(_this,[inter,event]);
                inter.show();
                event.preventDefault();
            });

        // }
        
    }
    // 处理交互事件
    function dealEvent(inter,eventposition){
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
        var c_pos = common.windowToCanvas.apply(this,[canvas,w_x,w_y]);
        var c_x = (c_pos.x).toFixed(0);
        // var c_y = (c_pos.y).toFixed(0);

        // 当前点在数组中的下标
        var index = Math.floor((c_x - this.options.padding_left)/rect_w);

        if(time_data[index]){
            // Tip显示行情数据
            inter.showTip(canvas,w_x,time_data[index]);

            // 显示十字指示线的
            var cross = common.canvasToWindow.apply(this,[canvas,time_data[index].cross_x,time_data[index].cross_y]);
            var cross_w_x = cross.x;
            var cross_w_y = cross.y;
            inter.cross(canvas,cross_w_x,cross_w_y);
        }

    }

    return ChartTime;
})();

module.exports = ChartTime;
