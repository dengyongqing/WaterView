/**
 * 绘制季度柱状图
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
 * }
 *
 */

// 绘制坐标轴
var DrawXY = require('chart/mobile/bar/group-bar/draw_xy');
// 主题
var theme = require('theme/default');
// 绘制季度柱状图
var DrawBar = require('chart/mobile/bar/group-bar/draw_bar');
// 拓展，合并，复制
var extend = require('tools/extend2');
// 水印
var watermark = require('chart/watermark');
// 添加通用工具
var common = require('tools/common');

var ChartBarQuarter = (function() {

    // 构造函数
    function ChartBarQuarter(options) {
        this.defaultoptions = theme.defaulttheme;
        this.options = extend(this.defaultoptions, options);
        

        // 图表容器
        this.container = document.getElementById(options.container);
        // 图表加载完成事件
        this.onChartLoaded = options.onChartLoaded == undefined ? function(op) {

        } : options.onChartLoaded;

    }

    // 初始化
    ChartBarQuarter.prototype.init = function() {

        this.options.type = "bar-quarter";
        var canvas = document.createElement("canvas");
        
        // 去除画布上粘贴效果
        //this.container.style = "-moz-user-select:none;-webkit-lauser-select:none;";
        // this.container.setAttribute("unselectable", "on");
        this.container.style.position = "relative";
        // 画布
        try {
            var ctx = canvas.getContext('2d');
        } catch (error) {
            canvas=window.G_vmlCanvasManager.initElement(canvas);
	        var ctx = canvas.getContext('2d');
        }


        this.options.canvas = canvas;
        this.options.context = ctx;

        this.options.sepeNum = this.options.sepeNum == undefined ? 4 : this.options.sepeNum;
        if(this.options.sepeNum < 2){
            this.options.sepeNum = 2;
        }

        // 容器中添加画布
        this.container.appendChild(canvas);

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

        // 加水印
        watermark.apply(this,[this.options.context,90,20,82,20]);
    };

    // 绘图
    ChartBarQuarter.prototype.draw = function(callback) {
        // 删除canvas画布
        this.clear();
        // 初始化
        this.init();
        // 显示loading效果
        // inter.showLoading();
        // var _this = this;
        // 折线数据
        var series = this.options.series;
        var canvas = this.options.canvas;
        var getMaxMinValue = getMaxMark.apply(this,[series]);
        if (getMaxMinValue.min < 0) {
            this.options.isLessZero = true;
        }
        this.options.data = {};
        this.options.data.max = getMaxMinValue.max;
        this.options.data.min = getMaxMinValue.min;
        this.options.data.step = getMaxMinValue.step;

        this.options.padding_left = this.options.context.measureText("+1000").width + 10;
        this.options.yearUnit = getYearRect.call(this, canvas.width - this.options.padding_left, this.options.series.length);
        this.options.quarterUnit = getQuarterRect.call(this, this.options.yearUnit.bar_w, 4);

        // 绘制坐标轴
        new DrawXY(this.options);
        // 绘制季度柱状图
        new DrawBar(this.options);
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


    // 图表y轴坐标计算
    function get_y(y) {
        var sepe_max_min = this.options.data.max - this.options.data.min;
        if(y >= 0 && this.options.data.min < 0){
            var up_height = this.options.c_1_height * (this.options.data.max)/sepe_max_min;
            return up_height - this.options.c_1_height * y/sepe_max_min;
        }else if(y >= 0 && this.options.data.min >= 0){
            var up_height = this.options.c_1_height;
            return up_height - this.options.c_1_height * (y - this.options.data.min)/sepe_max_min;
        }else if(y < 0 && this.options.data.max >= 0){
            var sepe_y = this.options.c_1_height * (this.options.data.max)/sepe_max_min;
            // var down_height = sepe_y + this.options.c_1_height * Math.abs(this.options.data.min)/sepe_max_min;
            return this.options.c_1_height * Math.abs(y)/sepe_max_min + sepe_y;        
        }else if(y < 0 && this.options.data.max < 0){
            return this.options.c_1_height * Math.abs(y)/sepe_max_min + 0;        
        }
    }
    // 图表x轴坐标计算
    function get_x(year_num,quarter_num) {
        var yearUnit = this.options.yearUnit;
        var quarterUnit = this.options.quarterUnit;
        var padding_left = this.options.padding_left;
        var year_sepe = this.options.yearUnit.rect_w - this.options.yearUnit.bar_w;
        var quarter_sepe = this.options.quarterUnit.rect_w - this.options.quarterUnit.bar_w;
        return yearUnit.rect_w * year_num + padding_left + quarterUnit.rect_w * quarter_num + year_sepe/2 + quarter_sepe/2;
    }

    //通过clientX获得交互需要的tips的坐标和虚线中x坐标
    function getCoordinateByClient(clientX) {
        var canvasX = clientX * this.options.dpr;
        //被返回的两个数据
        var result = {};

        //需要用到的参数
        var paddingLeft = this.options.padding_left,
            yearUnit = this.options.yearUnit,
            quarterUnit = this.options.quarterUnit,
            canvas = this.options.canvas,
            series = this.options.series;

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
        result.midddleLine = get_x.call(this, numYear, numQuarter) + quarterUnit.bar_w / 2;
        //绘制tips的坐标
        result.tipsX = this.options.padding_left*this.options.dpr + yearUnit.rect_w * numYear;
        result.tipsY = get_y.call(this, series[numYear].data[0]) + this.options.canvas_offset_top*this.options.dpr;

        result.midddleLineHeight = result.tipsY;

        result.content = {};
        result.content.series = this.options.series[numYear].data;
        result.content.colors = this.options.xaxis[numYear];

        result.arr = numYear + ":" + numQuarter;

        return result;
    }

    ChartBarQuarter.prototype.addInteractive = function() {
        var canvas = this.options.canvas;
        var yearUnit = this.options.yearUnit;
        var _that = this;
        var tips = document.createElement("div");
        var middleLine = document.createElement("div");
        var coordinateCanvas, coordinateWindow = {};
        //用于状态记录
        var status = "x:x";
        //用于canvas与windows相互转化
        var dpr = this.options.dpr;
        var padding_left = this.options.padding_left;
        var offSetTop = this.options.canvas_offset_top;
        var yHeight = this.options.c_1_height;

        // tips.setAttribute("class", "web-tips");
        tips.className = "web-tips";
        middleLine.className = "group-bar-mark";
        middleLine.style.width = yearUnit.rect_w + "px";
        middleLine.style.backgroundColor = "#333";
        // middleLine.setAttribute("class", "web-middleLine");
        _that.container.appendChild(tips);
        _that.container.appendChild(middleLine);

        common.addEvent.call(_that, canvas, 'mousemove', function(e) {

            var winX, winY;
            //浏览器检测，获取到相对元素的x和y
            if (e.layerX) {
                winX = e.layerX;
                winY = e.layerY;
            } else if (e.x) {
                winX = e.x;
                winY = e.y;
            }

            //当超出坐标系框就不显示交互
            if (winX >= padding_left && winX < (canvas.width -  (yearUnit.rect_w - yearUnit.bar_w) / 2) && (winY >= offSetTop && winY * dpr < (offSetTop * dpr + yHeight))) {
                tips.style.display = "inline-block";
                middleLine.style.display = "inline-block";
            } else {
                tips.style.display = "none";
                middleLine.style.display = "none";
            }
            //canvas中是坐标与屏幕坐标之间的相互转换
            coordinateCanvas = getCoordinateByClient.call(_that, winX);
            if (status !== coordinateCanvas.arr) {
                coordinateWindow.midddleLine = common.canvasToWindow.call(_that, canvas, coordinateCanvas.midddleLine, 0);
                coordinateWindow.tips = common.canvasToWindow.call(_that, canvas, coordinateCanvas.tipsX, coordinateCanvas.tipsY);
                
                //绘制tips
                var series = coordinateCanvas.content.series;
                var colors = coordinateCanvas.content.colors;

                tips.innerHTML = "";
                var title = document.createElement("div");
                title.innerHTML = colors.value;
                tips.appendChild(title);
                for(var i=0,item;item=series[i]; i++){
                    
                    var color_span = document.createElement("span");
                    color_span.className = "bar-color-span";
                    color_span.style.backgroundColor = colors.colors[i];

                    var value_span = document.createElement("span");
                    value_span.className = "bar-value-span";
                    value_span.innerHTML = item;

                    var span_container = document.createElement("div");
                    span_container.className = "";
                    span_container.appendChild(color_span);
                    span_container.appendChild(value_span);

                    tips.appendChild(span_container);
                }

                // tips.innerHTML = coordinateCanvas.content;
                var w_x = e.offsetX || (e.clientX - _that.container.getBoundingClientRect().left);
                var w_y = e.offsetY || (e.clientY - _that.container.getBoundingClientRect().top);

                if (w_x > canvas.width / 2) {
                    tips.style.left = (coordinateCanvas.tipsX - tips.clientWidth) + "px";
                } else {
                    tips.style.left = (coordinateCanvas.tipsX  + _that.options.yearUnit.rect_w) + "px";
                }
                // alert(coordinateWindow.tips.y);
                tips.style.top = (coordinateCanvas.tipsY) - tips.clientHeight/2 + "px";
                // var text = createTextNode(coordinateCanvas.content);
                // tips.appendChild(text);

               

                // 鼠标在画布中的坐标
                var c_pos = common.windowToCanvas.apply(_that,[canvas,w_x,w_y]);
                var c_x = (c_pos.x).toFixed(0);

                var index = Math.floor((c_x - _that.options.padding_left) / yearUnit.rect_w);
                //绘制中线
                middleLine.style.height = yHeight + "px";
                middleLine.style.left = index * yearUnit.rect_w + _that.options.padding_left + "px";
                middleLine.style.top = offSetTop + "px";
                status = coordinateCanvas.arr;
            }

        });

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

        if(step >= 1 && step <= 10){
            step = 10;
        }else if(step > 10 && step < 100){
            step = Math.ceil(step/10) * 10;
        }else{
            var num = step.toString().split(".")[0].length;
            var base_step = Math.floor(step/Math.pow(10,(num - 1))) * Math.pow(10,(num - 1));
            var middle_step = base_step + Math.pow(10,(num - 1))/2;
            var next_step = base_step + Math.pow(10,(num - 1));

            if(step == base_step){
                step = base_step;
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

        var upNum = 0,downNum = 0;
        var upNumFlag = true,downNumFlag = true;

        for(i = 1;i<sepeNum;i++){
            if(i * step > Math.abs(max) && upNumFlag){
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
        
        if(flag){
            max = step * upNum/Math.pow(10,maxDot);
        }else{
            max = step * upNum;
        }

        tempObj.max = max;
        tempObj.min = min;
        tempObj.step = step;
        return tempObj;
    }

    return ChartBarQuarter;
})();

module.exports = ChartBarQuarter;
