var extend = require('tools/extend2');
// 主题
var theme = require('theme/default');
var ChartPie = (function() {

    // 构造函数
    function ChartPie(options) {
        this.options = {};
        this.options = extend(theme.defaulttheme, options);
        // 图表容器
        this.container = document.getElementById(options.container);
        // 图表加载完成事件
        this.onChartLoaded = options.onChartLoaded == undefined ? function(op){

        }:options.onChartLoaded;
        
    }

    // 初始化
    ChartPie.prototype.init = function() {


        // 加水印
        watermark.apply(this, [ctx,130,20,82,20]);
    }
    
    // 绘图
    ChartPie.prototype.draw = function(callback) {
        console.log("draw");
    };

    //添加交互
    ChartPie.prototype.addInteractive = function() {
    }


    // 重绘
    ChartPie.prototype.reDraw = function() {
    }
    // 删除canvas画布
    ChartPie.prototype.clear = function(cb) {
    }

    return ChartPie;
})();

module.exports = ChartPie;
