// 工具
var common = require('chart/web/common/common'); 
function drawRSI(ctx,k,d,j){
    this.clearT();
    this.options.drawXY.drawXYT();
    // 保存画笔状态
    ctx.save();

    var kdj_arr = k.concat(d).concat(j);
    var kdj_arr_length = kdj_arr.length;
    if(kdj_arr && kdj_arr[0]){
        var max = kdj_arr[0].value;
        var min = kdj_arr[0].value;
    }

    for(var i = 0;i < kdj_arr_length;i++){
        max = Math.max(max,kdj_arr[i].value);
        min = Math.min(min,kdj_arr[i].value);
    }

    var base = max - min;
    var c_t_height = this.options.c_t_height;

    var k_length = k.length;
    var d_length = d.length;
    var j_length = j.length;

    var unit_w = this.options.drawWidth/k_length;
    ctx.beginPath();
    ctx.strokeStyle = "#488ee6";
    for(var i = 0;i < k_length;i++){

        var y = (c_t_height - (k[i].value - min)/base *  c_t_height) + this.options.c3_y_top
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
    for(var i = 0;i < d_length;i++){

        var y = (c_t_height - (d[i].value - min)/base *  c_t_height) + this.options.c3_y_top
        var x = this.options.padding.left + (i + 1) * unit_w - unit_w/2;

        if(i == 0){
            ctx.moveTo(x,y);
        }else{
            ctx.lineTo(x,y);
        }

    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#fe59fe";
    for(var i = 0;i < j_length;i++){

        var y = (c_t_height - (j[i].value - min)/base *  c_t_height) + this.options.c3_y_top
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

module.exports = drawRSI;