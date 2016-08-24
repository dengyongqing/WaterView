// 工具
var common = require('chart/web/common/common'); 
function drawBOLL(ctx,bollup,bollmb,bolldn){
    // 保存画笔状态
    ctx.save();
    this.clearK();
    this.options.drawXY.drawXYK();
    this.drawK();
    var c_t_height = this.options.c_t_height;

    var bollup_length = bollup.length;
    var bollmb_length = bollmb.length;
    var bolldn_length = bolldn.length;

    var unit_w = this.options.drawWidth/bollup_length;

    ctx.beginPath();
    ctx.strokeStyle = "#f4cb15";
    for(var i = 0;i < bollup_length;i++){

        var x = this.options.padding.left + i * unit_w + unit_w/2;
        var y = common.get_y.call(this,bollup[i].value);

        if(i == 0 || y > this.options.c_k_height || y < 0){
            ctx.moveTo(x,y);
        }else{
            ctx.lineTo(x,y);
        }

    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#488ee6";
    for(var i = 0;i < bollmb_length;i++){

        var x = this.options.padding.left + i * unit_w + unit_w/2;
        var y = common.get_y.call(this,bollmb[i].value);

        if(i == 0 || y > this.options.c_k_height || y < 0){
            ctx.moveTo(x,y);
        }else{
            ctx.lineTo(x,y);
        }

    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#fe59fe";
    for(var i = 0;i < bolldn_length;i++){

        var x = this.options.padding.left + i * unit_w + unit_w/2;
        var y = common.get_y.call(this,bolldn[i].value);

        if(i == 0 || y > this.options.c_k_height || y < 0){
            ctx.moveTo(x,y);
        }else{
            ctx.lineTo(x,y);
        }

    }
    ctx.stroke();

    ctx.beginPath();

    ctx.restore();
}

module.exports = drawBOLL;