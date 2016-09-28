var extend = require("tools/extend2");
var DrawXY = (function(){
    function DrawXY(options){
        this.options = {};
        this.options = extend(this.options, options);

        this.draw();
    }

    DrawXY.prototype.init = function(){
        /*设置可以被参数化的变量*/
        //y轴上设置
        this.options.ySplitNum = 4;
        this.options.yLefShow = true;
        this.options.yRightShow = true;
        this.options.isDash = true;

        // x轴上设置
        this.options.xSplitShow = false;//是否进行分割
        this.options.xShowDivide = false;//是否显示分割标志

        // 显示单位
        this.options.showUnit = true;
        // 显示legend
        this.options.showLegend = true;
    }

    DrawXY.prototype.draw = function(){
        this.init();

        var paddingTop = this.options.padding.top;
        var paddingLeft = this.options.padding.left;
        var paddingRight = this.options.padding.right;

        /*开始进行绘制*/
        
    }

    return DrawXY;
})();


module.exports = DrawXY;