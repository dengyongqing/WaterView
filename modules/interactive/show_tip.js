/*弹出窗显示行情数据*/
function ShowTip(canvas,x,obj){
    var c_box = canvas.getBoundingClientRect();
    var type = this.options.type;
    if(!this.options.tip){
        this.options.tip = {};
        /*创建外部包裹元素*/
        var div_tip = document.createElement("div"); 
        div_tip.className = "show-tip";

        this.options.tip.tip = div_tip;
        
        /*创建文档碎片*/
        var frag = document.createDocumentFragment();

        /*创建收盘价格*/
        var close_data = document.createElement('span');
        close_data.className = "span-price";
        this.options.tip.close = close_data;
       
        /*创建百分比*/
        var percent = document.createElement('span');
        this.options.tip.percent = percent;
        
        /*创建股数*/
        var count = document.createElement('span');
        this.options.tip.count = count;
        
        /*创建时间*/
        var time = document.createElement('span');
        this.options.tip.time = time;
        
        frag.appendChild(close_data);
        frag.appendChild(percent);
        frag.appendChild(count);
        frag.appendChild(time);
        div_tip.appendChild(frag);
        document.getElementById(this.options.container).appendChild(div_tip);

        if(type == "DK" || type == "WK" || type == "MK"){
            close_data.innerText = obj.close;
            percent.innerText = obj.percent+'%';
            count.innerText = obj.volume+'万手';
            time.innerText = obj.data_time;

            div_tip.style.top = c_box.top - div_tip.clientHeight + "px";
        }else if(type == "TL"){
            close_data.innerText = obj.price;
            percent.innerText = obj.percent+'%';
            count.innerText = obj.volume+'手';
            time.innerText = obj.time;
            div_tip.style.top = c_box.top - div_tip.clientHeight + "px";
            div_tip.style.width = "120px";
            close_data.className = close_data.className + " span-time-c1";
            percent.className = percent.className + " span-time-c2";
            count.className = count.className + " span-time-c1"
            time.className = time.className + " span-time-c2";
        }

    }else{
        var div_tip = this.options.tip.tip;
       
        if(type == "DK" || type == "WK" || type == "MK"){
            this.options.tip.close.innerText = obj.close;
            this.options.tip.percent.innerText = obj.percent+'%';
            this.options.tip.count.innerText = obj.volume+'万手';
            this.options.tip.time.innerText = obj.data_time.replace(/-/g,"/");
        }else if(type == "TL"){
            this.options.tip.close.innerText = obj.price;
            this.options.tip.percent.innerText = obj.percent+'%';
            this.options.tip.count.innerText = obj.volume+'手';
            this.options.tip.time.innerText = obj.time;
        }
    }

    if(obj && obj.up){
        div_tip.style.backgroundColor = this.options.up_color;
    }else if(obj && !obj.up){
        div_tip.style.backgroundColor = this.options.down_color;
    }

    // if((c_box.left + div_tip.clientWidth/2) >= x){
    if(x <= (c_box.left + div_tip.clientWidth/2 + this.options.padding_left/this.options.dpr)){
        div_tip.style.left = c_box.left + this.options.padding_left/this.options.dpr + "px";
    }else if(x >= (c_box.left + canvas.width/this.options.dpr - div_tip.clientWidth/2)){
        div_tip.style.left = c_box.left + canvas.width/this.options.dpr - div_tip.clientWidth + "px";
    }else{
        div_tip.style.left = x - div_tip.clientWidth/2 + "px";
    }
}

module.exports = ShowTip;