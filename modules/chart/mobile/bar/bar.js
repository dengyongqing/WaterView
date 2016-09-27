var extend = ;
var drawXY = ;
var drawBar = ;

var MobileCommonBar = (function(){

    function MobileCommonBar(options){
        this.options = {};
        this.options = extend(this.options, options);
        // 图表容器
        this.container = document.getElementById(options.container);
    }

    MobileCommonBar.prototype.init = function(){
        /*完成默认值等的设定*/
    };

    MobileCommonBar.prototype.draw = function(){

    };

    return MobileCommonBar;
})();

module.exports = MobileCommonBar;