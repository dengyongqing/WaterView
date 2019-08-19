/**
 * 图表交互
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

// 拓展，合并，复制
var extend = require('tools/extend2');
// 工具
var common = require('chart/web/common/common');
// 主题
var theme = require('theme/default');
var changeUnit = require('chart/web/time/changeUnit');

var Interactive = (function() {

    // 构造函数
    function Interactive(options) {
        this.defaultoptions = theme.interactive;
        this.options = {};
        this.options = extend(this.options, this.defaultoptions, options);
    }

    // 鼠标十字标识线
    Interactive.prototype.cross = function(canvas, w_x, w_y,c_y,w_y_open,w_y_highest,w_y_lowest) {
        var dpr = this.options.dpr;

        if (!this.options.cross) {
            this.options.cross = {};
            /*Y轴标识线*/
            var y_line = document.createElement("div");
            y_line.className = "cross-y";
            y_line.style.height = this.options.c4_y_top - this.options.c1_y_top + "px";
            y_line.style.top = this.options.c1_y_top + "px";
            this.options.cross.y_line = y_line;

            /*X轴标识线*/
            var x_line = document.createElement("div");
            x_line.className = "cross-x";
            x_line.style.width = this.options.drawWidth + "px";
            this.options.cross.x_line = x_line;
            /*X轴和Y轴标示线相交点*/
            var point = document.createElement("div");
            point.className = "cross-p";
            point.style.width = "11px";
            point.style.height = "11px";
            this.options.point_width = 11;
            point.style.borderRadius = point.style.width;
            point.style.background = "url("+require("images/dian.png")+")";
            this.options.cross.point = point;
            /*创建文档碎片*/
            var frag = document.createDocumentFragment();
            frag.appendChild(x_line);
            frag.appendChild(y_line);
            frag.appendChild(point);

            document.getElementById(this.options.container).appendChild(frag);
        }
        var y_line = this.options.cross.y_line;
        var x_line_y = 0;

        if(c_y >= w_y_lowest){
            x_line_y = w_y_lowest;
        }else if(c_y <= w_y_highest){
            x_line_y = w_y_highest;
        }else{
            if(w_y_open < w_y){
                if(c_y >= w_y && c_y <= w_y_lowest){
                     x_line_y = w_y;
                }else if(c_y >= w_y_open && c_y < w_y){
                    x_line_y = w_y_open;
                }else if(c_y >= w_y_highest && c_y < w_y_open){
                    x_line_y = w_y_highest;
                }

            }else{
                if(c_y >= w_y_open && c_y <= w_y_lowest){
                     x_line_y = w_y_open;
                }else if(c_y >= w_y && c_y < w_y_open){
                    x_line_y = w_y;
                }else if(c_y >= w_y_highest && c_y < w_y){
                    x_line_y = w_y_highest;
                }
            }
        }

        if (y_line) {
            y_line.style.left = w_x + "px";
        }
        var x_line = this.options.cross.x_line;
        if (x_line) {
            x_line.style.top = x_line_y + this.options.margin.top + "px";
            x_line.style.left = this.options.padding.left + "px";
        }
        var point = this.options.cross.point;
        if (point) {
            var p_w = this.options.point_width;
            point.style.left = w_x - p_w / 2 + "px";
            point.style.top = x_line_y + this.options.margin.top - p_w / 2 + "px";
        }
    }



    Interactive.prototype.markMA = function(canvas, type, datas, start, end, index, color_arr) {

        // var colors = ["#6e9fe9", "#ffba42", "#fe59fe", "#ff7e58"];
        var colors = color_arr;

        // colors.push(color_obj.m5Color);
        // colors.push(color_obj.m10Color);
        // colors.push(color_obj.m20Color);
        // colors.push(color_obj.m30Color);
        var dataObj = [];
        var i = 0;
        for (var item in datas) {
            dataObj.push({ value: datas[item].slice(start, end), name: item });
        }
        if (!this.options.markMAContainer || type != this.options.markUPTType) {

            this.options.markUPTType = type;
            //创建并添加最下方一系列技术指标的外部包含div
            if(!this.options.markMAContainer)
                this.options.markMAContainer = document.createElement("div");
            var markMAContainer = this.options.markMAContainer;
            markMAContainer.innerHTML = "";
            markMAContainer.className = "markTContainer";
            markMAContainer.style.top = 3 + "px";
            markMAContainer.style.left = this.options.padding.left + 10 + "px";

            /*创建文档碎片*/
            var frag = document.createDocumentFragment();
            for(i = 0; i < dataObj.length; i++){

                var span = document.createElement('span');
                var temp = dataObj[i].value.length-1;
                span.innerHTML = dataObj[i].name.toUpperCase() + ": " + ((dataObj[i].value)[temp].value == null ? "-" : (dataObj[i].value)[temp].value);
                span.style.color = colors[i];
                frag.appendChild(span);
            }
            markMAContainer.appendChild(frag);
            this.options[type] = {};
            this.options[type].defaultMaHtml = markMAContainer.innerHTML;

            document.getElementById(this.options.container).appendChild(markMAContainer);
        } else {
                var markMAContainer = this.options.markMAContainer;
                var spans = markMAContainer.children;

                if(!index && type == "junxian"){
                    markMAContainer.innerHTML = this.options[this.options.markUPTType].defaultMaHtml; 
                    for (var i = 0; i < dataObj.length; i++) {
                        var span = spans[i];
                        span.style.color = colors[i];
                    }
                    this.options[type].defaultMaHtml = markMAContainer.innerHTML;
                }else{
                    //更改内容
                    for (var i = 0; i < dataObj.length; i++) {
                        var span = spans[i];
                        try {
                            span.innerHTML = dataObj[i].name.toUpperCase() + ": " + (dataObj[i].value[index].value == null ? "-" : dataObj[i].value[index].value);
                        } catch (e) {
                            if(!index){
                                

                            }else if (dataObj[i].value[index].value == null || dataObj[i].value[index].value == undefined) {
                                span.innerText = dataObj[i].name.toUpperCase() + ": -";
                            } else {
                                var span = document.createElement('span');
                                span.innerHTML = dataObj[i].name.toUpperCase() + ": " + dataObj[i].value[index].value;
                                span.style.color = colors[i];
                                markMAContainer.appendChild(span);
                            }

                        }
                    }
                }
                
        }

    }

    Interactive.prototype.markVMA = function(canvas, volume, obj_5, obj_10) {

        // 绘制移动平均线标识
        // var c_box = canvas.getBoundingClientRect();
        // var dpr = this.options.dpr;
        if (!this.options.mark_v_ma) {
            this.options.mark_v_ma = {};

            // 成交量均线
            var v_div_mark = document.createElement("div");
            // v_div_mark.className = "mark-ma";
            v_div_mark.className = "markTContainer";
            v_div_mark.style.left = this.options.padding.left + "px";
            v_div_mark.style.top = this.options.c2_y_top + 3 + "px";
            this.options.mark_v_ma.mark_v_ma = v_div_mark;

            /*创建文档碎片*/
            var v_frag = document.createDocumentFragment();

            // 成交量5日均线
            var v_volume = document.createElement('span');
            v_volume.style.marginLeft = "10px";
            v_volume.style.color = "#fe59fe";
            this.options.mark_v_ma.v_volume = v_volume;
            if (volume) {
                this.options.mark_v_ma.v_volume.innerText = "VOLUME: " + common.format_unit(volume, 2);
            } else {
                if (this.default_volume) {
                    this.options.mark_v_ma.v_volume.innerText = "VOLUME: " + common.format_unit(this.default_volume.volume, 2);
                } else {
                    this.options.mark_v_ma.v_volume.innerText = "VOLUME: -";
                }
            }

            // 成交量5日均线
            var v_ma_5 = document.createElement('span');
            v_ma_5.style.color = "#488ee6";
            this.options.mark_v_ma.v_ma_5 = v_ma_5;
            if (obj_5) {
                this.options.mark_v_ma.v_ma_5.innerText = "MA5: " + common.format_unit(obj_5.value, 2);
            } else {
                if (this.default_vm5) {
                    this.options.mark_v_ma.v_ma_5.innerText = "MA5: " + common.format_unit(this.default_vm5.value, 2);
                } else {
                    this.options.mark_v_ma.v_ma_5.innerText = "MA5: -";
                }
            }

            // 成交量10日均线
            var v_ma_10 = document.createElement('span');
            v_ma_10.style.color = "#f4cb15";
            // v_ma_10.style.left = this.options.padding.left + this.options.drawWidth * 1/3 - 50 + "px";
            this.options.mark_v_ma.v_ma_10 = v_ma_10;
            if (obj_10) {
                this.options.mark_v_ma.v_ma_10.innerText = "MA10: " + common.format_unit(obj_10.value, 2);
            } else {
                if (this.default_vm10) {
                    this.options.mark_v_ma.v_ma_10.innerText = "MA10: " + common.format_unit(this.default_vm10.value, 2);
                } else {
                    this.options.mark_v_ma.v_ma_10.innerText = "MA10: -";
                }
            }

            v_frag.appendChild(v_volume);
            v_frag.appendChild(v_ma_5);
            v_frag.appendChild(v_ma_10);
            v_div_mark.appendChild(v_frag);

            document.getElementById(this.options.container).appendChild(v_div_mark);
            // div_tip.style.left = w_pos.x - 300 + "px";
        } else {
            if (volume) {
                this.options.mark_v_ma.v_volume.innerText = "VOLUME: " + common.format_unit(volume, 2);
            } else {
                if (this.default_volume) {
                    this.options.mark_v_ma.v_volume.innerText = "VOLUME: " + common.format_unit(this.default_volume.volume, 2);
                } else {
                    this.options.mark_v_ma.v_volume.innerText = "VOLUME: -";
                }
            }

            if (obj_5) {
                this.options.mark_v_ma.v_ma_5.innerText = "MA5: " + common.format_unit(obj_5.value, 2);
            } else {
                if (this.default_vm5) {
                    this.options.mark_v_ma.v_ma_5.innerText = "MA5: " + common.format_unit(this.default_vm5.value, 2);
                } else {
                    this.options.mark_v_ma.v_ma_5.innerText = "MA5: -";
                }
            }

            if (obj_10) {
                this.options.mark_v_ma.v_ma_10.innerText = "MA10: " + common.format_unit(obj_10.value, 2);
            } else {
                if (this.default_vm10) {
                    this.options.mark_v_ma.v_ma_10.innerText = "MA10: " + common.format_unit(this.default_vm10.value, 2);
                } else {
                    this.options.mark_v_ma.v_ma_10.innerText = "MA10: -";
                }
            }


        }

    }

    Interactive.prototype.markT = function(canvas, type, datas, start, end, index) {
        var colors = ["#6e9fe9", "#ffba42", "#fe59fe", "#ff7e58"];
        var dataObj = [];
        var i = 0;
        for (var item in datas) {
            dataObj.push({ value: datas[item].slice(start, end), name: item });
        }
        if (!this.options.markTContainer || type != this.options.markTType) {
            this.options.markTType = type;
            //创建并添加最下方一系列技术指标的外部包含div
            if(!this.options.markTContainer)
                this.options.markTContainer = document.createElement("div");
            var markTContainer = this.options.markTContainer;
            markTContainer.innerHTML = "";
            markTContainer.className = "markTContainer";
            markTContainer.style.top = this.options.c3_y_top + 3 + "px";
            markTContainer.style.left = this.options.padding.left + 10 + "px";

            /*创建文档碎片*/
            var frag = document.createDocumentFragment();
            for(i = 0; i < dataObj.length; i++){
                var span = document.createElement('span');
                var temp = dataObj[i].value.length-1;
                var avgValue = "-";
                if(dataObj[i].value[index] !== undefined && dataObj[i].value[index].value !== null){
                    avgValue = dataObj[i].value[index].value;
                }
                span.innerHTML = dataObj[i].name.toUpperCase() + ": " + avgValue;
                span.style.color = colors[i];
                frag.appendChild(span);
            }
            markTContainer.appendChild(frag);
            this.options[type] = {};
            this.options[type].defaultTHtml = markTContainer.innerHTML;

            document.getElementById(this.options.container).appendChild(markTContainer);
        } else {
                var markTContainer = this.options.markTContainer;
                var spans = markTContainer.children;
                //更改内容
                for (var i = 0; i < dataObj.length; i++) {
                    var span = spans[i];
                    try {
                        span.innerHTML = dataObj[i].name.toUpperCase() + ": " + (dataObj[i].value[index].value == null ? "-" : dataObj[i].value[index].value);
                    } catch (e) {
                        if (dataObj[i].value[index].value == null || dataObj[i].value[index].value == undefined) {
                            span.innerText = dataObj[i].name.toUpperCase() + ": -";
                        } else {
                            var span = document.createElement('span');
                            span.innerHTML = dataObj[i].name.toUpperCase() + ": " + dataObj[i].value[index].value;
                            span.style.color = colors[i];
                            markTContainer.appendChild(span);
                        }

                    }
                }
        }
    }


    // 缩放
    Interactive.prototype.scale = function(canvas) {
        /*K线图表右下角相对于父容器的位置*/
        var w_pos = common.canvasToWindow.apply(this, [canvas, canvas.width, this.options.c_k_height]);
        if (!this.options.scale) {
            this.options.scale = {};
            /*创建外部包裹元素*/
            var scale_div = document.createElement("div");
            scale_div.className = "scale-div";
            scale_div.style.left = canvas.width - this.options.padding.right - 120 + "px";
            scale_div.style.top = w_pos.y - 40 + "px";
            this.options.scale.scale = scale_div;

            /*创建文档碎片*/
            var frag = document.createDocumentFragment();

            /*创建减号*/
            var minus_button = document.createElement('span');
            minus_button.className = "span-minus";
            this.options.scale.minus = minus_button;

            /*创建加号*/
            var plus_button = document.createElement('span');
            plus_button.className = "span-plus";
            this.options.scale.plus = plus_button;

            frag.appendChild(minus_button);
            frag.appendChild(plus_button);
            scale_div.appendChild(frag);
            document.getElementById(this.options.container).appendChild(scale_div);
        }
    }

    // Tip显示行情数据
    Interactive.prototype.showTip = function(canvas, w_x, w_y, c_y, w_y_open, w_y_highest, w_y_lowest, obj) {
        if (!this.options.tip) {
            this.options.tip = {};
            // 创建外部包裹元素
            var div_tip = document.createElement("div");
            div_tip.className = "web-show-tip";

            this.options.tip.tip = div_tip;
            div_tip.style.top = this.options.c1_y_top + 30 + "px";

            // 创建文档碎片
            var frag = document.createDocumentFragment();

            // 创建收盘价格
            var date_data = document.createElement('div');
            date_data.className = "web-tip-first-line";
            this.options.tip.date_data = date_data;
            date_data.innerText = obj.date_time;

            //组建一行数据
            var tipsLine = function(type, name) {
                var data_name = document.createElement('div');
                data_name.className = "web-tip-line-left";
                data_name.innerText = name;

                var data_data = document.createElement('div');
                data_data.className = "web-tip-line-right";
                this.options.tip[type] = data_data;

                var web_tip_line_container = document.createElement("div");
                web_tip_line_container.className = "web-tip-line-container";
                web_tip_line_container.appendChild(data_name);
                web_tip_line_container.appendChild(data_data);

                return web_tip_line_container;
            }
            // 创建百分比
            var percent = document.createElement('span');
            this.options.tip.percent = percent;

            // 创建股数
            var count = document.createElement('span');
            this.options.tip.count = count;

            // 创建时间
            var time = document.createElement('span');
            this.options.tip.time = time;

            frag.appendChild(date_data);
            //添加各项数据
            frag.appendChild(tipsLine.call(this, "open", "开盘"));
            frag.appendChild(tipsLine.call(this, "highest", "最高"));
            frag.appendChild(tipsLine.call(this, "lowest", "最低"));
            frag.appendChild(tipsLine.call(this, "close", "收盘"));
            frag.appendChild(tipsLine.call(this, "percent", "涨跌幅"));
            frag.appendChild(tipsLine.call(this, "priceChange", "涨跌额"));
            frag.appendChild(tipsLine.call(this, "count", "成交量"));
            frag.appendChild(tipsLine.call(this, "volumeMoney", "成交金额"));
            frag.appendChild(tipsLine.call(this, "amplitude", "振幅"));
            div_tip.appendChild(frag);
            document.getElementById(this.options.container).appendChild(div_tip);
            this.options.tip.div_tip_width = div_tip.clientWidth;

            percent.className = percent.className;
            count.className = count.className;
            time.className = time.className;

        } else {
            var tip_obj = this.options.tip;
            var div_tip = this.options.tip.tip;
            var volume = obj.volume;

            /*判断哪个数据段加粗*/
            if (c_y >= w_y_lowest) {
                x_line_y = w_y_lowest;
            } else if (c_y <= w_y_highest) {
                x_line_y = w_y_highest;
            } else {
                if (w_y_open < w_y) {
                    if (c_y >= w_y && c_y <= w_y_lowest) {
                        x_line_y = w_y;
                    } else if (c_y >= w_y_open && c_y < w_y) {
                        x_line_y = w_y_open;
                    } else if (c_y >= w_y_highest && c_y < w_y_open) {
                        x_line_y = w_y_highest;
                    }
                } else {
                    if (c_y >= w_y_open && c_y <= w_y_lowest) {
                        x_line_y = w_y_open;
                    } else if (c_y >= w_y && c_y < w_y_open) {
                        x_line_y = w_y;
                    } else if (c_y >= w_y_highest && c_y < w_y) {
                        x_line_y = w_y_highest;
                    }
                }
            }

            var tipLineNames = ["close","open","highest","lowest"];

            for(var i = 0; i < tipLineNames.length; i++){
                tip_obj[tipLineNames[i]].innerText = obj[tipLineNames[i]];
                if(obj[tipLineNames[i]] > obj.yc){
                    tip_obj[tipLineNames[i]].style.color = this.options.up_color;
                }
                if(obj[tipLineNames[i]] < obj.yc){
                    tip_obj[tipLineNames[i]].style.color = this.options.down_color;
                }
            }

            var mark, color;
            if(obj.close - obj.yc > 0){
                mark = "+"; color = this.options.up_color;
            }else{
                mark = "-"; color = this.options.down_color;
            }

            tip_obj.amplitude.innerText = obj.amplitude;

            tip_obj.percent.innerText = mark + obj.percent + '%';
            tip_obj.percent.style.color = color;
            tip_obj.priceChange.innerText = mark + "" + obj.priceChange;
            tip_obj.priceChange.style.color = color;
            tip_obj.volumeMoney.innerHTML = obj.volumeMoney;

            tip_obj.count.innerText = common.format_unit(obj.volume);
            tip_obj.date_data.innerHTML = obj.date_time;

            /*复原一次*/
            tip_obj.lowest.parentNode.style.fontWeight = "100";
            tip_obj.highest.parentNode.style.fontWeight = "100";
            tip_obj.close.parentNode.style.fontWeight = "100";
            tip_obj.open.parentNode.style.fontWeight = "100";

            if (x_line_y == w_y_lowest) {
                tip_obj.lowest.parentNode.style.fontWeight = "700";
            }
            if (x_line_y == w_y_highest) {
                tip_obj.highest.parentNode.style.fontWeight = "700";
            }
            if (x_line_y == w_y) {
                tip_obj.close.parentNode.style.fontWeight = "700";
            }
            if (x_line_y == w_y_open) {
                tip_obj.open.parentNode.style.fontWeight = "700";
            }
        }



        if (w_x <= (canvas.width / this.options.dpr / 2)) {
            div_tip.style.left = (canvas.width - this.options.padding.right) / this.options.dpr - this.options.tip.div_tip_width - 3 + "px";
        } else if (w_x >= (canvas.width / this.options.dpr / 2)) {
            div_tip.style.left = this.options.padding.left / this.options.dpr + "px";
        } else {}
    }


    // 标记上榜日
    Interactive.prototype.markPoint = function(x, date, canvas, scale_count) {
        if (scale_count >= 0) {
            // K线图表右下角相对于父容器的位置
            var c1_pos = common.canvasToWindow.apply(this, [canvas, canvas.width, this.options.c_1_height]);
            // 上榜日标记的横坐标
            var p_pos = common.canvasToWindow.apply(this, [canvas, x, this.options.c_1_height]);

            // 创建外部包裹元素
            var markPoint = document.createElement("div");

            markPoint.className = "mark-point";
            var imgUrl = this.options.markPoint.imgUrl;
            // 上榜日标识宽度
            var imgWidth = this.options.markPoint.width == undefined ? 15 : this.options.markPoint.width + "px";
            // 上榜日标识高度
            var imgHeight = this.options.markPoint.height == undefined ? 15 : this.options.markPoint.height + "px";
            if (imgUrl) {
                markPoint.style.background = "url(" + imgUrl + ") no-repeat center center/" + imgWidth + " " + imgHeight + " #cccccc";
                markPoint.style.background = "url(" + imgUrl + ") no-repeat center center/" + imgWidth + " " + imgHeight + " #cccccc";
            }

            if (this.options.markPoint.width && this.options.markPoint.height) {
                markPoint.style.width = imgWidth;
                markPoint.style.height = imgHeight;
            } else {
                markPoint.style.width = imgWidth;
                markPoint.style.height = imgHeight;
                // markPoint.style.borderRadius = "5px";
            }
            markPoint.setAttribute("data-point", date);
            if (!this.options.pointsContainer) {
                var pointsContainer = document.createElement("div");
                this.options.pointsContainer = pointsContainer;
                document.getElementById(this.options.container).appendChild(this.options.pointsContainer);
            }
            this.options.pointsContainer.appendChild(markPoint);
            // 定位上榜日标识点的位置
            markPoint.style.left = p_pos.x - markPoint.clientWidth / 2 + "px";
            markPoint.style.top = c1_pos.y - 30 + "px";

        }

    }

    // 显示交互效果
    Interactive.prototype.show = function() {

        if (this.options.cross) {
            var x_line = this.options.cross.x_line;
            if (x_line) {
                x_line.style.display = "block";
            }
            var y_line = this.options.cross.y_line;
            if (y_line) {
                y_line.style.display = "block";
            }
            var point = this.options.cross.point;
            if (point) {
                point.style.display = "block";
            }
        }

        if (this.options.tip) {
            var tip = this.options.tip.tip;
            if (tip) {
                tip.style.display = "block";
            }

        }
    }

    // 隐藏交互效果
    Interactive.prototype.hide = function() {

        if (this.options.cross) {
            var x_line = this.options.cross.x_line;
            if (x_line) {
                x_line.style.display = "none";
            }
            var y_line = this.options.cross.y_line;
            if (y_line) {
                y_line.style.display = "none";
            }
            var point = this.options.cross.point;
            if (point) {
                point.style.display = "none";
            }
            
        }

        if(this.options.markMAContainer){
            if(this.options[this.options.markUPTType] !== undefined){
                this.options.markMAContainer.innerHTML = this.options[this.options.markUPTType].defaultMaHtml;
            }
        }

        if(this.options.markTContainer){
            if(this.options[this.options.markTType] !== undefined){
                this.options.markTContainer.innerHTML = this.options[this.options.markTType].defaultTHtml;
            }
        }

        if (this.options.mark_v_ma) {

            // 成交量5日均线
            var v_volume = this.options.mark_v_ma.v_volume;
            if (v_volume) {
                if (this.default_volume) {
                    this.options.mark_v_ma.v_volume.innerText = "VOLUME: " + common.format_unit(this.default_volume.volume, 2);
                } else {
                    this.options.mark_v_ma.v_volume.innerText = "VOLUME: -";
                }
            }


            // 成交量5日均线
            var v_ma_5 = this.options.mark_v_ma.v_ma_5;
            if (v_ma_5) {
                if (this.default_vm5) {
                    this.options.mark_v_ma.v_ma_5.innerText = "MA5: " + common.format_unit(this.default_vm5.value, 2);
                } else {
                    this.options.mark_v_ma.v_ma_5.innerText = "MA5: -";
                }
            }

            // 成交量10日均线
            var v_ma_10 = this.options.mark_v_ma.v_ma_10;
            if (v_ma_10) {
                if (this.default_vm10) {
                    this.options.mark_v_ma.v_ma_10.innerText = "MA10: " + common.format_unit(this.default_vm10.value, 2);
                } else {
                    this.options.mark_v_ma.v_ma_10.innerText = "MA10: -";
                }
            }

        }

        if (this.options.tip) {
            var tip = this.options.tip.tip;
            if (tip) {
                tip.style.display = "none";
            }

        }
        
    };

    // 显示loading效果
    Interactive.prototype.showLoading = function() {

        if (this.options.loading) {
            this.options.loading.style.display = "block";
        } else {
            // 获取图表容器
            var chart_container = document.getElementById(this.options.container);
            // var chart_container_height = chart_container.offsetHeight;
            // loading提示信息
            var loading_notice = document.createElement("div");
            loading_notice.className = "loading-chart";
            loading_notice.innerText = "加载中...";
            loading_notice.style.height = this.options.height - 100 + "px";
            loading_notice.style.width = this.options.width + "px";
            // loading_notice.style.paddingTop = chart_container_height / 2 + "px";
            loading_notice.style.paddingTop = "100px";
            // 把提示信息添加到图表容器中
            this.options.loading = loading_notice;
            chart_container.appendChild(loading_notice);
        }

    }

    // 隐藏loading效果
    Interactive.prototype.hideLoading = function() {
        this.options.loading.style.display = "none";
    }

    // 暂无数据
    Interactive.prototype.showNoData = function() {

        if (this.options.noData) {
            this.options.noData.style.display = "block";
        } else {
            //获取图表容器
            var noData_container = document.getElementById(this.options.container);
            // var noData_container_height = noData_container.offsetHeight;
            //无数据时提示信息
            var noData_notice = document.createElement("div");
            noData_notice.className = "loading-chart";
            noData_notice.innerText = "暂无数据";
            noData_notice.style.height = this.options.height - 100 + "px";
            noData_notice.style.width = this.options.width + "px";

            noData_notice.style.paddingTop = "100px";
            //把提示信息添加到图表容器中
            this.options.noData = noData_notice;
            noData_container.appendChild(noData_notice);
        }

    }

    return Interactive;
})();

module.exports = Interactive;
