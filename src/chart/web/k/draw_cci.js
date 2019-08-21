// 工具
var common = require('chart/web/common/common'); 
function drawOBV(ctx,cci){
    this.clearT();
    this.options.drawXY.drawXYT();
    // 保存画笔状态
    ctx.save();

    var cci_arr = cci;
    var cci_arr_length = cci.length;
    if(cci_arr && cci_arr[0]){
        var max = cci_arr[0].value;
        var min = cci_arr[0].value;
    }

    for(var i = 0;i < cci_arr_length;i++){
        max = Math.max(max,cci_arr[i].value);
        min = Math.min(min,cci_arr[i].value);
    }

    var base = max - min;
    var c_t_height = this.options.c_t_height;

    var cci_length = cci.length;

    var unit_w = this.options.drawWidth/cci_length;
    ctx.beginPath();
    ctx.strokeStyle = "#488ee6";
    for(var i = 0;i < cci_length;i++){

        var y = (c_t_height - (cci[i].value - min)/base *  c_t_height) + this.options.c3_y_top
        var x = this.options.padding.left + (i + 1) * unit_w - unit_w/2;

        if(i == 0){
            ctx.moveTo(x,y);
        }else{
            ctx.lineTo(x,y);
        }

    }
    ctx.stroke();

    var middle = (max + min)/2;
    ctx.fillStyle = "#333";
    ctx.fillText(common.format_unit(max), this.options.padding.left - 5 - ctx.measureText(common.format_unit(max)).width, this.options.c3_y_top + 5);
    ctx.fillText(common.format_unit(middle.toFixed(2)), this.options.padding.left - 5 - ctx.measureText(common.format_unit(middle.toFixed(2))).width, this.options.c3_y_top + 5 + c_t_height/2);
    ctx.fillText(common.format_unit(min.toFixed(2)), this.options.padding.left - 5 - ctx.measureText(common.format_unit(min.toFixed(2))).width, this.options.c3_y_top + 5 + c_t_height);
    ctx.beginPath();
    ctx.restore();
}

module.exports = drawOBV;