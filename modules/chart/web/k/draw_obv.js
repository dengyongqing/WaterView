// 工具
var common = require('chart/web/common/common'); 
function drawOBV(ctx,obv,maobv){
    this.clearT();
    this.options.drawXY.drawXYT();
    // 保存画笔状态
    ctx.save();

    var obv_arr = obv.concat(maobv);
    var obv_arr_length = obv_arr.length;
    if(obv_arr && obv_arr[0]){
        var max = obv_arr[0].value;
        var min = obv_arr[0].value;
    }

    for(var i = 0;i < obv_arr_length;i++){
        max = Math.max(max,obv_arr[i].value);
        min = Math.min(min,obv_arr[i].value);
    }

    var base = max - min;
    var c_t_height = this.options.c_t_height;

    var obv_length = obv.length;
    var maobv_length = maobv.length;

    var unit_w = this.options.drawWidth/obv_length;
    ctx.beginPath();
    ctx.strokeStyle = "#488ee6";
    for(var i = 0;i < obv_length;i++){

        var y = (c_t_height - (obv[i].value - min)/base *  c_t_height) + this.options.c3_y_top
        var x = this.options.padding.left + (i + 1) * unit_w - unit_w/2;

        if(i == 0){
            ctx.moveTo(x,y);
        }else{
            ctx.lineTo(x,y);
        }

    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#f4cb15";
    for(var i = 0;i < maobv_length;i++){

        var y = (c_t_height - (maobv[i].value - min)/base *  c_t_height) + this.options.c3_y_top
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