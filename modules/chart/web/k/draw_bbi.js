// 工具
var common = require('chart/web/common/common'); 
function drawEXPMA(ctx,max,min,bbi){
    // 保存画笔状态
    ctx.save();
    var base = max - min;
    var c_t_height = this.options.c_t_height;

    var bbi_length = bbi.length;

    var unit_w = this.options.drawWidth/bbi_length;
    ctx.beginPath();
    ctx.strokeStyle = "#488ee6";
    for(var i = 0;i < bbi_length;i++){

        var x = this.options.padding.left + i * unit_w + unit_w/2;
        var y = common.get_y.call(this,bbi[i].value);

        // var y = (c_t_height - (expma12[i].value - min)/base *  c_t_height) + this.options.c3_y_top
        // var x = this.options.padding.left + (i + 1) * unit_w - unit_w/2;

        if(i == 0 || y > this.options.c_k_height || y < 0){
            ctx.moveTo(x,y);
        }else{
            ctx.lineTo(x,y);
        }

    }
    ctx.stroke();

    var middle = (max + min)/2;
    ctx.fillStyle = "#333";
    ctx.fillText(common.format_unit(max), this.options.padding.left - ctx.measureText(common.format_unit(max)).width - 10, this.options.c3_y_top + 5);
    ctx.fillText(common.format_unit(middle.toFixed(2)), this.options.padding.left - ctx.measureText(common.format_unit(middle.toFixed(2))).width - 10, this.options.c3_y_top + 5 + c_t_height/2);
    ctx.fillText(common.format_unit(min.toFixed(2)), this.options.padding.left - ctx.measureText(common.format_unit(min.toFixed(2))).width - 10, this.options.c3_y_top + 5 + c_t_height);

    ctx.restore();
}

module.exports = drawEXPMA;