/**
 * 绘制K线
 *
 * this:{
 *     container:画布的容器
 *     interactive:图表交互
 * }
 * this.options:{
 *     data:    行情数据
 *     type:    "TL"(分时图),"DK"(日K线图),"WK"(周K线图),"MK"(月K线图)
 *     canvas:  画布对象
 *     ctx:     画布上下文
 * }
 *
 */

/*继承*/
var extend = require('tools/extend2');
/*主题*/
var theme = require('theme/default');
var DrawBar = (function(){
    function DrawBar(options){
        // 设置默认参数
        this.defaultoptions = theme.drawLine;
        this.options = extend(this.defaultoptions, options);
        
        // 绘图
        this.draw();
    };
    
    // 绘图
    DrawBar.prototype.draw = function(){

        var ctx = this.options.context;
        ctx.lineWidth = 1 * this.options.dpr + 1;
        // 折线数据
        var series = this.options.series;
        // 横坐标数据
        var xaxis = this.options.xaxis;


        for(var i = 0,se;se = series[i]; i++){
                var bar_arr = se.data;
                var arr_length = bar_arr.length;
                for(var j = 0;j < arr_length; j++){
                    var bar = bar_arr[j];

                    if(bar != null && bar !== "" && bar != undefined){
                        ctx.beginPath();
                    // 填充颜色
                    ctx.fillStyle = xaxis[i].colors[j] == undefined ? "#333" : xaxis[i].colors[j];
                    // 画笔颜色
                    ctx.strokeStyle = xaxis[i].colors[j] == undefined ? "#333" : xaxis[i].colors[j];
                    var x = get_x.apply(this,[i,j]);
                    var y = get_y.call(this,bar);

                    if(y >= 0 && this.options.data.min < 0){
                        var sepe_y = this.options.c_1_height * (this.options.data.max)/(this.options.data.max - this.options.data.min);
                        ctx.rect(x,y,this.options.groupUnit.bar_w,sepe_y - y);
                    }else if(y >= 0 && this.options.data.min >= 0){
                        var sepe_y = this.options.c_1_height;
                        ctx.rect(x,y,this.options.groupUnit.bar_w,sepe_y - y);
                    }else if(y < 0 && this.options.data.max >= 0){
                        var sepe_y = this.options.c_1_height * (this.options.data.max)/(this.options.data.max - this.options.data.min);
                        ctx.rect(x,sepe_y,this.options.groupUnit.bar_w,y);
                    }else if(y < 0 && this.options.data.max < 0){
                        var sepe_y = 0;
                        ctx.rect(x,sepe_y,this.options.groupUnit.bar_w,y);
                    }


                    // if(y >= 0 && this.options.data.min < 0){
                    //     var sepe_y = this.options.c_1_height * (this.options.data.max)/(this.options.data.max - this.options.data.min);
                    //     ctx.rect(x,sepe_y,this.options.groupUnit.bar_w,sepe_y - y);
                    // }else if(y >= 0 && this.options.data.min >= 0){

                    // }else{
                    //     ctx.rect(x,this.options.c_1_height/2,this.options.groupUnit.bar_w,y);
                    // }
                    ctx.fill();
                }
                
            }
            
        }
     
    };

    // 图表y轴坐标计算
    function get_y(y) {
        var sepe_max_min = this.options.data.max - this.options.data.min;
        if(y >= 0 && this.options.data.min < 0){
            var up_height = this.options.c_1_height * (this.options.data.max)/sepe_max_min;
            return up_height - this.options.c_1_height * y/sepe_max_min;
        }else if(y >= 0 && this.options.data.min >= 0){
            var up_height = this.options.c_1_height;
            return up_height - this.options.c_1_height * (y - this.options.data.min)/sepe_max_min;
        }else if(y < 0 && this.options.data.max >= 0){
            var sepe_y = this.options.c_1_height * (this.options.data.max)/sepe_max_min;
            // var down_height = sepe_y + this.options.c_1_height * Math.abs(this.options.data.min)/sepe_max_min;
            return this.options.c_1_height * Math.abs(y)/sepe_max_min + sepe_y;        
        }else if(y < 0 && this.options.data.max < 0){
            return this.options.c_1_height * Math.abs(y)/sepe_max_min + 0;        
        }
    }
    // 图表x轴坐标计算
    function get_x(year_num,quarter_num) {
        var group = this.options.group;
        var groupUnit = this.options.groupUnit;
        var padding_left = this.options.padding_left;
        var year_sepe = this.options.group.rect_w - this.options.group.bar_w;
        var quarter_sepe = this.options.groupUnit.rect_w - this.options.groupUnit.bar_w;
        return group.rect_w * year_num + padding_left + groupUnit.rect_w * quarter_num + year_sepe/2 + quarter_sepe/2;
    }

    return DrawBar;
})();

module.exports = DrawBar;