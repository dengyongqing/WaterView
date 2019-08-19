var extend = require('tools/extend2');
var DrawXY = require('chart/mobile/bar/bar/draw_xy');
var divide = require('chart/web/common/divide');
var drawBar = require('chart/mobile/bar/bar/draw_bar');
var handleEvent = require('chart/mobile/bar/bar/handleEvent');// 水印
var watermark = require('chart/watermark');

var ChartMobileBar = (function() {

    function ChartMobileBar(options) {
        this.options = extend(this.options, options);
        // 图表容器
        this.container = document.getElementById(options.container);
        this.container.className = this.container.className + " canvas-container";
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
        ctx.lineWidth = dpr*1;
        this.options.dpr = dpr;
        this.options.canvas = canvas;
        this.options.context = ctx;
        this.container.appendChild(canvas);

        this.options.defaultColor = "#FF7200";
        this.options.defaultHoverColor = "#FF9A4A";
        if(!this.options.sepeNum){
            this.options.sepeNum = 4;
        }
        this.options.padding = {};
        this.options.padding.left = ctx.measureText("2.00").width * dpr;
        this.options.padding.right = 10;
        this.options.padding.top = this.options.font_size * 2 * dpr;
        this.options.padding.bottom = 50 * dpr;

        /*单元格的宽度*/
        var unit_w_len = (canvas.width - this.options.padding.left -
            this.options.padding.right) / this.options.series.data.length;
        /*柱体的宽度*/
        var unit_w_kind = unit_w_len / 3;
        this.options.unit_w_len = unit_w_len;
        this.options.unit_w_kind = unit_w_kind;
        var coordinate = divide(this.options.sepeNum, this.options.series.data);
        this.options.coordinate = coordinate;
        // 加水印
        watermark.apply(this,[this.options.context,90*dpr,40*dpr,82*dpr,20*dpr]);
    };  

    ChartMobileBar.prototype.draw = function(cb) {
        this.init();
        var _this = this;
        new DrawXY(this.options);
        drawBar.call(this);
        this.options.canvas.addEventListener("touchstart", function(e) {
            var w_x = (e.touches[0].clientX - _this.container.getBoundingClientRect().left);
            var w_y = (e.touches[0].clientY - _this.container.getBoundingClientRect().top);
            handleEvent.call(_this, w_x, w_y);
        }, false);

        this.options.canvas.addEventListener("click", function(e) {
            var w_x = (e.clientX - _this.container.getBoundingClientRect().left);
            var w_y = (e.clientY - _this.container.getBoundingClientRect().top);
            handleEvent.call(_this, w_x, w_y);
        }, false);
        if(cb){
            cb();
        }
    };

    // 重绘
    ChartMobileBar.prototype.reDraw = function() {
        // 删除canvas画布
        this.clear();
        // 初始化
        this.init();
        this.draw();
    }

    ChartMobileBar.prototype.clear = function(cb) {
        if (this.container) {
            this.container.innerHTML = "";
        } else {
            document.getElementById(this.options.container).innerHTML = "";
        }
        if (cb) {
            cb();
        };
    }


    return ChartMobileBar;
})();

module.exports = ChartMobileBar;
