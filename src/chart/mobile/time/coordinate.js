var coordinate = {
    
    // 将鼠标坐标转换为Canvas坐标
    windowToCanvas: function(canvas,x,y){
        // var box = canvas.getBoundingClientRect();
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
        // var dpr = this.options.dpr;
        return (canvas.width-padding_left) / total * x + padding_left;
    }
   
};
module.exports = coordinate;
