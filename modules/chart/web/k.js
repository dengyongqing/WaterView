/**
 * 绘制手机K线图
 *
 * this:{
 *     container:画布的容器
 *     interactive:图表交互
 * }
 * this.options:{
 *     data:    行情数据
 *     canvas:  画布对象
 *     ctx:     画布上下文
 * }
 *
 */
 
// 绘制坐标轴
var DrawXY = require('chart/web/k/draw_xy');
// 主题
var theme = require('theme/default');
// 获取K线图数据
var GetDataK = require('getdata/web/chart_k'); 
// 获取技术指标数据
var GetTeacData = require('getdata/web/chart_tecIndex'); 
// 绘制K线图
var DrawK = require('chart/web/common/draw_k'); 
// 绘制rsi指标
var DrawRSI = require('chart/web/k/draw_rsi');
// 绘制kdj指标
var DrawKDJ = require('chart/web/k/draw_kdj');
// 绘制wr指标
var DrawWR = require('chart/web/k/draw_wr');
// 绘制dmi指标
var DrawDMI = require('chart/web/k/draw_dmi');
// 绘制bias指标
var DrawBIAS = require('chart/web/k/draw_bias');
// 绘制obv指标
var DrawOBV = require('chart/web/k/draw_obv');
// 绘制cci指标
var DrawCCI = require('chart/web/k/draw_cci');
// 绘制roc指标
var DrawROC = require('chart/web/k/draw_roc');
// 绘制expma指标
var DrawEXPMA = require('chart/web/k/draw_expma');
// 绘制sar指标
var DrawSAR = require('chart/web/k/draw_sar');
// 绘制boll指标
var DrawBOLL = require('chart/web/k/draw_boll');
// 绘制bbi指标
var DrawBBI = require('chart/web/k/draw_bbi');
// 绘制macd指标
var DrawMACD = require('chart/web/k/draw_macd');
// 工具
var common = require('chart/web/common/common'); 
// 交互效果
var Interactive = require('chart/web/common/interactive'); 
// 滑块
var slideBar = require('chart/web/k/slideBar');
// 拓展，合并，复制
var extend = require('tools/extend2');
// 水印
var watermark = require('chart/watermark');
// 偏好设置
var setPreference = require('chart/web/k/set_preference');
// cookie
var EMcookie = require('tools/cookie');

var dynamicMA = require('chart/web/k/dynamicMA');

var ChartK = (function() {

    function ChartK(options) {
        this.defaultoptions = theme.chartK;
        // this.options = {};
        // extend(true, this.options, theme.defaulttheme, this.defaultoptions, options);
        this.options = extend(theme.defaulttheme,this.defaultoptions,options);

        // 图表容器
        this.container = document.getElementById(options.container);

        this.container.className = this.container.className.replace(/emcharts-container/g, "").trim();
        this.container.className = this.container.className + " emcharts-container";
        // 图表加载完成事件
        this.options.onChartLoaded = options.onChartLoaded == undefined ? function(op){

        }:options.onChartLoaded;


        // 前后复权，默认不复权
        if(!window.authorityType){
             window.authorityType = EMcookie.getCookie("beforeBackRight");
        }
       
        window.authorityType = (window.authorityType == null || window.authorityType == undefined) ? "fa" : window.authorityType;
        if(window.authorityType == ""){
            this.options.authorityType = "不复权";
        }else if(window.authorityType == "fa"){
            this.options.authorityType = "前复权";
        }else if(window.authorityType == "ba"){
            this.options.authorityType = "后复权";
        }else{
            this.options.authorityType = "前复权";
        }

    }

    /*初始化*/
    ChartK.prototype.init = function() {
        this.options.type = this.options.type == undefined ? "K" : this.options.type;
        var canvas = document.createElement("canvas");
        // 去除画布上粘贴效果
        this.container.style.position = "relative";
        // 兼容IE6-IE9
        try {
            var ctx = canvas.getContext('2d');
        } catch (error) {
            canvas = window.G_vmlCanvasManager.initElement(canvas);
            var ctx = canvas.getContext('2d');
        }
        this.options.canvas = canvas;
        this.options.context = ctx;
        // 设备像素比
        var dpr = this.options.dpr = 1;
        // 容器中添加画布
        this.container.innerHTML = "";
        this.container.appendChild(canvas);
        // 画布的宽和高
        canvas.width = this.options.width * dpr;
        canvas.height = this.options.height * dpr;

        this.options.up_color = "#ff0000";
        this.options.down_color = "#17b03e";

        // 缩放默认值
        this.options.scale_count = this.options.scale_count == undefined ? false : this.options.scale_count;
        
        canvas.style.width = this.options.width + "px";
        canvas.style.height = this.options.height + "px";
        canvas.style.border = "0";

        

        // 画笔参数设置
        ctx.font = (this.options.font_size * this.options.dpr) + "px Arial";
        ctx.lineWidth = 1 * this.options.dpr;
        ctx.strokeStyle = 'rgba(230,230,230, 1)';
        ctx.fillStyle = '#717171';
        ctx.textBaseline = "middle";
        this.options.color = {};
        this.options.color.strokeStyle = 'rgba(230,230,230, 1)';
        this.options.color.fillStyle = '#717171';

        this.options.color.m5Color = EMcookie.getCookie("ma1_default_color") == null ? "#f4cb15" : EMcookie.getCookie("ma1_default_color");
        this.options.color.m10Color = EMcookie.getCookie("ma2_default_color") == null ? "#ff5b10" : EMcookie.getCookie("ma2_default_color");
        this.options.color.m20Color = EMcookie.getCookie("ma3_default_color") == null ? "#488ee6" : EMcookie.getCookie("ma3_default_color");
        this.options.color.m30Color = EMcookie.getCookie("ma4_default_color") == null ? "#fe59fe" : EMcookie.getCookie("ma4_default_color");
        this.options.maColor = [this.options.color.m5Color,this.options.color.m10Color,this.options.color.m20Color,this.options.color.m30Color];
        this.options.TColor = ["#f4cb15","#ff5b10","#488ee6","#fe59fe"];

        this.options.padding = {};
        this.options.padding.left = ctx.measureText("+100000万").width;
        this.options.padding.right = 60;
        this.options.padding.top = 0
        this.options.padding.bottom = 0;
        this.options.drawWidth = canvas.width - this.options.padding.left - this.options.padding.right;

        this.options.y_sepe_num = 20;
        this.options.x_sepe_num = 10;

        this.options.unit_height = canvas.height * 1 / this.options.y_sepe_num;
        this.options.unit_width = canvas.width * 1 / this.options.x_sepe_num;
        this.options.c1_y_top = canvas.height * 1 / this.options.y_sepe_num;
        this.options.c2_y_top = canvas.height * 10 / this.options.y_sepe_num;
        this.options.c3_y_top = canvas.height * 14 / this.options.y_sepe_num;
        this.options.c4_y_top = canvas.height * 18 / this.options.y_sepe_num;

        // K线区域的高度
        this.options.c_k_height = canvas.height * 8 / this.options.y_sepe_num;
        // 成交量区域的高度
        this.options.c_v_height = canvas.height * 3 / this.options.y_sepe_num;
        this.options.v_base_height = this.options.c_v_height * 0.9;
        // 技术指标区域的高度
        this.options.c_t_height = canvas.height * 2 / this.options.y_sepe_num;


        this.options.margin = {};
        this.options.margin.left = 0;
        this.options.margin.top = canvas.height * 1 / this.options.y_sepe_num;

        // 移动坐标轴
        ctx.translate("0",this.options.margin.top);
        
    };

    // 绘图
    ChartK.prototype.draw = function(callback) {
        var _this = this;
        // 删除canvas画布
        _this.clear();
        // 初始化
        _this.init();

        // 初始化交互
        var inter = _this.options.interactive = new Interactive(_this.options);
        // 显示loading效果
        inter.showLoading();

        var type = _this.options.type;
        try{
            GetDataK(getParamsObj.call(_this),function(data){

                var flag = dataCallback.apply(_this,[data]);
                if(flag){
                    // K线图均线数据标识
                    // inter.markMA(_this.options.canvas);
                    // 成交量均线数据标识
                    inter.markVMA(_this.options.canvas);

                    // 缩放
                    // inter.scale(_this.options.canvas);
        
                }
                // 传入的回调函数
                if(callback){
                    callback(null);
                }

            });
            

        }catch(e){
            // 暂无数据
            inter.showNoData();
            // 隐藏loading效果
            inter.hideLoading();
            // 传入的回调函数
            if(callback){
                callback(e);
            }
        }
        

        drawT.apply(this);
        drawKT.apply(this);
        setPreference.apply(this);
    };
    // 重绘
    ChartK.prototype.reDraw = function() {
        // 删除canvas画布
        this.clear();
        // 初始化
        this.init();
        dataCallback.call(this);
    }
    // 删除canvas画布
    ChartK.prototype.clear = function(cb) {
        try{
            var ctx = this.options.context;
            ctx.clearRect(0,0,this.options.padding.left + this.options.drawWidth,this.options.c4_y_top);
        }catch(e){
            this.container.innerHTML = "";
        }

    }

    // 获取上榜日标识dom
    ChartK.prototype.getMarkPointsDom = function(cb) {
        var points =  this.options.interactive.options.pointsContainer.children;
        return points;
    }

    function slideBarCallback(start,end){
        this.clear();

        this.options.start = start;
        this.options.end = end;

        var canvas = this.options.canvas;
        this.options.currentData = sliceData(this.options.data,start,end);
        var current_arr_length = this.options.currentData.data.length;
        

        // 获取单位绘制区域
        var rect_unit = common.get_rect.apply(this,[canvas,current_arr_length]);
        this.options.rect_unit = rect_unit;

        this.options.drawXY.options.currentData = this.options.currentData;

        this.options.drawXY.options.XMark = getXMARK.apply(this,[this.options.currentData.data]);
        this.options.drawXY.drawXYK();
        this.options.drawXY.drawXYV();
        this.options.drawXY.drawXYT();

        var up_t = this.options.up_t;
        var down_t = this.options.down_t;

        if(up_t == "junxian"){
            this.drawMA(start,end);
        }else if(up_t == "sar"){
            this.drawSAR(start,end);
        }else if(up_t == "boll"){
            this.drawBOLL(start,end);
        }else if(up_t == "bbi"){
            this.drawBBI(start,end);
        }else if(up_t == "expma"){
            this.drawEXPMA(start,end);
        }

        if(down_t == "rsi"){
            this.drawRSI(start,end);
        }else if(down_t == "kdj"){
            this.drawKDJ(start,end);
        }else if(down_t == "macd"){
            this.drawMACD(start,end);
        }else if(down_t == "wr"){
            this.drawWR(start,end);
        }else if(down_t == "dmi"){
            this.drawDMI(start,end);
        }else if(down_t == "bias"){
            this.drawBIAS(start,end);
        }else if(down_t == "obv"){
            this.drawOBV(start,end);
        }else if(down_t == "cci"){
            this.drawCCI(start,end);
        }else if(down_t == "roc"){
            this.drawROC(start,end);
        }

        drawV.apply(this);
        // 绘制成交量均线
        this.drawVMA();
        this.drawK();


    }

    //绘制k线图的各种指标
    function drawKT(){
        var _this = this;
        //首先绘制出div
        var pad = document.createElement("div");
        pad.className = "kt-pad";
        var frag = document.createDocumentFragment();
        var kt_title = document.createElement("div");
        kt_title.className = "kt-title";
        kt_title.innerHTML = "主图指标";
        frag.appendChild(kt_title);
        //
        var appendLine = function(name, frag, isDefault){
            var container = document.createElement("div");
            container.className = "kt-line";
            var radioWrap = document.createElement('div');
            radioWrap.className = "kt-radio-wrap";
            var radio = document.createElement("div");
            radio.className = isDefault ?   "kt-radio kt-radio-choose"  : "kt-radio";
            radioWrap.appendChild(radio);

            container.appendChild(radioWrap);
            var nameText = document.createElement("div");
            nameText.className = "kt-name";
            nameText.innerHTML = name;
            container.appendChild(nameText);
            //添加点击事件
            common.addEvent(container, "click", function(e){
                var targetElement;
                var currentTarget = e.srcElement || e.target;
                targetElement = container.children[0].children[0];
                var lines = container.parentNode;
                // console.log(lines);
                for(var i = 1; i < lines.children.length; i++){
                    lines.children[i].children[0].children[0].className = "kt-radio";
                }
                targetElement.className = "kt-radio kt-radio-choose";
                var lineName = container.children[1].innerHTML;
                if(lineName == "均线"){
                    _this.options.up_t = "junxian";
                    _this.drawMA(_this.options.start, _this.options.end);
                }else if(lineName == "EXPMA"){
                    _this.options.up_t = "expma";
                    _this.drawEXPMA(_this.options.start, _this.options.end);
                }else if(lineName == "SAR"){
                    _this.options.up_t = "sar";
                    _this.drawSAR(_this.options.start, _this.options.end);
                }else if(lineName == "BOLL"){
                    _this.options.up_t = "boll";
                    _this.drawBOLL(_this.options.start, _this.options.end);
                }else if(lineName == "BBI"){
                    _this.options.up_t = "bbi";
                    _this.drawBBI(_this.options.start, _this.options.end);
                }

            });

            frag.appendChild(container);
        };
        //添加各种kt指标进pad
        appendLine("均线", frag, true);
        appendLine("EXPMA", frag, false);
        appendLine("SAR", frag, false);
        appendLine("BOLL", frag, false);
        appendLine("BBI", frag, false);

        pad.appendChild(frag);
        this.container.appendChild(pad);
        
        pad.style.top = this.options.c1_y_top + "px";
        pad.style.left = this.options.canvas.width - this.options.padding.right - 10 + "px";
        
    }

    // 绘制技术指标
    function drawT(){
        var _this = this;
        var ctx = this.options.context;
        var canvas = this.options.canvas;
        var div_tech = document.createElement("div");
        div_tech.className = "tech-index";
        div_tech.style.width = this.options.drawWidth;
        div_tech.style.left = this.options.padding.left + "px";
        div_tech.style.top = canvas.height * 17 / this.options.y_sepe_num + "px";

        // rsi指标
        var rsi = document.createElement("div");
        rsi.setAttribute("id","rsi");
        rsi.className = "tech-index-item current";
        rsi.innerText = "RSI";
        rsi.style.width = this.options.drawWidth / 9 + "px";
        rsi.style.height = this.options.unit_height + "px";
        rsi.style.lineHeight = this.options.unit_height + "px";

        // kdj指标
        var kdj = document.createElement("div");
        kdj.setAttribute("id","kdj");
        kdj.className = "tech-index-item";
        kdj.innerText = "KDJ";
        kdj.style.width = this.options.drawWidth / 9 + "px";
        kdj.style.height = this.options.unit_height + "px";
        kdj.style.lineHeight = this.options.unit_height + "px";

        // macd指标
        var macd = document.createElement("div");
        macd.setAttribute("id","macd");
        macd.className = "tech-index-item";
        macd.innerText = "MACD";
        macd.style.width = this.options.drawWidth / 9 + "px";
        macd.style.height = this.options.unit_height + "px";
        macd.style.lineHeight = this.options.unit_height + "px";

        // wr指标
        var wr = document.createElement("div");
        wr.setAttribute("id","wr");
        wr.className = "tech-index-item";
        wr.innerText = "W%R";
        wr.style.width = this.options.drawWidth / 9 + "px";
        wr.style.height = this.options.unit_height + "px";
        wr.style.lineHeight = this.options.unit_height + "px";

        // dmi指标
        var dmi = document.createElement("div");
        dmi.setAttribute("id","dmi");
        dmi.className = "tech-index-item";
        dmi.innerText = "DMI";
        dmi.style.width = this.options.drawWidth / 9 + "px";
        dmi.style.height = this.options.unit_height + "px";
        dmi.style.lineHeight = this.options.unit_height + "px";

        // bias指标
        var bias = document.createElement("div");
        bias.setAttribute("id","bias");
        bias.className = "tech-index-item";
        bias.innerText = "BIAS";
        bias.style.width = this.options.drawWidth / 9 + "px";
        bias.style.height = this.options.unit_height + "px";
        bias.style.lineHeight = this.options.unit_height + "px";

        // obv指标
        var obv = document.createElement("div");
        obv.setAttribute("id","obv");
        obv.className = "tech-index-item";
        obv.innerText = "OBV";
        obv.style.width = this.options.drawWidth / 9 + "px";
        obv.style.height = this.options.unit_height + "px";
        obv.style.lineHeight = this.options.unit_height + "px";

        // cci指标
        var cci = document.createElement("div");
        cci.setAttribute("id","cci");
        cci.className = "tech-index-item";
        cci.innerText = "CCI";
        cci.style.width = this.options.drawWidth / 9 + "px";
        cci.style.height = this.options.unit_height + "px";
        cci.style.lineHeight = this.options.unit_height + "px";

        // roc指标
        var roc = document.createElement("div");
        roc.setAttribute("id","roc");
        roc.className = "tech-index-item";
        roc.innerText = "ROC";
        roc.style.width = this.options.drawWidth / 9 + "px";
        roc.style.height = this.options.unit_height + "px";
        roc.style.lineHeight = this.options.unit_height + "px";

        div_tech.appendChild(rsi);
        div_tech.appendChild(kdj);
        div_tech.appendChild(macd);
        div_tech.appendChild(wr);
        div_tech.appendChild(dmi);
        div_tech.appendChild(bias);
        div_tech.appendChild(obv);
        div_tech.appendChild(cci);
        div_tech.appendChild(roc);
        this.container.appendChild(div_tech);

        var current = rsi;

        common.addEvent.call(_this, rsi, "click",function(event){
            _this.drawRSI();
            current.className = current.className.replace(" current","");
            current = rsi;
            current.className = current.className + " current";
        });

        common.addEvent.call(_this, kdj, "click",function(event){
            _this.drawKDJ();
            current.className = current.className.replace(" current","");
            current = kdj;
            current.className = current.className + " current";
        });

        common.addEvent.call(_this, macd, "click",function(event){
            _this.drawMACD();
            current.className = current.className.replace(" current","");
            current = macd;
            current.className = current.className + " current";
        });

        common.addEvent.call(_this, wr, "click",function(event){
            _this.drawWR();
            current.className = current.className.replace(" current","");
            current = wr;
            current.className = current.className + " current";
        });

        common.addEvent.call(_this, dmi, "click",function(event){
            _this.drawDMI();
            current.className = current.className.replace(" current","");
            current = dmi;
            current.className = current.className + " current";
        });

        common.addEvent.call(_this, bias, "click",function(event){
            _this.drawBIAS();
            current.className = current.className.replace(" current","");
            current = bias;
            current.className = current.className + " current";
        });

        common.addEvent.call(_this, obv, "click",function(event){
            _this.drawOBV();
            current.className = current.className.replace(" current","");
            current = obv;
            current.className = current.className + " current";
        });

        common.addEvent.call(_this, cci, "click",function(event){
            _this.drawCCI();
            current.className = current.className.replace(" current","");
            current = cci;
            current.className = current.className + " current";
        });

        common.addEvent.call(_this, roc, "click",function(event){
            _this.drawROC();
            current.className = current.className.replace(" current","");
            current = roc;
            current.className = current.className + " current";
        });

    }

    // 绘制成交量
    function drawV(){

        var ctx = this.options.context;
        var data = this.options.currentData;
        /*成交量数组*/
        var data_arr = data.data;
        /*Y轴上的最大值*/
        // var y_max = data.max;
        /*Y轴上的最小值*/
        // var y_min = data.min;
        /*最大成交量*/
        var v_max = (data.v_max/1).toFixed(0);

        /*K线图表的高度*/
        // var c_k_height = this.options.c_k_height;
        //成交量图表的高度
        // var v_height = ctx.canvas.height - c_k_height - this.options.k_v_away - this.options.margin.top;
        var v_height = ctx.canvas.height * 3 / this.options.y_sepe_num;

        var v_base_height = this.options.v_base_height;

        var c2_y_top = this.options.c2_y_top;
        var y_v_bottom = this.options.c2_y_top + v_height;

        /*获取单位矩形对象*/
        var rect_unit = this.options.rect_unit;

        /*单位绘图矩形画布的宽度*/
        // var rect_w = rect_unit.rect_w;
        /*K线柱体的宽度*/
        var bar_w = rect_unit.bar_w;
        /*K线柱体的颜色*/
        var up_color = this.options.up_color;
        var down_color = this.options.down_color;

        //标识最大成交量
        // markVMax.apply(this,[ctx,v_max,c2_y_top]);

        ctx.lineWidth = 1;
        for(var i = 0,item; item = data_arr[i]; i++){

            var volume = item.volume;
            var is_up = item.up;
            var bar_height = volume/v_max * v_base_height;
            var x = common.get_x.call(this,i + 1);
            var y = y_v_bottom - bar_height;

            ctx.beginPath();
            ctx.moveTo(x,y);

            if(is_up){
                ctx.fillStyle = up_color;
                ctx.strokeStyle = up_color;
            }else{
                ctx.fillStyle = down_color;
                ctx.strokeStyle = down_color;
            }

            ctx.rect(x - bar_w/2,y,bar_w,bar_height);
            ctx.stroke();
            ctx.fill();

        }

    }

    // 绘制成交量均线
    ChartK.prototype.drawVMA = function(){

        var data = this.options.currentData;
        var ctx = this.options.context;
        // 图表交互
        var inter = this.options.interactive;
        var v_ma_5 = data.v_ma_5;
        var v_ma_10 = data.v_ma_10;
        var v_max = (data.v_max/1).toFixed(0);
        var v_base_height = this.options.v_base_height;
        var c2_y_top = this.options.c2_y_top;


        this.options.v_ma_5 = getMAData.apply(this,[ctx,v_ma_5, "#488ee6"]);
        this.options.v_ma_10 = getMAData.apply(this,[ctx,v_ma_10, "#f4cb15"]);
        
        inter.default_volume = data.data[data.data.length - 1];
        inter.default_vm5 = v_ma_5[v_ma_5.length - 1];
        inter.default_vm10 = v_ma_10[v_ma_10.length - 1];

        function getMAData(ctx,data_arr,color) {
            var ma_data = [];
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = color;
            for(var i = 0;i < data_arr.length; i++){
                var item = data_arr[i];
                if(item){
                     var x = common.get_x.call(this,i + 1);
                     var y = (1 - item.value / v_max) * v_base_height + c2_y_top;
                     //横坐标和均线数据
                     ma_data.push(item);
                     if(i == 0){
                        ctx.moveTo(x,y);
                     }else{
                        ctx.lineTo(x,y);
                     }
                }
                 
            }
            ctx.stroke();
            ctx.restore();
            return ma_data;
        }

        // 标识最大成交量
        function markVMax(ctx,v_max,y_v_end){
            ctx.beginPath();
            ctx.fillStyle = '#999';
            ctx.fillText(common.format_unit(v_max),0,y_v_end + 10);
            ctx.stroke();
        }

        // 获取最大成交量
        function getVMax(data){
            if(data.data[0]){
                var max = data.data[0].volume;
            }else{
                var max = 0;
            }
            
            for(var i = 0,item = data.data;i<data.data.length;i++) {
                if(max<item[i].volume)
                {
                    max=item[i].volume;
                }
            }
            return max;
        }
    }

    // 绘制均线和rsi指标
    function init_ma_rsi(){

        var _this = this;
        this.clearK();
        this.options.drawXY.drawXYK();
        this.drawK();

        var inter = this.options.interactive;

        var params = {};
        params = getParamsObj.call(this);
      
        var j1 = EMcookie.getCookie("ma1_default_num") == null ? 5 : EMcookie.getCookie("ma1_default_num");
        var j2 = EMcookie.getCookie("ma2_default_num") == null ? 10 : EMcookie.getCookie("ma2_default_num");
        var j3 = EMcookie.getCookie("ma3_default_num") == null ? 20 : EMcookie.getCookie("ma3_default_num");
        var j4 = EMcookie.getCookie("ma4_default_num") == null ? 30 : EMcookie.getCookie("ma4_default_num");

        params.extend = "cma"+","+j1+","+j2+","+j3+","+j4+"|rsi";
        this.options.up_t = "junxian";
        this.options.down_t = "rsi";

        GetTeacData(params, function(data) {

            _this.options.junxian = {};

            /*5日均线数据*/
            _this.options.junxian["ma"+j1] = data.five_average;
            /*10日均线数据*/
            _this.options.junxian["ma"+j2] = data.ten_average;
            /*20日均线数据*/
            _this.options.junxian["ma"+j3] = data.twenty_average;
            /*30日均线数据*/
            _this.options.junxian["ma"+j4] = data.thirty_average;

            _this.options.rsi = {};
            _this.options.rsi.rsi6 = data.rsi6;
            _this.options.rsi.rsi12 = data.rsi12;
            _this.options.rsi.rsi24 = data.rsi24;

            temp_ma.apply(_this,[]);
            temp_rsi.apply(_this,[]);

            if(_this.options.interactive.options.markMAContainer){
                _this.options.interactive.options.markMAContainer.innerHTML = "";
                _this.options.interactive.options.markMAContainer = null;
            }else{
                _this.options.interactive.options.markMAContainer = null;
            }

            // 绑定事件
            bindEvent.call(_this,_this.options.context);

            inter.markMA(_this.options.canvas, "junxian", _this.options["junxian"], _this.options.start, _this.options.end, "",_this.options.maColor);
            inter.markT(_this.options.canvas, "rsi", _this.options["rsi"], _this.options.start, _this.options.end, 59);
        });

        function temp_rsi(){
            var rsi6 = this.options.rsi.rsi6;
            var rsi12 = this.options.rsi.rsi12;
            var rsi24 = this.options.rsi.rsi24;
            var start = this.options.start;
            var end = this.options.end;
            DrawRSI.apply(this,[this.options.context,rsi6.slice(start,end),rsi12.slice(start,end),rsi24.slice(start,end)]);
        }

        function temp_ma(){
            var _this = this;
            var ctx = _this.options.context;
            var data = _this.options.junxian;
            var start = _this.options.start;
            var end = _this.options.end;
            // 图表交互
            var inter = _this.options.interactive;

            /*5日均线数据*/
            var five_average = data["ma"+j1].slice(start, end);
            /*10日均线数据*/
            var ten_average = data["ma"+j2].slice(start, end);
            /*20日均线数据*/
            var twenty_average = data["ma"+j3].slice(start, end);
            /*30日均线数据*/
            var thirty_average = data["ma"+j4].slice(start, end);

            // var v_ma_5 = data.v_ma_5;
            // var v_ma_10 = data.v_ma_10;

            inter.default_m5 = five_average[five_average.length - 1];
            inter.default_m10 = ten_average[ten_average.length - 1];
            inter.default_m20 = twenty_average[twenty_average.length - 1];
            inter.default_m30 = thirty_average[thirty_average.length - 1];

            // inter.default_volume = data.data[data.data.length - 1];
            // inter.default_vm5 = v_ma_5[v_ma_5.length - 1];
            // inter.default_vm10 = v_ma_10[v_ma_10.length - 1];

            if(j1 && j1 != 0){
                getMAData.apply(_this, [ctx, five_average, this.options.color.m5Color]);
            }

            if(j2 && j2 != 0){
                getMAData.apply(_this, [ctx, ten_average, this.options.color.m10Color]);
            }
            
            if(j3 && j3 != 0){
                getMAData.apply(_this, [ctx, twenty_average, this.options.color.m20Color]);
            }
            
            if(j4 && j4 != 0){
                getMAData.apply(_this, [ctx, thirty_average, this.options.color.m30Color]);
            }
            
        }
        

        function getMAData(ctx, data_arr, color) {

            // 保存画笔状态
            ctx.save();
            var ma_data = [];
            ctx.beginPath();
            ctx.strokeStyle = color;
            var flag = false;
            var firstNode = true;
            for (var i = 0; i < data_arr.length; i++) {
                var item = data_arr[i];
                if (item && item.value) {
                    var x = common.get_x.call(this, i + 1);
                    var y = common.get_y.call(this, item.value);
                    if(firstNode){
                        ctx.moveTo(x,y);
                        firstNode = false;
                    }
                    //横坐标和均线数据
                    ma_data.push(item);
                    if(i == 0){
                       ctx.moveTo(x,y);
                    }else if(y > this.options.c_k_height || y < 0){
                       ctx.moveTo(x,y);
                       flag = true;
                    }else{
                        if(flag){
                            ctx.moveTo(x,y);
                        }else{
                            ctx.lineTo(x,y);
                        }
                        flag = false;
                    }
                }
            }

            ctx.stroke();
            ctx.restore();

            return ma_data;
        }

    }

    // 绘制K线均线
    ChartK.prototype.drawMA = function(start, end){
        
        var _this = this;

        this.clearK();
        this.options.drawXY.drawXYK();
        this.drawK();

        var j1 = EMcookie.getCookie("ma1_default_num") == null ? 5 : EMcookie.getCookie("ma1_default_num");
        var j2 = EMcookie.getCookie("ma2_default_num") == null ? 10 : EMcookie.getCookie("ma2_default_num");
        var j3 = EMcookie.getCookie("ma3_default_num") == null ? 20 : EMcookie.getCookie("ma3_default_num");
        var j4 = EMcookie.getCookie("ma4_default_num") == null ? 30 : EMcookie.getCookie("ma4_default_num");

        var params = {};
        params = getParamsObj.call(this);
        params.extend = "cma"+","+j1+","+j2+","+j3+","+j4;
        if(this.options.junxian){
            data = _this.options.junxian;
            temp_ma.apply(_this,[]);
        } else {
             GetTeacData(params, function(data) {
                _this.options.junxian = {};
                /*5日均线数据*/
                _this.options.junxian["ma"+j1] = data.five_average;
                /*10日均线数据*/
                _this.options.junxian["ma"+j2] = data.ten_average;
                /*20日均线数据*/
                _this.options.junxian["ma"+j3] = data.twenty_average;
                /*30日均线数据*/
                _this.options.junxian["ma"+j4] = data.thirty_average;

                temp_ma.apply(_this,[]);

            });
        }

        function temp_ma(){
            var _this = this;
            var ctx = _this.options.context;
            var data = _this.options.junxian;

            // 图表交互
            var inter = _this.options.interactive;

            /*5日均线数据*/
            var five_average = data["ma"+j1].slice(start, end);
            /*10日均线数据*/
            var ten_average = data["ma"+j2].slice(start, end);
            /*20日均线数据*/
            var twenty_average = data["ma"+j3].slice(start, end);
            /*30日均线数据*/
            var thirty_average = data["ma"+j4].slice(start, end);

            // var v_ma_5 = data.v_ma_5;
            // var v_ma_10 = data.v_ma_10;

            inter.default_m5 = five_average[five_average.length - 1];
            inter.default_m10 = ten_average[ten_average.length - 1];
            inter.default_m20 = twenty_average[twenty_average.length - 1];
            inter.default_m30 = thirty_average[thirty_average.length - 1];

            // inter.default_volume = data.data[data.data.length - 1];
            // inter.default_vm5 = v_ma_5[v_ma_5.length - 1];
            // inter.default_vm10 = v_ma_10[v_ma_10.length - 1];

            if(j1 && j1 != 0){
                getMAData.apply(_this, [ctx, five_average, this.options.color.m5Color]);
            }

            if(j2 && j2 != 0){
                getMAData.apply(_this, [ctx, ten_average, this.options.color.m10Color]);
            }
            
            if(j3 && j3 != 0){
                getMAData.apply(_this, [ctx, twenty_average, this.options.color.m20Color]);
            }
            
            if(j4 && j4 != 0){
                getMAData.apply(_this, [ctx, thirty_average, this.options.color.m30Color]);
            }

        }
        

        function getMAData(ctx, data_arr, color) {

            // 保存画笔状态
            ctx.save();
            var ma_data = [];
            ctx.beginPath();
            ctx.strokeStyle = color;
            var flag = false;
            var firstNode = true;
            for (var i = 0; i < data_arr.length; i++) {
                var item = data_arr[i];
                if (item && item.value) {
                    var x = common.get_x.call(this, i + 1);
                    var y = common.get_y.call(this, item.value);
                    if(firstNode){
                        ctx.moveTo(x,y);
                        firstNode = false;
                    }
                    //横坐标和均线数据
                    ma_data.push(item);
                    if(i === 0){
                       ctx.moveTo(x,y);
                    }else if(y > this.options.c_k_height || y < 0){
                       ctx.moveTo(x,y);
                       flag = true;
                    }else{
                        if(flag){
                            ctx.moveTo(x,y);
                        }else{
                            ctx.lineTo(x,y);
                        }
                        flag = false;
                    }
                    // ctx.lineTo(x, y);
                }
                // ctx.lineTo(x,y);
            }

            ctx.stroke();
            ctx.restore();

            return ma_data;
        }
    }

    // 绘制K线图
    ChartK.prototype.drawK = function(data){
        
        var data_arr = data == undefined ? this.options.currentData.data : data;
        var ctx = this.options.context;
        // 获取单位绘制区域
        var rect_unit = this.options.rect_unit;
        // 单位绘制区域的宽度
        // var rect_w = rect_unit.rect_w;
        // K线柱体的宽度
        var bar_w = rect_unit.bar_w;
        // K线柱体的颜色
        var up_color = this.options.up_color;
        var down_color =this.options.down_color
        // 图表交互
        var inter = this.options.interactive;
        // 上榜日数组
        var pointObj = {};
        if(this.options.markPoint && this.options.markPoint.show){
            var array = this.options.markPoint.dateList;
            for(var index in array){
                pointObj[array[index]] = array[index];
            }
        }

        var params = {};
       
        for(var i = 0,item; item = data_arr[i]; i++){
            // 是否上涨
            var is_up = item.up;

            ctx.beginPath();
            ctx.lineWidth = 1;

            if(is_up){
                ctx.fillStyle = up_color;
                ctx.strokeStyle = up_color
            }else{
                ctx.fillStyle = down_color
                ctx.strokeStyle = down_color
            }

            params.ctx = ctx;
            var x = params.x = common.get_x.call(this,i + 1);
            params.y_open = common.get_y.call(this,item.open);
            var y_close = params.y_close = common.get_y.call(this,item.close);
            params.y_highest = common.get_y.call(this,item.highest);
            params.y_lowest = common.get_y.call(this,item.lowest);

            item.cross_x = x;
            item.cross_y = y_close;
            item.cross_y_open = params.y_open;
            item.cross_y_lowest = params.y_lowest;
            item.cross_y_highest = params.y_highest;

            //标识上榜日
            if(pointObj[item.data_time]){
                inter.markPoint(x,item.data_time,this.options.context.canvas,this.options.scale_count);
            }
            
            // K线柱体的宽度
            params.bar_w = bar_w;
            DrawK.apply(this,[params]);

        }

    };



    // 绘制RSI指标
    ChartK.prototype.drawRSI = function(start,end){
        var _this = this;
        var params = {};
        params = getParamsObj.call(this);
        params.extend = this.options.down_t = "rsi";

        if(this.options.rsi){
            temp_rsi.apply(_this,[]);
        }else{
            GetTeacData(params,function(data){
                _this.options.rsi = {};
                _this.options.rsi.rsi6 = data.rsi6;
                _this.options.rsi.rsi12 = data.rsi12;
                _this.options.rsi.rsi24 = data.rsi24;
                temp_rsi.apply(_this,[]);
            });
        }

        function temp_rsi(){
            var rsi6 = this.options.rsi.rsi6;
            var rsi12 = this.options.rsi.rsi12;
            var rsi24 = this.options.rsi.rsi24;
            if(start == undefined || end == undefined ){
                start = this.options.start;
                end = this.options.end;
            }
            end = end + 1;
            DrawRSI.apply(this,[this.options.context,rsi6.slice(start,end),rsi12.slice(start,end),rsi24.slice(start,end)]);
        }

    }

    // 绘制KDJ指标
    ChartK.prototype.drawKDJ = function(start,end){

        var _this = this;
        var params = {};
        params = getParamsObj.call(this);
        params.extend = this.options.down_t = "kdj";

        if(this.options.kdj){
            temp_kdj.apply(_this,[]);
        }else{
            GetTeacData(params,function(data){
                _this.options.kdj = {};
                _this.options.kdj.k = data.k;
                _this.options.kdj.d = data.d;
                _this.options.kdj.j = data.j;
                temp_kdj.apply(_this,[]);
            });
        }

        function temp_kdj(){
            var k = this.options.kdj.k;
            var d = this.options.kdj.d;
            var j = this.options.kdj.j;

            if(start == undefined || end == undefined ){
                start = this.options.start;
                end = this.options.end;
            }
            end = end + 1;
            DrawKDJ.apply(this,[this.options.context,k.slice(start,end),d.slice(start,end),j.slice(start,end)]);
        }
        
    }

    // 绘制MACD指标
    ChartK.prototype.drawMACD = function(start,end){
        
        var _this = this;
        var params = {};
        params = getParamsObj.call(this);
        params.extend = this.options.down_t = "macd";

        if(this.options.macd){
            temp_macd.apply(this,[]);
        }else{
            GetTeacData(params,function(data){
                _this.options.macd = {};
                _this.options.macd.dea = data.dea;
                _this.options.macd.diff = data.diff;
                _this.options.macd.macd = data.macd;
                temp_macd.apply(_this,[]);
            });
        }

        function temp_macd(){
            var dea = this.options.macd.dea;
            var diff = this.options.macd.diff;
            var macd = this.options.macd.macd;

            if(start == undefined || end == undefined ){
                start = this.options.start;
                end = this.options.end;
            }
            end = end + 1;
            DrawMACD.apply(_this,[_this.options.context,dea.slice(start,end),diff.slice(start,end),macd.slice(start,end)]);
        }
        
    }

    // 绘制WD指标
    ChartK.prototype.drawWR = function(start,end){
        
        var _this = this;
        var params = {};
        params = getParamsObj.call(this);
        params.extend = this.options.down_t = "wr";
        if(this.options.wr){
            temp_wr.apply(this,[]);
        }else{
            GetTeacData(params,function(data){
                _this.options.wr = {};
                _this.options.wr.wr6 = data.wr6;
                _this.options.wr.wr10 = data.wr10;
                temp_wr.apply(_this,[]);
            });
        }

        function temp_wr(){

            var wr6 = this.options.wr.wr6;
            var wr10 = this.options.wr.wr10;

            if(start == undefined || end == undefined ){
                start = this.options.start;
                end = this.options.end;
            }
            end = end + 1;
            DrawWR.apply(_this,[_this.options.context,wr6.slice(start,end),wr10.slice(start,end)]);

        }

    }

    // 绘制DMI指标
    ChartK.prototype.drawDMI = function(start,end){

        var _this = this;
        var params = {};
        params = getParamsObj.call(this);
        params.extend = this.options.down_t = "dmi";

        if(this.options.dmi){
             temp_dmi.apply(_this,[]);
        }else{
            GetTeacData(params,function(data){
                _this.options.dmi = {};
                _this.options.dmi.pdi = data.pdi;
                _this.options.dmi.mdi = data.mdi;
                _this.options.dmi.adx = data.adx;
                _this.options.dmi.adxr = data.adxr;
                temp_dmi.apply(_this,[]);
            });

        }

        function temp_dmi(){

            var pdi = this.options.dmi.pdi;
            var mdi = this.options.dmi.mdi;
            var adx = this.options.dmi.adx;
            var adxr = this.options.dmi.adxr;

            if(start == undefined || end == undefined ){
                start = this.options.start;
                end = this.options.end;
            }
            end = end + 1;
            DrawDMI.apply(_this,[_this.options.context,pdi.slice(start,end),mdi.slice(start,end),adx.slice(start,end),adxr.slice(start,end)]);

        }

        
    }

    // 绘制BIAS指标
    ChartK.prototype.drawBIAS = function(start,end){

        var _this = this;
        var params = {};
        params = getParamsObj.call(this);
        params.extend = this.options.down_t = "bias";

        if(this.options.bias){
            temp_bias.apply(_this,[]);
        }else{
            GetTeacData(params,function(data){
                _this.options.bias = {};
                _this.options.bias.bias6 = data.bias6;
                _this.options.bias.bias12 = data.bias12;
                _this.options.bias.bias24 = data.bias24;
                temp_bias.apply(_this,[]);
            });
        }

        function temp_bias(){

            var bias6 = this.options.bias.bias6;
            var bias12 = this.options.bias.bias12;
            var bias24 = this.options.bias.bias24;
       
            if(start == undefined || end == undefined ){
                start = this.options.start;
                end = this.options.end;
            }
            end = end + 1;
            DrawBIAS.apply(this,[this.options.context,bias6.slice(start,end),bias12.slice(start,end),bias24.slice(start,end)]);

        }
        
    }

    // 绘制OBV指标
    ChartK.prototype.drawOBV = function(start,end){

        var _this = this;
        var params = {};
        params = getParamsObj.call(this);
        params.extend = this.options.down_t = "obv";

        if(_this.options.obv){
            temp_obv.apply(this,[]);
        }else{
            GetTeacData(params,function(data){
                _this.options.obv = {};
                _this.options.obv.obv = data.obv;
                _this.options.obv.maobv = data.maobv;
                temp_obv.apply(_this,[]);
            });
        }

        function temp_obv(){

            var obv = this.options.obv.obv;
            var maobv = this.options.obv.maobv;

            if(start == undefined || end == undefined ){
                start = this.options.start;
                end = this.options.end;
            }
            end = end + 1;
            DrawOBV.apply(this,[this.options.context,obv.slice(start,end),maobv.slice(start,end)]);
        }


    }

    // 绘制CCI指标
    ChartK.prototype.drawCCI = function(start,end){

        var _this = this;
        
        var params = {};
        params = getParamsObj.call(this);
        params.extend = this.options.down_t = "cci";
        
        if(this.options.cci){
            temp_cci.apply(_this,[]);
        }else{
            GetTeacData(params,function(data){
                _this.options.cci = {};
                _this.options.cci.cci = data.cci;
                temp_cci.apply(_this,[]);
            });
        }

        function temp_cci(){
            var cci = this.options.cci.cci;

            if(start == undefined || end == undefined ){
                start = this.options.start;
                end = this.options.end;
            }
            end = end + 1;
            DrawCCI.apply(this,[this.options.context,cci.slice(start,end)]);
        }
        
        
    }

    // 绘制ROC指标
    ChartK.prototype.drawROC = function(start,end){

        var _this = this;
        var params = {};
        params = getParamsObj.call(this);
        params.extend = this.options.down_t = "roc";

        if(_this.options.roc){
            temp_roc.apply(_this,[]);
        }else{
            GetTeacData(params,function(data){
                _this.options.roc = {};
                _this.options.roc.roc = data.roc;
                _this.options.roc.rocma = data.rocma;
                
                temp_roc.apply(_this,[]);
            });
        }

        function temp_roc(){
            var roc = _this.options.roc.roc;
            var rocma = _this.options.roc.rocma;

            if(start == undefined || end == undefined ){
                start = this.options.start;
                end = this.options.end;
            }
            end = end + 1;
            DrawROC.apply(_this,[_this.options.context,roc.slice(start,end),rocma.slice(start,end)]);
        }        
    }

    // 绘制expma指标
    ChartK.prototype.drawEXPMA = function(){

        var _this = this;
        var params = {};
        params = getParamsObj.call(this);
        params.extend = this.options.up_t = "expma";

        if(this.options.expma){

            temp_expma.apply(_this,[this.options.start, this.options.end]);
        }else{
            GetTeacData(params,function(data){
                _this.options.expma = {};

                _this.options.expma.expma12 = data.expma12;
                _this.options.expma.expma50 = data.expma50;

                temp_expma.apply(_this,[_this.options.start, _this.options.end]);
            });  
        }

        function temp_expma(start, end){
            var expma12 = this.options.expma.expma12.slice(start, end);
            var expma50 = this.options.expma.expma50.slice(start, end);
            var expma_arr = expma12.concat(expma50);

            var max = _this.options.currentData.max;
            var min = _this.options.currentData.min;
            for(var i = 0,item;item = expma_arr[i];i++){
                max = Math.max(max,item.value);
                min = Math.min(min,item.value);
            }
            this.options.currentData.max = max;
            this.options.currentData.min = min;
            this.options.drawXY.options.currentData = this.options.currentData;

            DrawEXPMA.apply(this,[this.options.context,expma12,expma50]);
        }    

    }


    // 绘制bool指标
    ChartK.prototype.drawBOLL = function(){

        var _this = this;
        var params = {};
        params = getParamsObj.call(this);
        params.extend = this.options.up_t = "boll";

        if(this.options.boll){

            temp_boll.apply(_this,[_this.options.start, _this.options.end]);
        }else{
            GetTeacData(params,function(data){

                _this.options.boll = {};
                _this.options.boll.bollup = data.bollup;
                _this.options.boll.bollmb = data.bollmb;
                _this.options.boll.bolldn = data.bolldn;

                temp_boll.apply(_this,[_this.options.start, _this.options.end]);
            });   
        }


        function temp_boll(start, end){
            var bollup = this.options.boll.bollup.slice(start, end);
            var bollmb = this.options.boll.bollmb.slice(start, end);
            var bolldn = this.options.boll.bolldn.slice(start, end);

            var boll = bollup.concat(bollmb).concat(bolldn);
            var max = _this.options.currentData.max;
            var min = _this.options.currentData.min;
            for(var i = 0,item;item = boll[i];i++){
                max = Math.max(max,item.value);
                min = Math.min(min,item.value);
            }
            this.options.currentData.max = max;
            this.options.currentData.min = min;
            this.options.drawXY.options.currentData = this.options.currentData;

            DrawBOLL.apply(_this,[_this.options.context,bollup,bollmb,bolldn]);
        }

    }


    // 绘制bool指标
    ChartK.prototype.drawSAR = function(){

        var _this = this;
        var params = {};
        params = getParamsObj.call(this);
        params.extend = this.options.up_t = "sar";
        var k_data_arr = this.options.currentData.data;

        if(this.options.sar){
            temp_sar.apply(_this,[_this.options.start, _this.options.end]);
        }else{
            GetTeacData(params,function(data){
                _this.options.sar = {};
                _this.options.sar.sar = data.sar;
                temp_sar.apply(_this,[_this.options.start, _this.options.end]);
            });     
        }
         
        function temp_sar(start, end){
            var sar_arr = this.options.sar.sar.slice(start, end);
           
            var max = _this.options.currentData.max;
            var min = _this.options.currentData.min;
            for(var i = 0,item;item = sar_arr[i];i++){
                max = Math.max(max,item.value);
                min = Math.min(min,item.value);
            }
            this.options.currentData.max = max;
            this.options.currentData.min = min;
            this.options.drawXY.options.currentData = this.options.currentData;

            DrawSAR.apply(_this,[_this.options.context,sar_arr,k_data_arr]);
        }  

    }


    // 绘制bbi指标
    ChartK.prototype.drawBBI = function(){

        var _this = this;
        var params = {};
        params = getParamsObj.call(this);
        params.extend = this.options.up_t = "bbi";
        if (this.options.bbi) {
            temp_bbi.apply(_this,[_this.options.start, _this.options.end]);
        } else {
            GetTeacData(params, function(data) {
                _this.options.bbi = {};
                _this.options.bbi.bbi = data.bbi;
                temp_bbi.apply(_this,[_this.options.start, _this.options.end]);
            });
        }

        function temp_bbi(start, end){

            var bbi_arr = this.options.bbi.bbi.slice(start, end);

            var max = _this.options.currentData.max;
            var min = _this.options.currentData.min;

            for(var i = 0,item;item = bbi_arr[i];i++){
                max = Math.max(max,item.value);
                min = Math.min(min,item.value);
            }
            this.options.currentData.max = max;
            this.options.currentData.min = min;
            this.options.drawXY.options.currentData = this.options.currentData;

            DrawBBI.apply(_this, [_this.options.context,  bbi_arr]);
        }

    }



    // 清除k线图区域
    ChartK.prototype.clearK = function(){
        var ctx = this.options.context;
        ctx.fillStyle = "#fff";
        // ctx.clearRect(0,this.options.unit_height * (-1),this.options.padding.left + this.options.drawWidth + 10,this.options.c2_y_top);
        ctx.fillRect(0,this.options.unit_height * (-1),this.options.padding.left + this.options.drawWidth + 10,this.options.c2_y_top);
        // if(!this.options.watermark){
            watermark.apply(this,[this.options.context,95 + this.options.padding.right,10,82,20,true]);
            this.options.watermark = true;    
        // }
        
    }

    // 清除技术指标区域
    ChartK.prototype.clearT = function(){
        var ctx = this.options.context;
        ctx.fillStyle = "#fff";
        // ctx.clearRect(0,this.options.c3_y_top - 10,this.options.padding.left + this.options.drawWidth + 10,this.options.c4_y_top);
        ctx.fillRect(0,this.options.c3_y_top - 10,this.options.padding.left + this.options.drawWidth + 10,this.options.c4_y_top);
    }
    // 放大图表
    ChartK.prototype.scalePlus = function(){
        scaleClick.call(this,true);
    }
    // 缩小图表
    ChartK.prototype.scaleMinus = function(){
        scaleClick.call(this,false);
    }

    // 复权
    ChartK.prototype.beforeBackRight = function(flag){

        var Days = 1000000;
        var exp = new Date(); 
        exp.setTime(exp.getTime() + Days*24*60*60*1000);

        if(!flag){
            window.authorityType = "";
            EMcookie.setCookie("beforeBackRight", "", exp, "/");
        }else if(flag == 1){
            window.authorityType = "fa";
            EMcookie.setCookie("beforeBackRight", "fa", exp, "/");
        }else if(flag == 2){
            window.authorityType = "ba";
            EMcookie.setCookie("beforeBackRight", "ba", exp, "/");
        }

        this.clear();
        this.draw();
    }

    // 缩放图表
    function scaleClick(flag) {
        
        var _this = this;
        var start = _this.options.start;
        var end = _this.options.end;
        var type = _this.options.type;
        var data_arr_length = _this.options.data.data.length;
        var scale_count = flag || _this.options.scale_count;


        if(scale_count){    

            if(start + 20 >= end){
                start = end - 20;
            }else{
                start = start + 20;
            }

        }else{

            if(start - 20 <= 0){
                start = 0;
            }else{
                start = start - 20;
            }
        }

        _this.options.start = start;
        _this.options.end = end;


        // 初始化交互
        var inter = _this.options.interactive
        // 显示loading效果
        this.options.interactive.showLoading();

        try{
            // slideBarCallback.apply(this,[start,end]);
            slideBar.apply(this,[slideBarCallback,start,end]);
            
            inter.hideLoading();
        }catch(e){
            // 缩放按钮点击有效
            _this.options.clickable = true;
            // 暂无数据
            // inter.showNoData();
            // 隐藏loading效果
            inter.hideLoading();
        }
        
        
    };

    // 获取参数对象
    function getParamsObj(){
        var obj = {};
        obj.code = this.options.code;
        obj.type = this.options.type;
        obj.authorityType = window.authorityType;
        obj.extend = this.options.extend;
        return obj;
    }
    // 回调函数
    function dataCallback(data){

        var ctx = this.options.context;
        var canvas = ctx.canvas;
        this.options.data = data == undefined ? this.options.data : data;
        data = this.options.data;

        var data_arr = data.data;
        
        var data_arr_length = data_arr.length;

        if(data_arr_length >= 1){
            if(data_arr_length > 60){
                this.options.start = data_arr_length - 60;
            }else{
                this.options.start = 0;
            }
            this.options.end = data_arr_length;
        }else{
            this.options.start = 0;
            this.options.end = 0;
        }

        this.options.currentData = sliceData(this.options.data,this.options.start,this.options.end);
        var current_arr = this.options.currentData.data;
        var current_arr_length = current_arr.length;
        this.options.XMark = getXMARK.apply(this,[current_arr]);

        // 图表交互
        var inter = this.options.interactive;

        // try{

            if(!data || !data.data || data.data.length == 0){
                // 隐藏loading效果
                // inter.hideLoading();
                // 暂无数据
                // inter.showNoData();
                // return;
            }

            // 保留的小数位
            this.options.pricedigit = data.pricedigit;

            // 获取单位绘制区域
            var rect_unit = common.get_rect.apply(this,[canvas,current_arr_length]);
            this.options.rect_unit = rect_unit;

            slideBar.call(this,slideBarCallback);
            // slideBar({container: this.container, percent: 1486, width: this.options.drawWidth, height: 70, top:this.options.c4_y_top, left: this.options.padding.left, barStart: 200, barWidth: 100});
            
            // 绘制坐标轴
            var drawXY = this.options.drawXY = new DrawXY(this.options);
            // drawXY.draw.apply(this,[]);
            // 绘制K线图
            this.drawK();
            // 绘制均线
            this.options.up_t = "junxian";
            // 绘制均线和rsi指标
            init_ma_rsi.apply(this,[]);
            

            // 绘制成交量
            drawV.apply(this,[this.options]);
            // 绘制成交量均线
            this.drawVMA();

            // 上榜日标识点
            if(this.options.interactive.options.pointsContainer){
                var points =  this.options.interactive.options.pointsContainer.children;
                this.markPointsDom = points;
            }

            // 隐藏loading效果
            inter.hideLoading();
            
            // 图表加载完成时间
            this.options.onChartLoaded(this);

            // 加水印
            watermark.apply(this,[this.options.context,95 + this.options.padding.right,10,82,20]);

        // }catch(e){
        //     // 缩放按钮点击有效
        //     _this.options.clickable = true;
        //     // 暂无数据
        //     inter.showNoData();
        //     // 隐藏loading效果
        //     inter.hideLoading();
        // }
       return true;
    }

    function getXMARK(arr){

        var XMark = [];
        var current_arr = arr || this.options.currentData.data;
        var current_arr_length = current_arr.length;

        if(current_arr_length > 0){
            XMark.push(current_arr[0].date_time);
            XMark.push(current_arr[Math.floor(current_arr_length * 1 / 4)].date_time);
            XMark.push(current_arr[Math.floor(current_arr_length * 2 / 4)].date_time);
            XMark.push(current_arr[Math.floor(current_arr_length * 3 / 4)].date_time);
            XMark.push(current_arr[current_arr_length - 1].date_time);
        }

        return XMark;
    }
    // 绑定事件
    function bindEvent(ctx){
        var _this = this;
        var timer_s,timer_m,timer_e;
        var canvas = ctx.canvas;
        var inter = _this.options.interactive;
        //缩放按钮是否可点击
        this.options.clickable = true;

        var delayed = false;
        var delaytouch = this.options.delaytouch = true;

        common.addEvent.call(_this, canvas, "touchmove",function(event){
            dealEvent.apply(_this,[inter,event.changedTouches[0]]);
            // dealEvent.apply(_this,[inter,event]);
            try {
                event.preventDefault();
            } catch (e) {
                event.returnValue = false;
            }
        });

        common.addEvent.call(_this, canvas, "mousemove",function(event){
            dealEvent.apply(_this,[inter,event]);
            try {
                event.preventDefault();
            } catch (e) {
                event.returnValue = false;
            }
        });

        common.addEvent.call(_this, _this.container, "mouseleave",function(event){
            inter.hide();
            try {
                event.preventDefault();
            } catch (e) {
                event.returnValue = false;
            }
        });

        common.addEvent.call(_this, canvas, "mouseenter",function(event){
            inter.show();
            try {
                event.preventDefault();
            } catch (e) {
                event.returnValue = false;
            }
        });

        common.addEvent.call(_this, _this.container, "mousewheel",function(event){
            event.wheelDelta > 0 ? _this.scalePlus() : _this.scaleMinus();
            try {
                event.preventDefault();
            } catch (e) {
                event.returnValue = false;
            }
        }); 
        common.addEvent.call(_this, _this.container, "DOMMouseScroll",function(event){
            event.detail > 0 ? _this.scalePlus() : _this.scaleMinus();
            try {
                event.preventDefault();
            } catch (e) {
                event.returnValue = false;
            }
        }); 
        

    }
    // 图表交互
    function dealEvent(inter,eventposition){

        var canvas = this.options.canvas;   

        var k_data = this.options.currentData.data;

        var j1 = EMcookie.getCookie("ma1_default_num") == null ? 5 : EMcookie.getCookie("ma1_default_num");
        var j2 = EMcookie.getCookie("ma2_default_num") == null ? 10 : EMcookie.getCookie("ma2_default_num");
        var j3 = EMcookie.getCookie("ma3_default_num") == null ? 20 : EMcookie.getCookie("ma3_default_num");
        var j4 = EMcookie.getCookie("ma4_default_num") == null ? 30 : EMcookie.getCookie("ma4_default_num");

        var five_average = this.options.junxian["ma"+j1];
        var ten_average = this.options.junxian["ma"+j2];
        var twenty_average = this.options.junxian["ma"+j3];
        var thirty_average = this.options.junxian["ma"+j4];

        var v_ma_5 = this.options.v_ma_5;
        var v_ma_10 = this.options.v_ma_10;

        // 单位绘制区域
        var rect_unit = this.options.rect_unit;
        // 单位绘制区域的宽度
        var rect_w = rect_unit.rect_w;
        // K线柱体的宽度
        // var bar_w = rect_unit.bar_w;

        // 鼠标事件位置
        // var w_x = eventposition.clientX;
        // var w_y = eventposition.clientY;

        var w_x = eventposition.offsetX || (eventposition.clientX - this.container.getBoundingClientRect().left);
        var w_y = eventposition.offsetY || (eventposition.clientY - this.container.getBoundingClientRect().top);

        // 鼠标在画布中的坐标
        var c_pos = common.windowToCanvas.apply(this,[canvas,w_x,w_y]);
        var c_x = (c_pos.x);
        var c_y = (c_pos.y) - this.options.margin.top;

        // 当前K线在数组中的下标

        var index = Math.floor((c_x - this.options.padding.left)/rect_w);
        if(index < 0){index = 0;}
        try {
            if(k_data[index]){
                
                // 显示十字指示线的
                var cross_w_x = k_data[index].cross_x;
                var cross_w_y = k_data[index].cross_y;

                var cross_w_y_open = k_data[index].cross_y_open;
                var cross_w_y_highest = k_data[index].cross_y_highest;
                var cross_w_y_lowest = k_data[index].cross_y_lowest;
         
                inter.cross(canvas,cross_w_x,cross_w_y,c_y,cross_w_y_open,cross_w_y_highest,cross_w_y_lowest);
                // 显示行情数据
                var indexYC = index == 0 ? k_data[index].open : k_data[index-1].close; //计算昨收
                k_data[index].yc = indexYC;
                inter.showTip(canvas,cross_w_x,cross_w_y,c_y,cross_w_y_open,cross_w_y_highest,cross_w_y_lowest,k_data[index]);
            }

            if(five_average[index]){
                 // 标识均线数据
                 // inter.markMA(canvas,five_average[index],ten_average[index],twenty_average[index],thirty_average[index]);

                 if(this.options.up_t == "junxian"){
                    inter.markMA(canvas, this.options.up_t, this.options[this.options.up_t], this.options.start, this.options.end, index, this.options.maColor);
                 }else{
                    inter.markMA(canvas, this.options.up_t, this.options[this.options.up_t], this.options.start, this.options.end, index, this.options.TColor);
                 }
                 inter.markVMA(canvas,k_data[index].volume,v_ma_5[index],v_ma_10[index]);
                 inter.markT(canvas, this.options.down_t, this.options[this.options.down_t], this.options.start, this.options.end, index);
            }
        } catch(e){
            
        }

    }

    //截取数据
    function sliceData(sourceData, start, end){

        var result = deepCopy(sourceData);
        result.max = 0;
        result.min = 100000;
        result.v_max = 0;
        result.total = end - start + 1;
        result.name = sourceData.name;
        result.code = sourceData.code;
        result.v_ma_5 = sourceData.v_ma_5.slice(start,end);
        result.v_ma_10 = sourceData.v_ma_10.slice(start,end);
        result.data = [];

        for(var i = start; i <= end; i++){
            if(sourceData.data[i]){
                result.data.push(sourceData.data[i]);
                result.max = Math.max(sourceData.data[i].highest, result.max);
                result.min = Math.min(sourceData.data[i].lowest, result.min);
                result.v_max = Math.max(sourceData.data[i].volume, result.v_max);
            }
        }

        result.max = result.max + (result.max - result.min) * 0.05;
        result.min = result.min - (result.max - result.min) * 0.05 < 0 ? 0 : result.min - (result.max - result.min) * 0.05; 

        return result;
    }

    function deepCopy(source) { 
        var result={};
        for (var key in source) {
          result[key] = typeof source[key]==="object"? deepCopy(source[key]): source[key];
        } 
        return result; 
    }


    return ChartK;
})();

module.exports = ChartK;
