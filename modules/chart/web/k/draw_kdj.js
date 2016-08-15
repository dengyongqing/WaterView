function drawRSI(ctx,max,min,k,d,j){
    // 保存画笔状态
    ctx.save();
    var base = max - min;
    var c_t_height = this.options.c_t_height;

    var k_length = k.length;
    var d_length = d.length;
    var j_length = j.length;

    var unit_w = this.options.drawWidth/k_length;
    ctx.beginPath();
    ctx.strokeStyle = "#488ee6";
    for(var i = 0;i < k_length;i++){

        var y = (c_t_height - (k[i].value - min)/base *  c_t_height) + this.options.c3_y_top
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
    for(var i = 0;i < d_length;i++){

        var y = (c_t_height - (d[i].value - min)/base *  c_t_height) + this.options.c3_y_top
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
    for(var i = 0;i < j_length;i++){

        var y = (c_t_height - (j[i].value - min)/base *  c_t_height) + this.options.c3_y_top
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