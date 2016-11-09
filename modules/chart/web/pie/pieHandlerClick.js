var pieIn = require('./pieIn');
var pieOut = require('./pieOut');

module.exports = function (obj) {
	//对点击进行处理，并且记录前一个点击对象
    var point = this.options.point;
    var radius = this.options.radius;
    var ctx = this.options.context;
    var ctx2 = this.options.context2;
    var ySpace = this.options.ySpace;
    var onPie = this.options.onPie;
    if (this.options.prePieClick) {
        if (this.options.prePieClick == obj) {
            pieIn(ctx, ctx2, obj, point, radius, ySpace, onPie);
            obj.clicked = false;
            this.options.prePieClick = null;
        } else {
            pieIn(ctx, ctx2, this.options.prePieClick, point, radius, ySpace, onPie);
            this.options.prePieClick.clicked = false;
            pieOut(ctx, ctx2, obj, point, radius, ySpace, onPie);
            this.options.prePieClick = obj;
        }
    } else {
        pieOut(ctx, ctx2, obj, point, radius, ySpace, onPie);
        this.options.prePieClick = obj;
    }
}
