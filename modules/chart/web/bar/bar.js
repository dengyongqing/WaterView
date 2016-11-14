var extend = require('tools/extend2');
var DrawXY = require('chart/web/bar/bar/draw_xy');
var divide = require('chart/web/bar/bar/divide');
var drawBar = require('chart/web/bar/bar/draw_bar');
var handleEvent = require('chart/web/bar/bar/handleEvent');// 水印
var watermark = require('chart/watermark');
// 添加公用模块
var common = require('tools/common');

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
        var dpr = 1;
        /*canvas属性*/
        var canvas = document.createElement("canvas");
        canvas.width = dpr * this.options.width;
        canvas.height = dpr * this.options.height;
        canvas.style.width = this.options.width + "px";
        canvas.style.height = this.options.height + "px";
        canvas.style.border = "0";

        try {
            var ctx = canvas.getContext('2d');
        } catch (error) {
            canvas=window.G_vmlCanvasManager.initElement(canvas);
            var ctx = canvas.getContext('2d');
        }

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
        this.options.padding.left = (ctx.measureText("+9000万").width + 20) * dpr;
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
        var coordinate = divide(this.options.sepeNum, this.options.series[0].data);
        this.options.coordinate = coordinate;

        // 加水印
        watermark.apply(this,[this.options.context,110,40,82,20]);

    };  

    ChartMobileBar.prototype.draw = function(cb) {
        this.init();
        var _this = this;
        new DrawXY(this.options);
        drawBar.call(this);
        common.addEvent(this.options.canvas,"mousemove", function(e) {
            // var w_x = (e.touches[0].clientX - _this.container.getBoundingClientRect().left);
            // var w_y = (e.touches[0].clientY - _this.container.getBoundingClientRect().top);
            var winX, winY;
            //浏览器检测，获取到相对元素的x和y
            if (e.layerX) {
                winX = e.layerX;
                winY = e.layerY;
            } else if (e.x) {
                winX = e.x;
                winY = e.y;
            }

            // winX = e.offsetX || (e.clientX - _that.container.getBoundingClientRect().left);
            // winY = e.offsetY || (e.clientY - _that.container.getBoundingClientRect().top);
            handleEvent.call(_this, winX, winY);
        }, false);

        // this.options.canvas.addEventListener("click", function(e) {
        //     var w_x = (e.clientX - _this.container.getBoundingClientRect().left);
        //     var w_y = (e.clientY - _this.container.getBoundingClientRect().top);
        //     handleEvent.call(_this, w_x, w_y);
        // }, false);
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
