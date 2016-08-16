function drawRSI(ctx,max,min,bias6,bias12,bias24){
    // 保存画笔状态
    ctx.save();
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
    ctx.restore();
}

module.exports = drawRSI;