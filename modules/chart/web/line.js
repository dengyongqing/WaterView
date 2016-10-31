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
var extend = require('tools/extend');
// 交互效果
var Interactive = require('interactive/interactive'); 
// 水印
var watermark = require('chart/watermark');

var ChartLine = (function() {

    // 构造函数
    function ChartLine(options) {
        this.defaultoptions = theme.chartLine;
        this.options = {};
        extend(true, this.options, theme.defaulttheme, this.defaultoptions, options);

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
        this.options.canvas_offset_top = canvas.height / (9 * 2);
        // 画布内容向坐偏移的距离
        this.options.padding_left = canvas.width / 6;

        // 行情图表（分时图或K线图）和成交量图表的间距
        this.options.k_v_away = canvas.height / (9 * 2);
        // 缩放默认值
        this.options.scale_count = 0;
        this.options.decimalCount = this.options.decimalCount == undefined ? 2 : this.options.decimalCount;
        // 画布上第一个图表的高度
        if(this.options.showflag){
            this.options.c_1_height = canvas.height * (5/9);
        }else{
            this.options.c_1_height = canvas.height * (7/9);
        }

        this.options.sepeNum = this.options.sepeNum == undefined ? 4 : this.options.sepeNum;
        if(this.options.sepeNum < 2){
            this.options.sepeNum = 2;
        }

        canvas.style.width = this.options.width + "px";
        canvas.style.height = this.options.height + "px";
        canvas.style.border = "0";

        // 画布上部内间距
        ctx.translate("0",this.options.canvas_offset_top);
        // 画笔参数设置
        ctx.font = (this.options.font_size * this.options.dpr) + "px Arial";
        ctx.lineWidth = 1 * this.options.dpr + 0.5;
        
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
        var ctx = this.options.context;
        // 显示loading效果
        // inter.showLoading();
        // var _this = this;

        // 折线数据
        var series = this.options.series;
        this.options.data = {};
        var maxAndMin = getMaxMark.call(this,series);

        this.options.data.max = maxAndMin.max;
        this.options.data.min = maxAndMin.min;
        this.options.padding_left = this.options.context.measureText("-1000万").width + 20;

        // 绘制坐标轴
        new DrawXY(this.options);
        // 绘制分时折线图
        new DrawLine(this.options);

        // 加水印
        watermark.apply(this,[ctx,190,20]);

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

    // 获取数组中的最大值
    function getMaxMark(series) {
        var max = 0,
            min = 0,
            maxDot = 0,
            dot = 0,
            seriesLength = series.length,
            tempObj = {};
        for (var i = 0; i < seriesLength; i++) {
            for (var j = 0; j < series[i].data.length; j++) {
                max = Math.max(max, series[i].data[j]);
                min = Math.min(min, series[i].data[j]);

                if(series[i].data[j].toString().split(".")[1]){
                    dot = series[i].data[j].toString().split(".")[1].length;
                    maxDot = Math.max(maxDot, dot);
                }
                
            }
        }

        // if (max < Math.abs(min)) {
        //     max = Math.abs(min);
        // } else {
        //     max = max;
        // }

        var sepeNum = this.options.sepeNum;

        if(min < 0){
            var step = (Math.abs(max) + Math.abs(min)) / sepeNum;
        }else{
            var step = Math.abs(max) / sepeNum;
        }
        
        var flag = false;
        if(step.toString().split(".")[1]){
            step = step.toFixed(maxDot);
            if(step < 1){
                step = step * Math.pow(10,maxDot);
                flag = true;
            }
            
        }

        // if(step < 1){
        //     var num = step.toString().split(".")[1].length * (-1);
        //     var base_step = Math.floor(step * Math.pow(10,(num + 1)* (-1))) * Math.pow(10,(num + 1));
        //     var middle_step = (base_step + Math.pow(10,(num + 1))/2);
        //     var next_step = (base_step + Math.pow(10,(num + 1)));

        //     if(step == base_step){
        //         step = base_step;
        //     }else if(step > base_step && step <= middle_step){
        //         step = middle_step;
        //     }else if(step > middle_step && step <= next_step){
        //         step = next_step;
        //     }

        // }else 
        if(step == 0){
            step = 0;
        }else if(step >= 1 && step < 10){
            step = 10;
        }else if(step >= 10 && step < 50){
            step = 50;
        }else if(step > 50 && step < 100){
            step = 100;
        }else{
            var num = step.toString().split(".")[0].length;
            var base_step = Math.floor(step/Math.pow(10,(num - 1))) * Math.pow(10,(num - 1));
            var middle_step = base_step + Math.pow(10,(num - 1))/2;
            var next_step = base_step + Math.pow(10,(num - 1));

            if(step == base_step){
                // step = base_step;
                step = middle_step;
            }else if(step > base_step && step <= middle_step){
                step = middle_step;
            }else if(step > middle_step && step <= next_step){
                step = next_step;
            }
        }

        // else{
        //     var num = step.toString().length;
        //     var base_step = Math.ceil(step/Math.pow(10,(num - 2))) * Math.pow(10,(num - 2));
        //     step = base_step;
        // }

        if(flag){
            step = step/Math.pow(10,maxDot);
        }

        var upNum = 0,downNum = 0;
        var upNumFlag = true,downNumFlag = true;

        for(i = 1;i<=sepeNum;i++){
            if(i * step > Math.abs(max) || i == sepeNum){
                upNum = i;
                break;
            }

        }
        downNum = sepeNum - upNum;

        while(downNum * step < Math.abs(min)){
            downNum = downNum + 1;
            min = min/Math.abs(min) * step * downNum;
            this.options.sepeNum = this.options.sepeNum + 1;
        }
        this.options.maxDot = maxDot;
        max = step * upNum
        tempObj.max = max;
        tempObj.min = min;
        tempObj.step = step;
        return tempObj;
     }

    return ChartLine;
})();

module.exports = ChartLine;
