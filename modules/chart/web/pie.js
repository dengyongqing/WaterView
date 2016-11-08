var extend = require('tools/extend2');
// 主题
var theme = require('theme/default');
// 水印
var watermark = require('chart/watermark');
// 添加通用工具
var common = require('tools/common');
/*添加所需要的方法*/
var methods = require("chart/web/pie/methods");

var ChartPie = (function() {

    // 构造函数
    function ChartPie(options) {
        this.options = {};
        this.options = extend(theme.defaulttheme, options);
        // 图表容器
        this.container = document.getElementById(options.container);
        // 图表加载完成事件
        this.onChartLoaded = options.onChartLoaded == undefined ? function(op) {

        } : options.onChartLoaded;

    }

    // 初始化
    ChartPie.prototype.init = function() {

        var canvas = document.createElement("canvas");
        this.container.style.position = "relative";
        // 兼容IE6-IE9
        try {
            var ctx = canvas.getContext('2d');
        } catch (error) {
            canvas = window.G_vmlCanvasManager.initElement(canvas);
            var ctx = canvas.getContext('2d');
        }

        this.options.canvas = canvas;
        this.options.context = ctx;
        // 设备像素比
        var dpr = this.options.dpr = 1;
        // 画布的宽和高
        canvas.width = this.options.width * dpr;
        canvas.height = this.options.height * dpr;

        // 容器中添加画布
        this.container.appendChild(canvas);


        canvas.style.width = this.options.width + "px";
        canvas.style.height = this.options.height + "px";
        canvas.style.border = "0";

        if (!this.options.font) {
            this.options.font = {};
            this.options.font.fontSize = "16px";
            this.options.font.fontFamily = "Microsoft Yahei";
        }

        this.options.startOffset = this.options.startOffset || Math.PI / 2;

        //每条触角文字的高度
        this.options.ySpace = parseInt(this.options.font.fontSize);
        this.options.onPie = this.options.onPie || false;

        // 加水印
        watermark.apply(this, [ctx, 130, 20, 82, 20]);
    }

    // 绘图
    ChartPie.prototype.draw = function(callback) {
        this.init();

        var startOffset = this.options.startOffset,
            ctx = this.options.context,
            current = startOffset,
            total = 0,
            data = this.options.data,
            ySpace = this.options.ySpace,
            point = this.options.point,
            radius = this.options.radius,
            fontSize = "12",
            onPie = this.options.onPie;

        var pies = [];

        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].show || data[i].show === undefined) {
                total += parseFloat(data[i].value);
            }
        }
        for (i = 0; i < data.length; i++) {
            if (data[i].show || data[i].show === undefined) { //由此控制某个饼块是否显示
                var drawStart = current,
                    drawEnd = current + data[i].value / total * 2 * Math.PI;
                current += data[i].value / total * 2 * Math.PI;
                var middle = (drawStart + drawEnd) / 2;
                // 记录所有的饼块的信息(比较信息， 用于确定点击范围)
                pies.push({
                    value: data[i].value,
                    info: data[i].info || data[i].name,
                    tip: data[i].tip || data[i].value,
                    name: data[i].name,
                    start: drawStart,
                    end: drawEnd,
                    middle: middle,
                    color: data[i].color,
                    showInfo: data[i].showInfo,
                    id: i,
                    isOut: false
                });
            }

        }

        var yBottom = point.y - radius - 20;
        var yTop = point.y + radius + 20;

        //获得触角分布情况
        pies = methods.getSpaceArry(pies, Math.floor((yTop - yBottom) / ySpace), ySpace, radius, point, yBottom);
        pies.sort(function(a, b) {
            return a.start - b.start;
        });
        this.options.pies = pies;
        //进行绘制（显示在外面，触角形式）
        for (i = 0; i < pies.length; i++) {
            var pieStart = pies[i].start;
            var pieEnd = pies[i].end;
            var pieMiddle = pies[i].middle;
            var color = pies[i].color;
            methods.drawPie(ctx, point, radius, pieStart, pieEnd, color);
            if (onPie) {
                methods.drawInfoOn(ctx, pies[i], radius, point, fontSize);
            } else {
                methods.drawInfo(ctx, pies[i], radius, point, ySpace);
            }
        }

        //添加交互
        this.addInteractive();

    };

    //添加交互
    ChartPie.prototype.addInteractive = function() {
        var canvas = this.options.canvas;
        var container = this.container;
        var that = this;
        var pies = this.options.pies;
        var point = this.options.point;
        var radius = this.options.radius;
        var startOffset = this.options.startOffset;
        //添加交互事件
        common.addEvent.call(that, canvas, 'click', function(e) {
            // 事件处理
            var winX, winY;
            if (e.layerX) {
                winX = e.layerX;
                winY = e.layerY;
            } else if (e.x) {
                winX = e.x;
                winY = e.y;
            }
            var x = winX - point.x;
            var y = winY - point.y;
            var theta = 0; //点击处的弧度

            if (x * x + y * y > radius * radius) {
                return;
            }
            theta = methods.getTheta(x, y, startOffset);
            for (var i = 0, len = pies.length; i < len; i++) {
                if (theta <= pies[i].end) {
                    var pie = pies[i];
                    pie.clicked = true;
                    methods.pieHandlerClick.call(that, pie);
                    break;
                }
            }
        });
        common.addEvent.call(that, canvas, "mousemove", function(e) { //浮动交互(显示tips)
            //首先判断在哪个饼块上
            var winX, winY;
            if (e.layerX) {
                winX = e.layerX;
                winY = e.layerY;
            } else if (e.x) {
                winX = e.x;
                winY = e.y;
            }
            var x = winX - point.x;
            var y = winY - point.y;
            var theta = 0; //点击处的弧度
            var inPie = true;
            if (x * x + y * y > radius * radius) {
                inPie = false;
            }
            theta = methods.getTheta(x, y, startOffset);
            for (var i = 0, len = pies.length; i < len; i++) {
                if (theta <= pies[i].end) {
                    var pie = pies[i];
                    pie.clicked = true;
                    methods.pieHandlerMove.call(that, pie, winX, winY, inPie);
                    break;
                }
            }
        });
    }


    // 重绘
    ChartPie.prototype.reDraw = function() {
            // 删除canvas画布
            this.clear();
            this.draw();
        }
        // 删除canvas画布
    ChartPie.prototype.clear = function(cb) {
        if (this.container) {
            this.container.innerHTML = "";
        } else {
            document.getElementById(this.options.container).innerHTML = "";
        }
        this.options.tips = null;
        if (cb) {
            cb();
        };
    }

    return ChartPie;
})();

module.exports = ChartPie;
