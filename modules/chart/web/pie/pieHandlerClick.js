var pieIn = require('./pieIn');
var pieOut = require('./pieOut');

module.exports = function (obj) {
	//对点击进行处理，并且记录前一个点击对象
    var dpr = this.options.dpr;
    var that = this;
    var point ={x: that.options.point.x*dpr, y:that.options.point.y*dpr};
    var radius = this.options.radius*dpr;
    var ctx = this.options.context;
    var ctx2 = this.options.context2;
    var ySpace = this.options.ySpace;
    var onPie = this.options.onPie;
    var pies = this.options.pies;
    if (this.options.prePieClick) {
        if (this.options.prePieClick == obj) {
            pieIn(ctx, ctx2, obj, pies, point, radius, ySpace, onPie);
            obj.clicked = false;
            this.options.prePieClick = null;
        } else {
            pieIn(ctx, ctx2, this.options.prePieClick, pies, point, radius, ySpace, onPie);
            this.options.prePieClick.clicked = false;
            pieOut(ctx, ctx2, obj, pies, point, radius, ySpace, onPie);
            this.options.prePieClick = obj;
        }
    } else {
        pieOut(ctx, ctx2, obj, pies, point, radius, ySpace, onPie);
        this.options.prePieClick = obj;
    }
}
