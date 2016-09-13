// 工具
var common = require('chart/web/common/common'); 
// cookie
var EMcookie = require('chart/web/common/cookie'); 
function setPreference(){
    var _this = this;
    var preference = document.createElement("div");
    preference.className = "preference-container";
    preference.style.top = this.options.c2_y_top + "px";
    preference.style.left = this.options.padding.left + "px";
    preference.style.width = this.options.drawWidth + "px";
    preference.style.height = this.options.canvas.height - this.options.c2_y_top + this.options.unit_height + "px";
    
    var preference_shade = document.createElement("div");
    preference_shade.className = "preference-shade";
   

    var handle = document.createElement("div");
    handle.className = "preference-handle";
    handle.innerHTML = "偏好<br/>设置";
    handle.style.top = this.options.c2_y_top + "px";
    handle.style.left = this.options.padding.left + this.options.drawWidth - 2 + "px";
    
    var set_container = document.createElement("div");
    set_container.className = "set-container";
    set_container.style.top = "30px";
    set_container.style.left = "100px";

    var tab = document.createElement("div");
    tab.className = "set-tab";
    var ma_tab = document.createElement("div");
    ma_tab.className = "ma-tab current";
    ma_tab.innerHTML = "均线设置";
    var right_tab = document.createElement("div");
    right_tab.className = "right-tab";
    right_tab.innerHTML = "默认复权";

    var ma_panel = document.createElement("div");
    ma_panel.className = "ma-panel";

    var notice = document.createElement("div");
    notice.className = "pre-notice";
    notice.innerHTML = "将天数设为0或留空可以隐藏改MA均线";

    item_count = 1;

    var ma5_item = addItem(1);
    var ma10_item = addItem(2);
    var ma20_item = addItem(3);
    var ma30_item = addItem(4);

    ma_panel.appendChild(notice);
    ma_panel.appendChild(ma5_item.item);
    ma_panel.appendChild(ma10_item.item);
    ma_panel.appendChild(ma20_item.item);
    ma_panel.appendChild(ma30_item.item);

    var right_panel = document.createElement("div");
    right_panel.className = "right-panel";

    var right_panel_strings = ["默认不复权", "默认使用前复权", "默认使用后复权"];
    var right_panel_frag = document.createDocumentFragment();
    var right_default_value = EMcookie.getCookie("right_default_value") == null ? 0 : EMcookie.getCookie("right_default_value");
    for(var i = 0; i < right_panel_strings.length; i++){
        var radio = document.createElement("input");
        radio.setAttribute("type", "radio");
        radio.setAttribute("name", "rehabilitation");
        radio.setAttribute("value", i);
        if(i == right_default_value)
            radio.setAttribute("checked", true);
        var label = document.createElement("label");
        label.style.marginLeft = "10px";
        label.innerHTML = radio.outerHTML + "&nbsp;" + right_panel_strings[i];
        // label.appendChild(radio.outerHTML + );
        var br = document.createElement('br');
        // right_panel_frag.appendChild(radio);
        right_panel_frag.appendChild(label);
        right_panel_frag.appendChild(br);
    }
    var right_panel_form = document.createElement("form");
    right_panel_form.className = "right-panel-form";
    right_panel_form.appendChild(right_panel_frag);
    right_panel.appendChild(right_panel_form);

    var right_panel_comfirmeBtn = document.createElement("button");
    right_panel_comfirmeBtn.innerHTML = "确认修改";
    right_panel_comfirmeBtn.className = "right-panel-btn";


    common.addEvent(right_panel_comfirmeBtn, "click", function(){
        var arr=document.getElementsByName("rehabilitation")
        for (var i=0;i<arr.length;i++){ //遍历Radio 
            if(arr[i].checked){ 
                var chk_value=arr[i].value; 
                if(chk_value == 0){
                    _this.beforeBackRight();
                }else if(chk_value == 1){
                    _this.beforeBackRight(1);
                }
                else if(chk_value == 2){
                    _this.beforeBackRight(2);
                }
            } 
        } 

        EMcookie.setCookie("right_default_value", chk_value, 5*365*24*60*60, "/");
        handle.innerHTML = "偏好<br/>设置";
        preference.style.display = "none";
        handle_flag = true;

        _this.options.color.m5Color = ma5_item.pick.style.backgroundColor;
        _this.options.maColor[0] = ma5_item.pick.style.backgroundColor;
        EMcookie.setCookie("ma1_default_color", ma5_item.pick.style.backgroundColor, 5*365*24*60*60, "/");
        EMcookie.setCookie("ma1_default_num", ma5_item.input.value, 5*365*24*60*60, "/");

        _this.options.color.m10Color = ma10_item.pick.style.backgroundColor;
        _this.options.maColor[1] = ma10_item.pick.style.backgroundColor;
        EMcookie.setCookie("ma2_default_color", ma10_item.pick.style.backgroundColor, 5*365*24*60*60, "/");
        EMcookie.setCookie("ma2_default_num", ma10_item.input.value, 5*365*24*60*60, "/");

        _this.options.color.m20Color = ma20_item.pick.style.backgroundColor;
        _this.options.maColor[2] = ma20_item.pick.style.backgroundColor;
        EMcookie.setCookie("ma3_default_color", ma20_item.pick.style.backgroundColor, 5*365*24*60*60, "/");
        EMcookie.setCookie("ma3_default_num", ma20_item.input.value, 5*365*24*60*60, "/");

        _this.options.color.m30Color = ma30_item.pick.style.backgroundColor;
        _this.options.maColor[3] = ma30_item.pick.style.backgroundColor;
        EMcookie.setCookie("ma4_default_color", ma30_item.pick.style.backgroundColor, 5*365*24*60*60, "/");
        EMcookie.setCookie("ma4_default_num", ma30_item.input.value, 5*365*24*60*60, "/");

        _this.drawMA(_this.options.start, _this.options.end);
        _this.options.interactive.markMA(_this.options.canvas, "junxian", _this.options["junxian"], _this.options.start, _this.options.end, "",_this.options.maColor);

    });

    var right_panel_cancleBtn = document.createElement("button");
    right_panel_cancleBtn.innerHTML = "取消修改";
    right_panel_cancleBtn.className = "right-panel-btn";
    
    common.addEvent(right_panel_cancleBtn, "click", function(){
        handle.innerHTML = "偏好<br/>设置";
        preference.style.display = "none";
        handle_flag = true;
    });


    right_panel.style.display = "none";

    tab.appendChild(ma_tab);
    tab.appendChild(right_tab);
    set_container.appendChild(tab);
    set_container.appendChild(ma_panel);
    set_container.appendChild(right_panel);
    set_container.appendChild(right_panel_comfirmeBtn);
    set_container.appendChild(right_panel_cancleBtn);

    preference.appendChild(preference_shade);
    preference.appendChild(set_container);

    var pick_html = '<div class="colorPadTriangle"></div>'+
                    '<table class="colorTable"><tr><td style="background-color: #FE0000;"></td>'+
                    '<td style="background-color: #FDA748;"></td>'+
        '<td style="background-color: #A7DA19;"></td>'+
        '<td style="background-color: #57A9FF;"></td>'+
    '</tr>'+
    '<tr>'+
        '<td style="background-color: #FF5AFF;"></td>'+
        '<td style="background-color: #F73323;"></td>'+
        '<td style="background-color: #1CA41C;"></td>'+
        '<td style="background-color: #047DFF;"></td>'+
    '</tr>'+
    '<tr>'+
        '<td style="background-color: #FC93B2;"></td>'+
        '<td style="background-color: #B80000;"></td>'+
        '<td style="background-color: #007E3F;"></td>'+
        '<td style="background-color: #0766C4;"></td>'+
    '</tr>'+
    '<tr>'+
        '<td style="background-color: #9A2574;"></td>'+
        '<td style="background-color: #984300;"></td>'+
        '<td style="background-color: #984300;"></td>'+
        '<td style="background-color: #305895;"></td>'+
    '</tr></table>';



    var pick_html_div = document.createElement("div");
    pick_html_div.className = "colorPad";
    pick_html_div.innerHTML = pick_html;

    ma_panel.appendChild(pick_html_div);


    preference.style.display = "none";

    this.container.appendChild(handle);
    this.container.appendChild(preference);

    _this.options.pickColor = {};

    var handle_flag = true;
    common.addEvent(handle,"click",function(e){
        if(handle_flag){
            preference.style.display = "block";
            handle.innerHTML = "关闭<br/>设置";
            handle_flag = false;
        }else{
            handle.innerHTML = "偏好<br/>设置";
            preference.style.display = "none";
            handle_flag = true;
        }
    });

    common.addEvent(ma_tab,"click",function(e){
        ma_panel.style.display = "block";
        if(ma_tab.className.indexOf("current") < 0){
            ma_tab.className = ma_tab.className + " current";
        }
        right_panel.style.display = "none";
        right_tab.className = right_tab.className.replace(" current","");
    });

    common.addEvent(right_tab,"click",function(e){
        ma_panel.style.display = "none";
        ma_tab.className = ma_tab.className.replace(" current","");
        right_panel.style.display = "block";
        if(right_tab.className.indexOf("current") < 0){
            right_tab.className = right_tab.className + " current";
        }
    });

    common.addEvent(ma5_item.pick,"click",function(e){
        _this.options.pickColor.ma = ma5_item.pick;
        _this.options.pickColor.mark = "ma5";
        var target = e.srcElement || e.target;
        var y = target.offsetY || target.offsetTop;
        var x = target.offsetX || target.offsetLeft;
        pick_html_div.style.left = x + 28 + "px";
        pick_html_div.style.top = y - 7 + "px";
        pick_html_div.style.display = "block";
    });

    common.addEvent(ma10_item.pick,"click",function(e){
        _this.options.pickColor.ma = ma10_item.pick;
        _this.options.pickColor.mark = "ma10";
         var target = e.target || e.srcElement;
        var y = target.offsetTop ;
        var x = target.offsetLeft;
        pick_html_div.style.left = x + 28 + "px";
        pick_html_div.style.top = y - 7 + "px";
        pick_html_div.style.display = "block";
    });

    common.addEvent(ma20_item.pick,"click",function(e){
        _this.options.pickColor.ma = ma20_item.pick;
        _this.options.pickColor.mark = "ma20";
        var target = e.target || e.srcElement;
        var y = target.offsetTop ;
        var x = target.offsetLeft;
        pick_html_div.style.left = x + 28 + "px";
        pick_html_div.style.top = y - 7 + "px";
        pick_html_div.style.display = "block";
    });
   
    common.addEvent(ma30_item.pick,"click",function(e){
        _this.options.pickColor.ma = ma30_item.pick;
        _this.options.pickColor.mark = "ma30";
        var target = e.target || e.srcElement;
        var y = target.offsetTop ;
        var x = target.offsetLeft;
        pick_html_div.style.left = x + 28 + "px";
        pick_html_div.style.top = y - 7 + "px";
        pick_html_div.style.display = "block";
    });

    common.addEvent(pick_html_div,"click",function(e){
        var target = e.srcElement || e.target;
        var color = target.style.backgroundColor;
        // alert(DataTime.MaxValue);
        if(color){
            
            _this.options.pickColor.ma.style.backgroundColor = color;
        }
        pick_html_div.style.display = "none";

       
    });

    function addItem(num){

        var ma_default_value = EMcookie.getCookie("ma" + num + "_default_num") == "" ? 5 : EMcookie.getCookie("ma" + num + "_default_num");
        var ma_default_color = EMcookie.getCookie("ma" + num + "_default_color");

        var item_input = document.createElement("input");
        item_input.setAttribute("type","text");

        item_input.value = ma_default_value;
        item_input.className = "ma-item-input";
        
        if(num == 1){
            var temp1_span = document.createElement("span");
            temp1_span.innerHTML = "第"+item_count+"条";

            var temp2_span = document.createElement("span");
            temp2_span.innerHTML = "日移动平均线&nbsp;设置颜色&nbsp;";
            // var text = "第"+item_count+"条"+ item_input.outerHTML + "日移动平均线&nbsp;设置颜色&nbsp;";
        }else{
            var temp1_span = document.createElement("span");
            temp1_span.innerHTML = "第"+item_count+"条";

            var temp2_span = document.createElement("span");
            temp2_span.innerHTML = "日移动平均线&nbsp;设置颜色&nbsp;";
        }
        item_count++;
        var ma_item = document.createElement("div");
        ma_item.className = "ma-item";
        // var item_span = document.createElement("span");
        // item_span.className = "item-span";
        // item_span.innerHTML = text;

        var span_color = document.createElement("span");
        span_color.className = "span-setting setting-span-ma" + num;
        if(ma_default_color){
            span_color.style.backgroundColor = ma_default_color;
        }
        ma_item.appendChild(temp1_span);
        ma_item.appendChild(item_input);
        ma_item.appendChild(temp2_span);
        ma_item.appendChild(span_color);

        common.addEvent(item_input,"mouseleave",function(e){
            var target = e.target || e.srcElement;
            var input_value = target.value;
;
            if(isNaN(input_value) || input_value < 0){
                if(num == 1){
                    target.value = 5;
                }else if(num == 2){
                    target.value = 10;
                }else if(num == 3){
                    target.value = 20;
                }else if(num == 4){
                    target.value = 30;
                }
                
            }
        });

        return {
            item:ma_item,
            pick:span_color,
            input:item_input
        };
    }

}

module.exports = setPreference;