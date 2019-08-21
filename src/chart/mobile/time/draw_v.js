/*继承*/
var extend = require('tools/extend');
/*工具*/
var common = require('common');
var draw_dash = require("chart/mobile/common/draw_dash_line");
/*主题*/
var theme = require('theme/default');
var coordinate = require('chart/mobile/time/coordinate'); 
var DrawV = (function() {
    function DrawV(options) {
        /*设置默认参数*/
        this.defaultoptions = theme.draw_v;
        this.options = {};
        extend(false, this.options, this.defaultoptions, options);
        /*绘图*/
        this.draw();
    };

    /*绘图*/
    DrawV.prototype.draw = function() {
        /*绘制分时图成交量*/
        var ctx = this.options.context;
        ctx.beginPath();
    	ctx.save();
        drawVTime.call(this);
        ctx.restore();

    };
    /*绘制分时图成交量*/
    function drawVTime() {
        var ctx = this.options.context;
        var data = this.options.data;
        /*成交量数组*/
        var data_arr = data.data;
        var padding_left = this.options.padding_left;
        var v_height = this.options.unit.unitHeight * 2;
        var v_base_height = v_height * 0.9;
        var y_v_bottom = ctx.canvas.height;
        var y_v_top = y_v_bottom - v_height;
        var y_v_width = ctx.canvas.width - this.options.padding_left;
        var x_sep = this.options.x_sep;
        /*绘制x轴上的竖直分割线*/
        var itemWidth = y_v_width / x_sep;

        if (!data_arr || data_arr.length == 0) {
            ctx.beginPath();
            ctx.fillStyle = '#999';
            ctx.strokeStyle = '#e5e5e5';
            // ctx.fillText(0, 0, y_v_top + 10);
            ctx.rect(this.options.padding_left, y_v_top, ctx.canvas.width - this.options.padding_left, v_height - 2);
            ctx.stroke();
            return;
        }

        this.options.data.v_max = getVMax(this.options.data);

        /*Y轴上的最大值*/
        var v_max = (data.v_max).toFixed(0);


        /*获取单位矩形对象*/
        var rect_unit = this.options.rect_unit;
        /*K线柱体的宽度*/
        var bar_w = rect_unit.bar_w;
        /*K线柱体的颜色*/
        var up_color = this.options.up_color;
        var down_color = this.options.down_color;
        if(this.options.showVMax === true){
            markVMax(ctx, v_max, y_v_top);
        }

        /*绘制边框和分割线*/
        ctx.beginPath();
        ctx.strokeStyle = '#e5e5e5';
        ctx.lineWidth = this.options.dpr;
        ctx.rect(this.options.padding_left+1, y_v_top, y_v_width-2, v_height-2);
        ctx.moveTo(padding_left, y_v_top + v_height/2);
        ctx.lineTo(y_v_width, y_v_top + v_height/2);
        ctx.stroke();
        for(var j = 1; j <= x_sep-1; j++){
            var flag = false;
            ctx.beginPath();

            if(this.options.type.toLowerCase() == "t2"){
                this.options.x_sep = 2;
                if(j == 1){
                    flag = true;
                }
            }else if(this.options.type.toLowerCase() == "t3"){
                this.options.x_sep = 3;
            }else if(this.options.type.toLowerCase() == "t4"){
                this.options.x_sep = 4;
                if(j == 2){
                    flag = true;
                }
            }else if(this.options.type.toLowerCase() == "t5"){
                this.options.x_sep = 5;
            }else{
                flag = false;
            }

            if(flag){
                ctx.moveTo(padding_left + y_v_width/2, y_v_top);
                ctx.lineTo(padding_left + y_v_width/2, y_v_bottom);
                ctx.stroke();
            }else{
                draw_dash(ctx, itemWidth*(j)+padding_left, y_v_top, itemWidth*(j)+padding_left,y_v_bottom);
            }

        }

        ctx.lineWidth = 1;
        for (var i = 0, item; item = data_arr[i]; i++) {

            var volume = item.volume;
            var is_up = item.up;
            var bar_height = volume / v_max * v_base_height;
            var x = coordinate.get_x.call(this, i + 1);
            var y = y_v_bottom - bar_height;

            ctx.beginPath();
            ctx.moveTo(x, y);

            if (i == 0) {
                if (is_up) {
                    ctx.fillStyle = up_color;
                    ctx.strokeStyle = up_color;
                } else {
                    ctx.fillStyle = down_color;
                    ctx.strokeStyle = down_color;
                }
            } else {
                if (item.price >= data_arr[i - 1].price) {
                    ctx.fillStyle = up_color;
                    ctx.strokeStyle = up_color;
                } else {
                    ctx.fillStyle = down_color;
                    ctx.strokeStyle = down_color;
                }
            }

            ctx.rect(x - bar_w / 2, y, bar_w, bar_height);
            ctx.fill();
        }

    }
    // 标识最大成交量
    function markVMax(ctx, v_max, y_v_end) {
        ctx.beginPath();
        ctx.fillStyle = '#999';
        ctx.textBaseline = "top";
        ctx.fillText(common.format_unit(v_max), 0, y_v_end + 10);
        ctx.stroke();
    }
    // 获取最大成交量
    function getVMax(data) {
        if (data.data[0]) {
            var max = data.data[0].volume;
        } else {
            var max = 0;
        }

        for (var i = 0, item = data.data; i < data.data.length; i++) {
            if (max < item[i].volume) {
                max = item[i].volume;
            }
        }
        return max
    }

    return DrawV;
})();

module.exports = DrawV;
