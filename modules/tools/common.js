var common = {
    // 由股票代码判断股票上市场所，1(沪市)或2(深市)或5(港股)
    getMktByCode: function(code) {
        if (code.Length < 3)
            return code + "1";
        var one = code.substr(0, 1);
        var three = code.substr(0, 3);
        if (one == "5" || one == "6" || one == "9") {
            return code + "1";
        } else {
            if (three == "009" || three == "126" || three == "110" || three == "201" || three == "202" || three == "203" || three == "204") {
                return code + "1";
            } else {
                return code + "2";
            }
        }   
    },
    // 数字标准化，字符串输出，例如：9----->09
    fixed: function(str, len) {
        var i = 0;
        str = str.toString();
        var result = str;
        for (i = 0; i < len - str.length; i++) {
            result = '0' + result;
        }

        return result;
    },
    // 日期标准化，字符串输出，例如: 20121112---->2012-11-12
    transform: function(str) {
        return str.replace(/(\d{4})(\d{2})(\d{2})/g, function(whole, a, b, c) {
            return a + "-" + b + "-" + c;
        });
    },
    // 将鼠标坐标转换为Canvas坐标
    windowToCanvas: function(canvas,x,y){
        var box = canvas.getBoundingClientRect();
        return {
            // x:(x-box.left)*(canvas.width/box.width),
            // y:(y-box.top)*(canvas.height/box.height)

            x: x*this.options.dpr,
            y: y*this.options.dpr
        };
    },
    // 将Canvas坐标转换为鼠标坐标
    canvasToWindow: function(canvas,x,y){
        var box = canvas.getBoundingClientRect();
        // 相对于窗口
        // return {
        //     x:(x *(box.width/canvas.width)+box.left),
        //     y:(y *(box.height/canvas.height)+box.top + this.options.canvas_offset_top/this.options.dpr)
        // };
        return {
            x:x/this.options.dpr,
            // x:x * (box.width/canvas.width),
            y:(y+this.options.canvas_offset_top) * (box.height/canvas.height)
        };
    },
    // 图表y轴坐标计算
    get_y: function(y) {
        return this.options.c_1_height - (this.options.c_1_height * (y - this.options.data.min)/(this.options.data.max - this.options.data.min));
    },
    // 图表x轴坐标计算
    get_x: function(x) {
        var canvas = this.options.context.canvas;
        var type = this.options.type;
        var rect_w = this.options.rect_unit.rect_w;
        var num = this.options.data.data.length;
        var total = this.options.data.total;
        var padding_left = this.options.padding_left;
        var dpr = this.options.dpr;

        if(type == "TL"){
            return (canvas.width-padding_left) / total * x + padding_left;
        }else{
            return (canvas.width-padding_left) / num * x + padding_left - (rect_w/2);
        }
        
    },
    // 图表x轴坐标计算
    get_rect: function(canvas,num) {
        var rect_w = (canvas.width-this.options.padding_left) / num;
        var bar_w = rect_w * (1 - this.options.spacing);
        return {
            rect_w:rect_w,
            bar_w:bar_w
        };
    },
    // 格式化数据单位
    format_unit: function(value,num){
        num = num == undefined ? 2 : num;
        if(value < 10000){
            return value;
        }else if(value >= 10000 && value < 100000000){
            return (value/10000).toFixed(num) + "万";
        }else if(value >= 100000000){
            return (value/100000000).toFixed(num) + "亿";
        }else{
            return value;
        }
    }

};
module.exports = common;
