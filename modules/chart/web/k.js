/**
 * 绘制手机K线图
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
 *     canvas_offset_top:   画布中坐标轴向下偏移量
 *     padding_left:    画布左侧边距
 *     k_v_away:    行情图表（分时图或K线图）和成交量图表的间距
 *     scale_count:     缩放默认值
 *     c_k_height:  行情图表（分时图或K线图）的高度
 *     rect_unit:   分时图或K线图单位绘制区域
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
// 工具
var common = require('chart/web/common/common'); 
// 交互效果
var Interactive = require('chart/web/common/interactive'); 
// 拓展，合并，复制
var extend = require('tools/extend');
// 水印
var watermark = require('chart/watermark');
/*绘制网格虚线*/
var DrawDashLine = require('chart/web/common/draw_dash_line');

var ChartK = (function() {

    function ChartK(options) {
        this.defaultoptions = theme.chartK;
        this.options = {};
        extend(true, this.options, theme.defaulttheme, this.defaultoptions, options);

        // 图表容器
        this.container = document.getElementById(options.container);
        // 图表加载完成事件
        this.options.onChartLoaded = options.onChartLoaded == undefined ? function(op){

        }:options.onChartLoaded;
    }

    /*初始化*/
    ChartK.prototype.init = function() {
        this.options.type = this.options.type == undefined ? "DK" : this.options.type;
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
        this.container.appendChild(canvas);
        // 画布的宽和高
        canvas.width = this.options.width * dpr;
        canvas.height = this.options.height * dpr;

        // 画布向下偏移的距离
        // this.options.canvas_offset_top = canvas.height / 8;
        // 画布内容向坐偏移的距离
        this.options.padding_left = theme.defaulttheme.padding_left * dpr;
        // 行情图表（分时图或K线图）和成交量图表的间距
        this.options.k_v_away = canvas.height / 8;
        // 缩放默认值
        this.options.scale_count = this.options.scale_count == undefined ? 0 : this.options.scale_count;
        

        canvas.style.width = this.options.width + "px";
        canvas.style.height = this.options.height + "px";
        canvas.style.border = "0";

        
        // 画笔参数设置
        ctx.font = (this.options.font_size * this.options.dpr) + "px Arial";
        ctx.lineWidth = 1 * this.options.dpr;
        ctx.strokeStyle = 'rgba(230,230,230, 1)';
       
        this.options.padding = {};
        this.options.padding.left = ctx.measureText("1000").width + 10;
        this.options.padding.right = 0;
        this.options.padding.top = 0;
        this.options.padding.bottom = 0;
        this.options.drawWidth = canvas.width - this.options.padding.left - this.options.padding.right;

        this.options.y_sepe_num = 18;
        this.options.x_sepe_num = 10;

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

        // 加水印
        watermark.apply(this,[this.options.context,90,20,82,20]);
       
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
            if(type == "DK"){
                GetDataK(getParamsObj.call(_this),function(data){
                    var flag = dataCallback.apply(_this,[data]);
                    if(flag){
                        // K线图均线数据标识
                        inter.markMA(_this.options.canvas);
                        // 成交量均线数据标识
                        inter.markVMA(_this.options.canvas);
                        // 缩放
                        inter.scale(_this.options.canvas);
                        // 绑定事件
                        bindEvent.call(_this,_this.options.context);
                    }
                    // 传入的回调函数
                    if(callback){
                        callback(_this.options);
                    }
                });
            }

        }catch(e){
            // 暂无数据
            inter.showNoData();
            // 隐藏loading效果
            inter.hideLoading();
        }
        var ctx = this.options.context;
        var canvas = this.options.canvas;
        this.options.context.rect(this.options.padding.left,this.options.c2_y_top - canvas.height * 1 / this.options.y_sepe_num,this.options.drawWidth - 2,canvas.height - this.options.c2_y_top + canvas.height * 1 / this.options.y_sepe_num);
        ctx.stroke();

        drawT.apply(this,[]);
        this.drawRSI();
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
        if(this.container){
            this.container.innerHTML = "";
        }else{
            document.getElementById(this.options.container).innerHTML = "";
        }
        if (cb) {
            cb();
        };
    }

    // 获取上榜日标识dom
    ChartK.prototype.getMarkPointsDom = function(cb) {
        var points =  this.options.interactive.options.pointsContainer.children;
        return points;
    }

    // 绘制技术指标
    function drawT(){
        var ctx = this.options.context;
        var canvas = this.options.canvas;
        var div_tech = document.createElement("div");
        div_tech.className = "tech-index";
        div_tech.style.width = this.options.drawWidth;
        div_tech.style.left = this.options.padding.left + "px";
        div_tech.style.top = canvas.height * 17 / this.options.y_sepe_num + "px";

        // rsi指标
        var rsi = document.createElement("div");
        rsi.className = "tech-index-item";
        rsi.innerText = "RSI";
        rsi.style.width = this.options.drawWidth / 9 + "px";

        // kdj指标
        var kdj = document.createElement("div");
        kdj.className = "tech-index-item";
        kdj.innerText = "KDJ";
        kdj.style.width = this.options.drawWidth / 9 + "px";

        // macd指标
        var macd = document.createElement("div");
        macd.className = "tech-index-item";
        macd.innerText = "MACD";
        macd.style.width = this.options.drawWidth / 9 + "px";

        // macd指标
        var wd = document.createElement("div");
        wd.className = "tech-index-item";
        wd.innerText = "WD";
        wd.style.width = this.options.drawWidth / 9 + "px";

        // dmi指标
        var dmi = document.createElement("div");
        dmi.className = "tech-index-item";
        dmi.innerText = "DMI";
        dmi.style.width = this.options.drawWidth / 9 + "px";

        // bias指标
        var bias = document.createElement("div");
        bias.className = "tech-index-item";
        bias.innerText = "BIAS";
        bias.style.width = this.options.drawWidth / 9 + "px";

        // obv指标
        var obv = document.createElement("div");
        obv.className = "tech-index-item";
        obv.innerText = "OBV";
        obv.style.width = this.options.drawWidth / 9 + "px";

        // cci指标
        var cci = document.createElement("div");
        cci.className = "tech-index-item";
        cci.innerText = "CCI";
        cci.style.width = this.options.drawWidth / 9 + "px";
        // roc指标
        var roc = document.createElement("div");
        roc.className = "tech-index-item";
        roc.innerText = "ROC";
        roc.style.width = this.options.drawWidth / 9 + "px";

        div_tech.appendChild(rsi);
        div_tech.appendChild(kdj);
        div_tech.appendChild(macd);
        div_tech.appendChild(wd);
        div_tech.appendChild(dmi);
        div_tech.appendChild(bias);
        div_tech.appendChild(obv);
        div_tech.appendChild(cci);
        div_tech.appendChild(roc);
        this.container.appendChild(div_tech);
    }

    // 绘制成交量
    function drawV(){

        var ctx = this.options.context;
        var data = this.options.data;
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
        var down_color =this.options.down_color;

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


        var v_ma_5 = data.v_ma_5;
        var v_ma_10 = data.v_ma_10;

        this.options.v_ma_5 = getMAData.apply(this,[ctx,v_ma_5,"#f4cb15"]);
        this.options.v_ma_10 = getMAData.apply(this,[ctx,v_ma_10,"#ff5b10"]);
        
        function getMAData(ctx,data_arr,color) {
            var ma_data = [];
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
            return max
        }

    }

    // 绘制均线
    function drawMA(){

        var ctx = this.options.context;
        var data = this.options.data;
        /*5日均线数据*/
        var five_average = data.five_average;
        /*10日均线数据*/
        var ten_average = data.ten_average;
        /*20日均线数据*/
        var twenty_average = data.twenty_average;
        /*30日均线数据*/
        var thirty_average = data.thirty_average;

        this.options.ma_5_data = getMAData.apply(this,[ctx,five_average,"#f4cb15"]);
        this.options.ma_10_data = getMAData.apply(this,[ctx,ten_average,"#ff5b10"]);
        this.options.ma_20_data = getMAData.apply(this,[ctx,twenty_average,"#488ee6"]);
        this.options.ma_30_data = getMAData.apply(this,[ctx,thirty_average,"#fe59fe"]);


        var params = {};

        function getMAData(ctx,data_arr,color) {
            var ma_data = [];
            ctx.beginPath();
            ctx.strokeStyle = color;
            for(var i = 0;i < data_arr.length; i++){
                var item = data_arr[i];
                if(item){
                     var x = common.get_x.call(this,i + 1);
                     var y = common.get_y.call(this,item.value);
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
            return ma_data;
        }

        ctx.stroke();
    }

    // 绘制K线图
    function drawK(ctx,data_arr){
        
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
            var y_open = params.y_open = common.get_y.call(this,item.open);
            var y_close = params.y_close = common.get_y.call(this,item.close);
            var y_highest = params.y_highest = common.get_y.call(this,item.highest);
            var y_lowest = params.y_lowest = common.get_y.call(this,item.lowest);

            item.cross_x = x;
            item.cross_y = y_close;
            // console.log(x.toFixed(2).toString());

            //标识上榜日
            if(pointObj[item.data_time]){
                inter.markPoint(x,item.data_time,this.options.context.canvas,this.options.scale_count);
            }
            // 获取单位绘制区域
            var rect_unit = this.options.rect_unit;
            // K线柱体的宽度
            var bar_w = params.bar_w = rect_unit.bar_w;

            DrawK.apply(this,[params]);

        }
    };

    // 绘制RSI指标
    ChartK.prototype.drawRSI = function(){
        var _this = this;
        var params = {};
        params.code = this.options.code;
        params.extend = "rsi";
        GetTeacData(params,function(data){
            var rsi6 = data.rsi6;
            var rsi12 = data.rsi12;
            var rsi24 = data.rsi24;

            var rsi_arr = rsi6.concat(rsi12).concat(rsi24);
            var rsi_arr_length = rsi_arr.length;
            if(rsi_arr && rsi_arr[0]){
                var max = rsi_arr[0].value;
                var min = rsi_arr[0].value;
            }

            for(var i = 0;i < rsi_arr_length;i++){
                max = Math.max(max,rsi_arr[i].value);
                min = Math.min(min,rsi_arr[i].value);
            }
            DrawRSI.apply(_this,[_this.options.context,max,min,rsi6,rsi12,rsi24]);
        });

    }

    // 绘制KDJ指标
    ChartK.prototype.drawKDJ = function(){
        
    }

    // 绘制MACD指标
    ChartK.prototype.drawMACD = function(){
        
    }

    // 绘制WD指标
    ChartK.prototype.drawWD = function(){
        
    }

    // 绘制DMI指标
    ChartK.prototype.drawDMI = function(){
        
    }

    // 绘制BIAS指标
    ChartK.prototype.drawBIAS = function(){
        
    }

    // 绘制OBV指标
    ChartK.prototype.drawOBV = function(){
        
    }

    // 绘制CCI指标
    ChartK.prototype.drawCCI = function(){
        
    }

    // 绘制ROC指标
    ChartK.prototype.drawROC = function(){
        
    }

    // 缩放图表
    function scaleClick() {
      
        var _this = this;
        var type = _this.options.type;
        // 初始化交互
        var inter = _this.options.interactive
        // 显示loading效果
        this.options.interactive.showLoading();

        try{
            if(type == "DK"){
                GetDataK(getParamsObj.call(_this),function(data){
                    if(data){
                        dataCallback.apply(_this,[data]);
                        // 缩放按钮点击有效
                        _this.options.clickable = true;
                    }

                });
            }

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
        obj.extend = this.options.extend;
        return obj;
    }
    // 回调函数
    function dataCallback(data){

        var ctx = this.options.context;
        var canvas = ctx.canvas;
        this.options.data = data == undefined ? this.options.data : data;
        data = this.options.data;

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

            // 默认显示均线数据
            var five_average = data.five_average;
            var ten_average = data.ten_average;
            var twenty_average = data.twenty_average;
            var thirty_average = data.thirty_average;
            var v_ma_5 = data.v_ma_5;
            var v_ma_10 = data.v_ma_10;
         
            inter.default_m5 = five_average[five_average.length - 1];
            inter.default_m10 = ten_average[ten_average.length - 1];
            inter.default_m20 = twenty_average[twenty_average.length - 1];
            inter.default_m30 = thirty_average[thirty_average.length - 1];

            inter.default_volume = data.data[data.data.length - 1];
            inter.default_vm5 = v_ma_5[v_ma_5.length - 1];
            inter.default_vm10 = v_ma_10[v_ma_10.length - 1];


            // 获取单位绘制区域
            var rect_unit = common.get_rect.apply(this,[canvas,data.data.length]);
            this.options.rect_unit = rect_unit;

            var data_arr = data.data;
            var XMark = this.options.XMark = [];
            var data_arr_length = data_arr.length;
            if(data_arr_length > 0){
                XMark.push(data_arr[0].date_time);
                XMark.push(data_arr[Math.floor(data_arr_length * 1 / 4)].date_time);
                XMark.push(data_arr[Math.floor(data_arr_length * 2 / 4)].date_time);
                XMark.push(data_arr[Math.floor(data_arr_length * 3 / 4)].date_time);
                XMark.push(data_arr[data_arr_length - 1].date_time);
            }
            

            // 绘制坐标轴
            new DrawXY(this.options);

            

            // 绘制K线图
            drawK.apply(this,[ctx,data_arr]);
            // 绘制均线
            drawMA.apply(this,[this.options]);
            // 绘制成交量
            drawV.apply(this,[this.options]);
            // 绘制技术指标
            drawT.apply(this,[this.options]);

            // 绘制均线图
            // new DrawMA(this.options);
            // 绘制成交量图
            // new DrawV(this.options);

            // 上榜日标识点
            if(this.options.interactive.options.pointsContainer){
                var points =  this.options.interactive.options.pointsContainer.children;
                this.markPointsDom = points;
            }

            // 隐藏loading效果
            inter.hideLoading();
            
            // 图表加载完成时间
            this.options.onChartLoaded(this);

        // }catch(e){
        //     // 缩放按钮点击有效
        //     _this.options.clickable = true;
        //     // 暂无数据
        //     inter.showNoData();
        //     // 隐藏loading效果
        //     inter.hideLoading();
        // }
        
       // 加水印
       watermark.apply(this,[this.options.context,90,20,82,20]);

       return true;
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


        // if(!delaytouch){
            common.addEvent.call(_this, canvas, "mousemove",function(event){
                //console.info(event);
                dealEvent.apply(_this,[inter,event]);
                try {
                    event.preventDefault();
                } catch (e) {
                    event.returnValue = false;
                }
            });

            common.addEvent.call(_this, canvas, "mouseleave",function(event){
                //console.info(event);
                inter.hide();
                try {
                    event.preventDefault();
                } catch (e) {
                    event.returnValue = false;
                }
            });

            common.addEvent.call(_this, canvas, "mouseenter",function(event){
                //console.info(event);
                inter.show();
                try {
                    event.preventDefault();
                } catch (e) {
                    event.returnValue = false;
                }
            });
        // }
        
        // 放大按钮
        var scale_plus = inter.options.scale.plus;
        // 缩小按钮
        var scale_minus = inter.options.scale.minus;

        // 点击放大
        common.addEvent.call(_this, scale_plus, "click",function(event){
            var scale_count = _this.options.scale_count;
            if(scale_count < 2 && _this.options.clickable){
                // 缩放按钮点击无效
                _this.options.clickable = false;
                scale_minus.style.opacity = "1";
                _this.options.scale_count = scale_count + 1;

                // 清除上榜日标识
                if(_this.options.interactive.options.pointsContainer){
                    _this.options.interactive.options.pointsContainer.innerHTML = "";
                }
                // 清空画布
                ctx.clearRect(0,-_this.options.margin.top,canvas.width,canvas.height);
                scaleClick.apply(_this);
            }

            if(_this.options.scale_count >= 2){
                scale_plus.style.opacity = "0.5";
            }
            
        });

        // 点击缩小
        common.addEvent.call(_this, scale_minus, "click",function(event){
            var scale_count = _this.options.scale_count;
            if(scale_count > -2 && _this.options.clickable){
                // 缩放按钮点击无效
                _this.options.clickable = false;
                scale_plus.style.opacity = "1";
                _this.options.scale_count = scale_count - 1;

                // 清除上榜日标识
                if(_this.options.interactive.options.pointsContainer){
                    _this.options.interactive.options.pointsContainer.innerHTML = "";
                }
                // 清空画布
                ctx.clearRect(0,-_this.options.margin.top,canvas.width,canvas.height);
                scaleClick.apply(_this);
            }

            if(_this.options.scale_count <= -2){
                scale_minus.style.opacity = "0.5";
            }
            
        });

    }
    // 图表交互
    function dealEvent(inter,eventposition){

        var canvas = this.options.canvas;

        var k_data = this.options.data.data;
        var ma_5_data = this.options.data.five_average;
        var ma_10_data = this.options.data.ten_average;
        var ma_20_data = this.options.data.twenty_average;
        var ma_30_data = this.options.data.thirty_average;
        var v_ma_5 = this.options.data.v_ma_5;
        var v_ma_10 = this.options.data.v_ma_10;

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
        var c_x = (c_pos.x).toFixed(0);
        // var c_y = (c_pos.y).toFixed(0);

        // 当前K线在数组中的下标
        var index = Math.floor((c_x - this.options.padding_left)/rect_w);

        if(k_data[index]){
            // 显示行情数据
            inter.showTip(canvas,w_x,k_data[index]);
            
            // 显示十字指示线的
            var cross = common.canvasToWindow.apply(this,[canvas,k_data[index].cross_x,k_data[index].cross_y]);
            var cross_w_x = cross.x;
            var cross_w_y = cross.y;
            inter.cross(canvas,cross_w_x,cross_w_y);
        }

        if(ma_5_data[index]){
             // 标识均线数据
             inter.markMA(canvas,ma_5_data[index],ma_10_data[index],ma_20_data[index],ma_30_data[index]);
             inter.markVMA(canvas,k_data[index].volume,v_ma_5[index],v_ma_10[index]);
        }

    }

    return ChartK;
})();

module.exports = ChartK;
