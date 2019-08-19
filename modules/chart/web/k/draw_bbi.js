// 工具
var common = require('chart/web/common/common'); 
function drawEXPMA(ctx,bbi){
    // 保存画笔状态
    ctx.save();
    this.clearK();
    this.options.drawXY.drawXYK();
    this.drawK();
    
    var bbi_length = bbi.length;

    var unit_w = this.options.drawWidth/bbi_length;
    ctx.beginPath();
    ctx.strokeStyle = "#488ee6";
    var flag = false;
    for(var i = 0;i < bbi_length;i++){

        var x = this.options.padding.left + i * unit_w + unit_w/2;
        var y = common.get_y.call(this,bbi[i].value);

        if(i == 0){
            ctx.moveTo(x,y);
        }else if(y > this.options.c_k_height || y < 0){
            ctx.moveTo(x,y);
            flag = true;
        }else{
            if(flag){
                ctx.moveTo(x,y);
                flag = false;
            }else{
                ctx.lineTo(x,y);
            }
        }

    }
    ctx.stroke();

    ctx.beginPath();

    ctx.restore();
}

module.exports = drawEXPMA;