// 工具
var common = require('chart/web/common/common'); 
function drawSAR(ctx,max,min,sar){
    debugger;
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

    ctx.restore();
}

module.exports = drawSAR;