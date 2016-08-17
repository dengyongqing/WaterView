// 工具
var common = require('chart/web/common/common'); 
function drawMACD(ctx,max,min,dea,diff,macd){
    // 保存画笔状态
    ctx.save();
    var base = (max - min)/2;
    var middle = (max + min)/2
    var middle_y =  this.options.c3_y_top + this.options.c_t_height/2;

    var c_t_height = this.options.c_t_height;

    var dea_length = dea.length;
    var diff_length = diff.length;
    var macd_length = macd.length;

    var unit_w = this.options.drawWidth/dea_length;
    ctx.beginPath();
    ctx.strokeStyle = "#f4cb15";
    for(var i = 0;i < dea_length;i++){

        if(dea[i].value >= 0){
            var y = (c_t_height/2 - (dea[i].value - middle)/base *  c_t_height/2) + this.options.c3_y_top
        }else{
            var y = (middle - dea[i].value)/base *  c_t_height/2 + this.options.c3_y_top + c_t_height/2;
        }
        var x = this.options.padding.left + (i + 1) * unit_w - unit_w/2;

        if(i == 0 || y > (this.options.c3_y_top + this.options.c_t_height) || y < this.options.c3_y_top){
            ctx.moveTo(x,y);
        }else{
            ctx.lineTo(x,y);
        }

    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#fe59fe";
    for(var i = 0;i < diff_length;i++){

        if(dea[i].value >= 0){
            var y = (c_t_height/2 - (diff[i].value - middle)/base *  c_t_height/2) + this.options.c3_y_top
        }else{
            var y = (middle - diff[i].value)/base *  c_t_height/2 + this.options.c3_y_top + c_t_height/2;
        }        
        var x = this.options.padding.left + (i + 1) * unit_w - unit_w/2;

        if(i == 0 || y > (this.options.c3_y_top + this.options.c_t_height) || y < this.options.c3_y_top){
            ctx.moveTo(x,y);
        }else{
            ctx.lineTo(x,y);
        }

    }
    ctx.stroke();

    
    // ctx.strokeStyle = "#fe59fe";
    for(var i = 0;i < macd_length;i++){
        ctx.beginPath();
        var x = this.options.padding.left + (i + 1) * unit_w - unit_w/2;
        if(macd[i].value >= 0){
            ctx.strokeStyle = "#ff0000";
            ctx.fillStyle = "#ff0000";
            var y = (c_t_height/2 - (macd[i].value - middle)/base *  c_t_height/2) + this.options.c3_y_top
            ctx.rect(x-(unit_w*0.6)/2,y,unit_w*0.6,Math.abs(y-middle_y));
            ctx.fill();
            ctx.stroke();
        }else{
            ctx.strokeStyle = "#17b03e";
            ctx.fillStyle = "#17b03e";
            var y = (middle - diff[i].value)/base *  c_t_height/2 + this.options.c3_y_top + c_t_height/2;
            ctx.rect(x-(unit_w*0.6)/2,middle_y,unit_w*0.6,Math.abs(y-middle_y));
            ctx.fill();
            ctx.stroke();
        }        

    }
    ctx.fillStyle = "#333";
    ctx.fillText(common.format_unit(max), this.options.padding.left - ctx.measureText(common.format_unit(max)).width - 10, this.options.c3_y_top + 5);
    ctx.fillText(common.format_unit(middle.toFixed(2)), this.options.padding.left - ctx.measureText(common.format_unit(middle.toFixed(2))).width - 10, this.options.c3_y_top + 5 + c_t_height/2);
    ctx.fillText(common.format_unit(min.toFixed(2)), this.options.padding.left - ctx.measureText(common.format_unit(min.toFixed(2))).width - 10, this.options.c3_y_top + 5 + c_t_height);

    ctx.restore();
}

module.exports = drawMACD;