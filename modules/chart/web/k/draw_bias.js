// 工具
var common = require('chart/web/common/common'); 
function drawRSI(ctx,bias6,bias12,bias24){
    this.clearT();
    this.options.drawXY.drawXYT();
    // 保存画笔状态
    ctx.save();

    var bias_arr = bias6.concat(bias12).concat(bias24);
    var bias_arr_length = bias_arr.length;
    if(bias_arr && bias_arr[0]){
        var max = bias_arr[0].value;
        var min = bias_arr[0].value;
    }

    for(var i = 0;i < bias_arr_length;i++){
        max = Math.max(max,bias_arr[i].value);
        min = Math.min(min,bias_arr[i].value);
    }

    var base = max - min;
    var c_t_height = this.options.c_t_height;

    var bias6_length = bias6.length;
    var bias12_length = bias12.length;
    var bias24_length = bias24.length;

    var unit_w = this.options.drawWidth/bias6_length;
    ctx.beginPath();
    ctx.strokeStyle = "#488ee6";
    for(var i = 0;i < bias6_length;i++){

        var y = (c_t_height - (bias6[i].value - min)/base *  c_t_height) + this.options.c3_y_top
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
    for(var i = 0;i < bias12_length;i++){

        var y = (c_t_height - (bias12[i].value - min)/base *  c_t_height) + this.options.c3_y_top
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
    for(var i = 0;i < bias24_length;i++){

        var y = (c_t_height - (bias24[i].value - min)/base *  c_t_height) + this.options.c3_y_top
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