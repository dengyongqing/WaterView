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
    windowToCanvas: function(canvas, x, y) {
        // var box = canvas.getBoundingClientRect();
        return {
            // x:(x-box.left)*(canvas.width/box.width),
            // y:(y-box.top)*(canvas.height/box.height)

            x: x * this.options.dpr,
            y: y * this.options.dpr
        };
    },
    // 将Canvas坐标转换为鼠标坐标
    canvasToWindow: function(canvas, x, y) {
        var box = canvas.getBoundingClientRect();
        // 相对于窗口
        // return {
        //     x:(x *(box.width/canvas.width)+box.left),
        //     y:(y *(box.height/canvas.height)+box.top + this.options.canvas_offset_top/this.options.dpr)
        // };
        return {
            x: x / this.options.dpr,
            // x:x * (box.width/canvas.width),
            y: (y + this.options.canvas_offset_top) * (Math.abs(box.bottom - box.top) / canvas.height)
        };
    },
    // 图表y轴坐标计算
    get_y: function(y) {

        var max = (this.options.currentData && this.options.currentData.max) || this.options.data.max;
        var min = (this.options.currentData && this.options.currentData.min) || this.options.data.min;
        return this.options.c_k_height - (this.options.c_k_height * (y - min) / (max - min));
    },
    // 图表x轴坐标计算
    get_x: function(x) {
        var canvas = this.options.context.canvas;
        var type = this.options.chartType;
        var rect_w = this.options.rect_unit.rect_w;
        var num = (this.options.currentData && this.options.currentData.data.length) || this.options.data.data.length;
        var total = (this.options.currentData && this.options.currentData.total) || this.options.data.total;
        var padding_left = this.options.padding.left;
        var padding_right = this.options.padding.right;
        // var dpr = this.options.dpr;

        if (type == "TL") {
            return (canvas.width - padding_left - padding_right) / total * x + padding_left;
        } else {
            return (canvas.width - padding_left - padding_right) / num * x + padding_left - (rect_w / 2);
        }

    },
    // 图表x轴坐标计算
    get_rect: function(canvas, num) {
        var rect_w = (canvas.width - this.options.padding.left - this.options.padding.right) / num;
        var bar_w = rect_w * (1 - this.options.spacing);
        return {
            rect_w: rect_w,
            bar_w: bar_w
        };
    },
    // 格式化数据单位  
    format_unit: function(value, num) {
        num = num == undefined ? 2 : num;
        var flag = false;
        if(value < 0){
            value = Math.abs(value);
            flag = true;
        }
        
        var temp_value = 0;
        var unit = "";

        if(flag){
            if (value < 10000) {
                temp_value = (value/1);
            } else if (value >= 10000 && value < 100000000) {
                temp_value = (value / 10000);
                unit = "万";
            } else if (value >= 100000000) {
                temp_value = (value / 100000000);
                unit = "亿";
            } else {
                temp_value = (value/1);
            }
            temp_value = temp_value * (-1);

        }else{
            if (value < 10000) {
                temp_value = (value/1);
            } else if (value >= 10000 && value < 100000000) {
                temp_value = (value / 10000);
                unit = "万";
            } else if (value >= 100000000) {
                temp_value = (value / 100000000);
                unit = "亿";
            } else {
                temp_value = (value/1);
            }
        }

        if((temp_value/1).toFixed(num)/1 == (temp_value/1).toFixed(0)/1){
            num = 0;
        }
        
        return (temp_value/1).toFixed(num) + unit;
    },
    /**
     * 兼容性的事件添加
     * @param {[type]}   obj  对哪个元素添加
     * @param {[type]}   type 事件类型
     * @param {Function} fn   事件触发的处理函数
     */
    addEvent: function(obj, type, fn) {
        if (obj.attachEvent) {
            obj['e' + type + fn] = fn;
            obj[type + fn] = function() { obj['e' + type + fn](window.event); }
            obj.attachEvent('on' + type, obj[type + fn]);
        } else
            obj.addEventListener(type, fn, false);
    },
    removeEvent: function(obj, type, fn) {
        if (obj.detachEvent) {
            obj.detachEvent('on' + type, obj[type + fn]);
            obj[type + fn] = null;
        } else
            obj.removeEventListener(type, fn, false);
    }

};
module.exports = common;
