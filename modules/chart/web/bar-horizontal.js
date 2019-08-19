var extend = require('tools/extend2');
var watermark = require('chart/watermark');
var divide = require('chart/web/common/divide');
var DrawXY = require('chart/web/bar-horizontal/draw_xy');
var drawBar = require('chart/web/bar-horizontal/draw_bar');
var handleEvent = require('chart/web/bar-horizontal/handleEvent');
// 添加公用模块
var common = require('tools/common');

var ChartMobileBar = (function() {

    function ChartMobileBar(options) {
        this.options = extend(this.options, options);
        // 图表容器
        this.container = document.getElementById(options.container);

        this.container.className = this.container.className.replace(/emcharts-container/g, "").trim();
        this.container.className = this.container.className + " emcharts-container";
    }

    ChartMobileBar.prototype.init = function() {
        /*默认和初始化*/
        this.container.style.position = "relative";
        if (this.options.dpr === undefined) {
            this.options.dpr = 1;
        }
        var dpr = this.options.dpr;
        /*canvas属性*/
        var canvas = document.createElement("canvas");
        this.container.appendChild(canvas);
        
        canvas.width = dpr * this.options.width;
        canvas.height = dpr * this.options.height;
        canvas.style.width = this.options.width + "px";
        canvas.style.height = this.options.height + "px";
        canvas.style.border = "0px";
        try {
            var ctx = canvas.getContext('2d');
        } catch (error) {
            canvas = window.G_vmlCanvasManager.initElement(canvas);
            var ctx = canvas.getContext('2d');
        }
        var ctx = canvas.getContext("2d");

        /*一些如果不存在，就进行的默认设定*/
        if (this.options.font_size === undefined) {
            this.options.font_size = 12;
        }
        ctx.font = (this.options.font_size * dpr) + "px Arial";
        ctx.lineWidth = dpr * 1;
        this.options.dpr = dpr;
        this.options.canvas = canvas;
        this.options.context = ctx;

        if(this.options.color === undefined){
            this.options.color = "#6890D5";
        }
        if(this.options.hoverColor === undefined){
            this.options.hoverColor = "#7EA1DA";
        }
        if (!this.options.sepeNum) {
            this.options.sepeNum = 4;
        }
        var yaxis = this.options.yaxis;
        var coordinate = divide(this.options.sepeNum, this.options.series.data);
        this.options.coordinate = coordinate;

        this.options.padding = {};
        //取得paddingleft
        var paddingLeft = 0;
        for (var i = 0, len = yaxis.length; i < len; i++) {
            paddingLeft = Math.max(ctx.measureText(yaxis[i].value).width, paddingLeft);
        }
        this.options.padding.left = (paddingLeft + 10) * dpr;
        //取得paddingRight
        var paddingRight = ctx.measureText(coordinate.max).width;
        this.options.padding.right = (paddingRight + 10) * dpr;
        this.options.padding.top = this.options.font_size * 2 * dpr;
        this.options.padding.bottom = 50 * dpr;

        /*单位宽度*/
        var unitHeight = (canvas.height - this.options.padding.top - this.options.padding.bottom) / (yaxis.length);
        this.options.unitHeight = unitHeight;

        // 加水印
        watermark.apply(this, [this.options.context, 110 + paddingRight, 40, 82, 20]);

    };

    ChartMobileBar.prototype.draw = function(cb) {
        this.clear();
        this.init();
        var _this = this;
        new DrawXY(this.options);
        drawBar.call(this);
        common.addEvent(_this.container, "mousemove", function(e) {
            var winX, winY;
            //浏览器检测，获取到相对元素的x和y
            if (e.layerX) {
                winX = e.layerX;
                winY = e.layerY;
            } else if (e.x) {
                winX = e.x;
                winY = e.y;
            }
            // winX = e.offsetX || (e.clientX - _this.container.getBoundingClientRect().left);
            // winY = e.offsetY || (e.clientY - _this.container.getBoundingClientRect().top);
            handleEvent.call(_this, winX, winY);

            try{
                e.preventDefault();
            }
            catch(error){
                e.returnValue = false;
            }
        })
        common.addEvent(_this.container, "mouseleave", function(e){
            if(_this.options.tips !== undefined){
                _this.options.tips.style.display = "none";
                _this.options.tips.style.left = "-10000";
            }
        });
        if (cb) {
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
