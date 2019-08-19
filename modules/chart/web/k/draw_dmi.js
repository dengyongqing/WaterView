// 工具
var common = require('chart/web/common/common'); 
function drawDMI(ctx,pdi,mdi,adx,adxr){
    this.clearT();
    this.options.drawXY.drawXYT();
    // 保存画笔状态
    ctx.save();

    var dmi_arr = pdi.concat(mdi).concat(adx).concat(adxr);
    var dmi_arr_length = dmi_arr.length;
    if(dmi_arr && dmi_arr[0]){
        var max = dmi_arr[0].value;
        var min = dmi_arr[0].value;
    }

    for(var i = 0;i < dmi_arr_length;i++){
        max = Math.max(max,dmi_arr[i].value);
        min = Math.min(min,dmi_arr[i].value);
    }

    var base = max - min;
    var c_t_height = this.options.c_t_height;

    var pdi_length = pdi.length;
    var mdi_length = mdi.length;
    var adx_length = adx.length;
    var adxr_length = adxr.length;

    var unit_w = this.options.drawWidth/pdi_length;
    ctx.beginPath();


    ctx.strokeStyle = "#488ee6";
    for(var i = 0;i < pdi_length;i++){

        var y = (c_t_height - (pdi[i].value - min)/base *  c_t_height) + this.options.c3_y_top
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
    for(var i = 0;i < mdi_length;i++){

        var y = (c_t_height - (mdi[i].value - min)/base *  c_t_height) + this.options.c3_y_top
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
    for(var i = 0;i < adx_length;i++){

        var y = (c_t_height - (adx[i].value - min)/base *  c_t_height) + this.options.c3_y_top
        var x = this.options.padding.left + (i + 1) * unit_w - unit_w/2;

        if(i == 0){
            ctx.moveTo(x,y);
        }else{
            ctx.lineTo(x,y);
        }

    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#ff5b10";
    for(var i = 0;i < adxr_length;i++){

        var y = (c_t_height - (adxr[i].value - min)/base *  c_t_height) + this.options.c3_y_top
        var x = this.options.padding.left + (i + 1) * unit_w - unit_w/2;

        if(i == 0 || y < this.options.c3_y_top || y > this.options.c3_y_top + 2 * this.options.unit_htight){
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

module.exports = drawDMI;