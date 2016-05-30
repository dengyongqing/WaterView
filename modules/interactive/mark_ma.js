/*工具*/
var common = require('common');

/*绘制移动平均线标识*/
function MarkMa(canvas,obj_5,obj_10,obj_20){
    var c_box = canvas.getBoundingClientRect();
    var dpr = this.options.dpr;
    if(!this.options.mark_ma){
        this.options.mark_ma = {};
        var div_mark = document.createElement("div"); 
        div_mark.className = "mark-ma";
        div_mark.style.top = "10px";
        this.options.mark_ma.mark_ma = div_mark;
        
        /*创建文档碎片*/
        var frag = document.createDocumentFragment();

        /*5日均线*/
        var ma_5_data = document.createElement('span');
        ma_5_data.className = "span-m5";
        if(obj_5){
            ma_5_data.innerText = "MA5: " + obj_5.value;
        }else{
            ma_5_data.innerText = "MA5: -";
        }
        this.options.mark_ma.ma_5_data = ma_5_data;
       
        /*10日均线*/
        var ma_10_data = document.createElement('span');
        ma_10_data.id = "ma_10_data";
        ma_10_data.className = "span-m10";
        if(obj_10){
            ma_10_data.innerText = "MA10: " + obj_10.value;
        }else{
            ma_10_data.innerText = "MA10: -";
        }
        this.options.mark_ma.ma_10_data = ma_10_data;

        /*20日均线*/
        var ma_20_data = document.createElement('span');
        ma_20_data.id = "ma_20_data";
        ma_20_data.className = "span-m20";
        if(obj_20){
            ma_20_data.innerText = "MA20: " + obj_20.value;
        }else{
            ma_20_data.innerText = "MA20: -";
        }
        this.options.mark_ma.ma_20_data = ma_20_data;

        frag.appendChild(ma_5_data);
        frag.appendChild(ma_10_data);
        frag.appendChild(ma_20_data);
        div_mark.appendChild(frag);
        document.getElementById(this.options.container).appendChild(div_mark);
        // div_tip.style.left = w_pos.x - 300 + "px";
    }else{
        var div_mark = this.options.mark_ma.mark_ma; 
        if(obj_5){
           this.options.mark_ma.ma_5_data.innerText = "MA5: " + obj_5.value;
        }else{
            this.options.mark_ma.ma_5_data.innerText = "MA5: -";
        }

        if(obj_10){
            this.options.mark_ma.ma_10_data.innerText = "MA10: " + obj_10.value;
        }else{
            this.options.mark_ma.ma_10_data.innerText = "MA10: -";
        }

        if(obj_20){
            this.options.mark_ma.ma_20_data.innerText = "MA20: " + obj_20.value;
        }else{
            this.options.mark_ma.ma_20_data.innerText = "MA20: -";
        }
        
    }
    
}

module.exports = MarkMa;