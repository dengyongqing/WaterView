var extend = require('tools/extend2');
var DrawXY = require('chart/mobile/bar/bar/draw_xy');
var drawBar = require('chart/mobile/bar/bar/draw_bar');
var divide = require('chart/mobile/bar/bar/divide');
var handleEvent = require('chart/mobile/bar/bar/handleEvent');

var ChartMobileBar = (function() {

    function ChartMobileBar(options) {
        this.options = extend(this.options, options);
        // 图表容器
        this.container = document.getElementById(options.container);
    }

    ChartMobileBar.prototype.init = function() {
        /*默认和初始化*/
        this.container.style.position = "relative";
        var dpr = 2;
        /*canvas属性*/
        var canvas = document.createElement("canvas");
        canvas.width = dpr * this.options.width;
        canvas.height = dpr * this.options.height;
        canvas.style.width = this.options.width + "px";
        canvas.style.height = this.options.height + "px";
        canvas.style.border = "0";

        var ctx = canvas.getContext("2d");
        this.options.font_size = 12;
        ctx.font = (this.options.font_size * dpr) + "px Arial";
        ctx.lineWidth = dpr;
        this.options.dpr = dpr;
        this.options.canvas = canvas;
        this.options.context = ctx;
        this.container.appendChild(canvas);

        this.options.defaultColor = "#FF7200";
        this.options.defaultHoverColor = "#FF9A4A";
        this.options.sepeNum = 4;
        this.options.padding = {};
        this.options.padding.left = ctx.measureText("2.00").width * dpr;
        this.options.padding.right = 10;
        this.options.padding.top = this.options.font_size * 2 * dpr;
        this.options.padding.bottom = 50 * dpr;

        /*根据传入的series数据量（每一种数据有多少数据量）计算小单元格的宽度*/
        var unit_w_len = (canvas.width - this.options.padding.left -
            this.options.padding.right) / this.options.series[0].data.length;
        /*根据传入的series数据量（一共多少种数据）计算小单元格的宽度*/
        var unit_w_kind = unit_w_len / (this.options.series.length * 2 + 1);
        this.options.unit_w_len = unit_w_len;
        this.options.unit_w_kind = unit_w_kind;

        var coordinate = getMaxMark.call(this, this.options.series);
        this.options.coordinateMinY = coordinate.min;
        this.options.coordinateMaxY = coordinate.max;
    };  

    ChartMobileBar.prototype.draw = function() {
        this.init();
        var _this = this;
        new DrawXY(this.options);
        drawBar.call(this);
        this.options.canvas.addEventListener("touchstart", function(e) {
            var w_x = (e.touches[0].clientX - _this.container.getBoundingClientRect().left);
            var w_y = (e.touches[0].clientY - _this.container.getBoundingClientRect().top);
            console.log("click");
            handleEvent.call(_this, w_x, w_y);
        }, false);
    };



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
        if (max < Math.abs(min)) {
            max = Math.abs(min);
        } else {
            max = max;
        }

        var step = max / this.options.sepeNum;

        if(step.toString().split(".")[1]){
            step = step.toFixed(maxDot);
            step = step * Math.pow(10,maxDot);
        }


        if(step >= 1 && step <= 10){
            step = Math.ceil(step);
        }else if(step > 10 && step < 100){
            if(step % 10 > 0){
                step = Math.ceil(step/10) * 10;
            }
        }else{
            var num = step.toString().length;
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
        max = step * this.options.sepeNum / Math.pow(10,maxDot);

        tempObj.max = max;
        tempObj.min = min;
        return tempObj;
    }

    return ChartMobileBar;
})();

module.exports = ChartMobileBar;
