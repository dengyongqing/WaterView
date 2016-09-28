var extend = require('tools/extend2');
var DrawXY = require('chart/mobile/bar/bar/draw_xy');
var drawBar = require('chart/mobile/bar/bar/draw_bar');

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

        this.options.dpr = dpr;
        this.options.canvas = canvas;
        this.container.appendChild(canvas);

        this.options.defaultColor = "#FF7200";
        this.options.defaultHoverColor = "#FF9A4A";
        this.options.padding = {};
        this.options.padding.left = ctx.measureText("2000000.00").width * dpr;
        this.options.padding.right = 0;
        this.options.padding.top = this.options.font_size * 2 * dpr;

        /*根据传入的series数据量（每一种数据有多少数据量）计算小单元格的宽度*/
        var unit_w_len = (canvas.width - this.options.padding.left -
            this.options.padding.right) / this.options.series[0].data.length;
        /*根据传入的series数据量（一共多少种数据）计算小单元格的宽度*/
        var unit_w_kind = unit_w_len / (this.options.series.length + 2);
        this.options.unit_w_len = unit_w_len;
        this.options.unit_w_kind = unit_w_kind;

    };

    ChartMobileBar.prototype.draw = function() {
        this.init();
        new DrawXY(this.options);
        drawBar();
    };

    return ChartMobileBar;
})();

module.exports = ChartMobileBar;
