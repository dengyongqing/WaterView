// 工具
var common = require('chart/web/common/common'); 
function drawRSI(ctx,rsi6,rsi12,rsi24){
    this.clearT();
    this.options.drawXY.drawXYT();
    // 保存画笔状态
    ctx.save();
    

    var rsi_arr = rsi6.concat(rsi12).concat(rsi24);
    var rsi_arr_length = rsi_arr.length;
    if(rsi_arr && rsi_arr[0]){
        var max = rsi_arr[0].value;
        var min = rsi_arr[0].value;
    }

    for(var i = 0;i < rsi_arr_length;i++){
        max = Math.max(max,rsi_arr[i].value);
        min = Math.min(min,rsi_arr[i].value);
    }

    var base = max - min;
    var c_t_height = this.options.c_t_height;

    var rsi6_length = rsi6.length;
    var rsi12_length = rsi12.length;
    var rsi24_length = rsi24.length;

    var unit_w = this.options.drawWidth/rsi6_length;
    ctx.beginPath();
    ctx.strokeStyle = "#488ee6";
    for(var i = 0;i < rsi6_length;i++){

        var y = (c_t_height - (rsi6[i].value - min)/base *  c_t_height) + this.options.c3_y_top
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
    for(var i = 0;i < rsi12_length;i++){

        var y = (c_t_height - (rsi12[i].value - min)/base *  c_t_height) + this.options.c3_y_top
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
    for(var i = 0;i < rsi24_length;i++){

        var y = (c_t_height - (rsi24[i].value - min)/base *  c_t_height) + this.options.c3_y_top
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