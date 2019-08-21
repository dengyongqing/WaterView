// 工具
var common = require('chart/web/common/common'); 
function drawSAR(ctx,sar,k_data_arr){
    // 保存画笔状态
    ctx.save();
    this.clearK();
    this.options.drawXY.drawXYK();
    this.drawK();

    var sar_length = sar.length;

    var unit_w = this.options.drawWidth/sar_length;
    var up_color = this.options.up_color;
    var down_color = this.options.down_color
    
    for(var i = 0;i < sar_length;i++){
        ctx.beginPath();
        var is_up = k_data_arr[i].up;

        if(i == sar_length - 1){
            if(sar[i].value > sar[i-1].value){
                ctx.fillStyle = up_color;
                ctx.strokeStyle = up_color;
            }else{
                ctx.fillStyle = down_color;
                ctx.strokeStyle = down_color;
            }
        }else if(sar[i + 1].value > sar[i].value){
            ctx.fillStyle = up_color;
            ctx.strokeStyle = up_color;
        }else{
            ctx.fillStyle = down_color;
            ctx.strokeStyle = down_color;
        }

        var x = this.options.padding.left + i * unit_w + unit_w/2;
        var y = common.get_y.call(this,sar[i].value);

        if(y <= this.options.c_k_height && y >= 0){
            ctx.moveTo(x,y);
            ctx.arc(x,y,3,0,Math.PI*2,true);
            ctx.fill();
            ctx.stroke();
        }

    }
    ctx.beginPath();
    ctx.restore();
}

module.exports = drawSAR;