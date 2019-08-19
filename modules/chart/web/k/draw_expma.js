// 工具
var common = require('chart/web/common/common'); 
function drawEXPMA(ctx,expma12,expma50){
    // 保存画笔状态
    ctx.save();
    this.clearK();
    this.options.drawXY.drawXYK();
    this.drawK();

    var expma12_length = expma12.length;
    var expma50_length = expma50.length;

    var unit_w = this.options.drawWidth/expma12_length;
    ctx.beginPath();
    ctx.strokeStyle = "#488ee6";
    var flag = false;
    for(var i = 0;i < expma12_length;i++){

        var x = this.options.padding.left + i * unit_w + unit_w/2;
        var y = common.get_y.call(this,expma12[i].value);
        if(i == 0){
            ctx.moveTo(x,y);
        }else if(y < 0 || y > this.options.c_k_height){
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
    ctx.strokeStyle = "#f4cb15";
    flag = false;
    for(var i = 0;i < expma50_length;i++){

        var x = this.options.padding.left + i * unit_w + unit_w/2;
        var y = common.get_y.call(this,expma50[i].value);
        if(i == 0){
            ctx.moveTo(x,y);
        }else if(y < 0 || y > this.options.c_k_height){
            ctx.moveTo(x,y);
            flag = true;
        }else{
            if(flag){
                ctx.moveTo(x,y);
                flag = false;
            }else{
                ctx.lineTo(x,y);
            }
            // ctx.lineTo(x,y);
        }

    }
    ctx.stroke();
    ctx.beginPath();
    ctx.restore();
}

module.exports = drawEXPMA;