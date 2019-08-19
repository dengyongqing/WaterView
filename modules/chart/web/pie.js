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

        this.container.className = this.container.className.replace(/emcharts-container/g, "").trim();
        this.container.className = this.container.className + " emcharts-container";
        // 图表加载完成事件
        this.onChartLoaded = options.onChartLoaded == undefined ? function(op) {

        } : options.onChartLoaded;

    }

    // 初始化
    ChartPie.prototype.init = function() {

        var canvas = document.createElement("canvas");
        var canvas2 = document.createElement("canvas"); //用于解决写在扇形上的文字被覆盖的问题

        // 容器中添加画布
        this.container.appendChild(canvas);
        this.container.appendChild(canvas2);

        this.container.style.position = "relative";
        // 设备像素比
        if (this.options.dpr === undefined) {
            this.options.dpr = 2;
        }
            
        // 兼容IE6-IE9
        try {
            var ctx = canvas.getContext('2d');
            var ctx2 = canvas2.getContext('2d');
        } catch (error) {
            canvas = window.G_vmlCanvasManager.initElement(canvas);
            var ctx = canvas.getContext('2d');

            canvas2 = window.G_vmlCanvasManager.initElement(canvas2);
            var ctx2 = canvas2.getContext('2d');
            this.options.dpr = 1;
        }

        this.options.canvas = canvas;
        this.options.context = ctx;

        this.options.canvas2 = canvas2;
        this.options.context2 = ctx2;
        
        var dpr = this.options.dpr;
        // 画布的宽和高
        canvas.width = this.options.width * dpr;
        canvas.height = this.options.height * dpr;

        canvas2.width = this.options.width * dpr;
        canvas2.height = this.options.height * dpr;

        canvas.style.width = this.options.width + "px";
        canvas.style.height = this.options.height + "px";
        canvas.style.border = "0";

        canvas2.style.width = this.options.width + "px";
        canvas2.style.height = this.options.height + "px";
        canvas2.style.border = "0";
        canvas2.style.position = "absolute";
        canvas2.style.top = "0px";
        canvas2.style.left = "0px";

        if (!this.options.font) {
            this.options.font = "12px Arial";
        }
        var font = this.options.font.split("px ")[0] * dpr + "px " + this.options.font.split("px ")[1];
        ctx.font = font;
        ctx2.font = font;
        this.options.startOffset = this.options.startOffset || Math.PI / 2;
        var ySpace = this.options.font.split("px ")[0];
        //每条触角文字的高度
        this.options.ySpace = ySpace;
        this.options.onPie = this.options.onPie || false;

        // 加水印
        watermark.apply(this, [ctx, 130 * dpr, 20 * dpr, 82 * dpr, 20 * dpr]);
    }

    // 绘图
    ChartPie.prototype.draw = function(callback) {
        this.init();

        var startOffset = this.options.startOffset,
            ctx = this.options.context,
            dpr = this.options.dpr,
            ctx2 = this.options.context2,
            current = startOffset,
            total = 0,
            that = this,
            data = this.options.data,
            ySpace = this.options.ySpace,
            point = { x: that.options.point.x * dpr, y: that.options.point.y * dpr },
            radius = this.options.radius * dpr,
            fontSize = ctx2.font.split("px ")[0],
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
                    name: data[i].name || "",
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

        var yBottom = point.y - radius - radius / 10;
        var yTop = point.y + radius + radius / 10;

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
                methods.drawInfoOn(ctx2, pies[i], pies, radius, point, fontSize);
            } else {
                methods.drawInfo(ctx2, pies[i], radius, point, ySpace);
            }
        }

        //添加交互
        this.addInteractive();
        if (callback)
            callback();
    };

    //添加交互
    ChartPie.prototype.addInteractive = function() {
        var canvas = this.options.canvas;
        var canvas2 = this.options.canvas2;
        var container = this.container;
        var that = this;
        var pies = this.options.pies;
        var dpr = this.options.dpr;
        var point = { x: that.options.point.x, y: that.options.point.y };
        var radius = this.options.radius;
        var startOffset = this.options.startOffset;
        //添加交互事件
        common.addEvent.call(that, canvas2, 'click', function(e) {
            // 事件处理
            /*var winX, winY;
            if (e.layerX) {
                winX = e.layerX;
                winY = e.layerY;
            } else if (e.x) {
                winX = e.x;
                winY = e.y;
            }*/
            var winX = e.offsetX || (e.clientX - that.container.getBoundingClientRect().left);
            var winY = e.offsetY || (e.clientY - that.container.getBoundingClientRect().top);

            var x = winX - point.x;
            var y = winY - point.y;
            var theta = 0; //点击处的弧度

            theta = methods.getTheta(x, y, startOffset);
            //弹出后依然进行点击判断
            if (!that.options.prePieClick) {
                if (x * x + y * y > radius * radius) {
                    return;
                }
            } else {
                var pre = that.options.prePieClick;
                if (theta >= pre.start && theta <= pre.end) {
                    if (x * x + y * y > (radius + 15) * (radius + 15)) {
                        return;
                    }
                } else {
                    if (x * x + y * y > radius * radius)
                        return;
                }
            }

            for (var i = 0, len = pies.length; i < len; i++) {
                if (theta <= pies[i].end) {
                    var pie = pies[i];
                    pie.clicked = true;
                    methods.pieHandlerClick.call(that, pie);
                    break;
                }
            }
            try{
                e.preventDefault();
            }catch(err){
                e.returnValue =false;
            }
        });
        common.addEvent.call(that, canvas2, "mousemove", function(e) { //浮动交互(显示tips)
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
            try{
                e.preventDefault();
            }catch(err){
                e.returnValue =false;
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
