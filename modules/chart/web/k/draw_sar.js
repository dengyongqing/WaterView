// 工具
var common = require('chart/web/common/common'); 
function drawSAR(ctx,max,min,sar){
    // 保存画笔状态
    ctx.save();
    var base = max - min;
    var c_t_height = this.options.c_t_height;

    var sar_length = sar.length;

    var unit_w = this.options.drawWidth/sar_length;
    ctx.beginPath();
  
    ctx.fillStyle = "#ff0000";
    ctx.strokeStyle = "#ff0000";
    for(var i = 0;i < sar_length;i++){

        var x = this.options.padding.left + i * unit_w + unit_w/2;
        var y = common.get_y.call(this,sar[i].value);

        if(y <= this.options.c_k_height && y >= 0){
            ctx.moveTo(x,y);
            ctx.arc(x,y,3,0,Math.PI*2,true);
            ctx.fill();
            ctx.stroke();
        }

        
        // if(i == 0){
        //     ctx.moveTo(x,y);
        // }else{
        //     ctx.lineTo(x,y);
        // }

    }

    var middle = (max + min)/2;
    ctx.fillStyle = "#333";
    ctx.fillText(common.format_unit(max), this.options.padding.left - ctx.measureText(common.format_unit(max)).width - 10, this.options.c3_y_top + 5);
    ctx.fillText(common.format_unit(middle.toFixed(2)), this.options.padding.left - ctx.measureText(common.format_unit(middle.toFixed(2))).width - 10, this.options.c3_y_top + 5 + c_t_height/2);
    ctx.fillText(common.format_unit(min.toFixed(2)), this.options.padding.left - ctx.measureText(common.format_unit(min.toFixed(2))).width - 10, this.options.c3_y_top + 5 + c_t_height);

    ctx.restore();
}

module.exports = drawSAR;