// 工具
var common = require('chart/web/common/common'); 
function drawWR(ctx,wr6,wr10){
    this.clearT();
    this.options.drawXY.drawXYT();
    // 保存画笔状态
    ctx.save();

    var wr_arr = wr6.concat(wr10);
    var wr_arr_length = wr_arr.length;
    if(wr_arr && wr_arr[0]){
        var max = wr_arr[0].value;
        var min = wr_arr[0].value;
    }

    for(var i = 0;i < wr_arr_length;i++){
        max = Math.max(max,wr_arr[i].value);
        min = Math.min(min,wr_arr[i].value);
    }

    var base = max - min;
    var c_t_height = this.options.c_t_height;

    var wr6_length = wr6.length;
    var wr10_length = wr10.length;

    var unit_w = this.options.drawWidth/wr6_length;
    ctx.beginPath();
    ctx.strokeStyle = "#488ee6";
    for(var i = 0;i < wr6_length;i++){

        var y = (c_t_height - (wr6[i].value - min)/base *  c_t_height) + this.options.c3_y_top
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
    for(var i = 0;i < wr10_length;i++){

        var y = (c_t_height - (wr10[i].value - min)/base *  c_t_height) + this.options.c3_y_top
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

module.exports = drawWR;