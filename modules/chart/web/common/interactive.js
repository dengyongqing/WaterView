/**
 * 图表交互
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
 *     c_1_height:  行情图表（分时图或K线图）的高度
 *     rect_unit:   分时图或K线图单位绘制区域
 *
 * 	   cross: 	十字指示线dom对象
 * 	   mark_ma: 	均线标识dom对象
 * 	   scale: 	缩放dom对象
 * }
 *
 */

// 拓展，合并，复制
var extend = require('tools/extend2');
// 工具
var common = require('chart/web/common/common');
// 主题
var theme = require('theme/default');

var Interactive = (function() {

    // 构造函数
    function Interactive(options) {
        this.defaultoptions = theme.interactive;
        this.options = {};
        this.options = extend(this.options, this.defaultoptions, options);
    }

    // 鼠标十字标识线
    Interactive.prototype.cross = function(canvas, w_x, w_y) {
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
            x_line.style.width = canvas.width / dpr + "px";
            this.options.cross.x_line = x_line;
            /*X轴和Y轴标示线相交点*/
            var point = document.createElement("div");
            point.className = "cross-p";
            point.style.width = "2px";
            point.style.height = "2px";
            point.style.borderRadius = point.style.width;
            point.style.backgroundColor = this.options.point_color;
            this.options.cross.point = point;
            /*创建文档碎片*/
            var frag = document.createDocumentFragment();
            // if(this.options.type == "TL"){
            if (this.options.crossline) {
                frag.appendChild(x_line);
                frag.appendChild(y_line);
                frag.appendChild(point);
            } else {
                frag.appendChild(y_line);
            }
            document.getElementById(this.options.container).appendChild(frag);
        }
        var y_line = this.options.cross.y_line;
        if (y_line) {
            y_line.style.left = w_x + "px";
        }
        var x_line = this.options.cross.x_line;
        if (x_line) {
            x_line.style.top = w_y + "px";
        }
        var point = this.options.cross.point;
        if (point) {
            var p_w = this.options.point_width;
            point.style.left = w_x - p_w / 2 + "px";
            point.style.top = w_y - p_w / 2 + "px";
        }
    }

    // 鼠标十字标识线(webTime)
    Interactive.prototype.crossTime = function(canvas, w_x, w_y) {
        var offsetTop = this.options.canvas_offset_top;
        var canvasHeight = this.options.canvas.height;
        var containerId = this.options.container;

        if (!this.options.cross) {
            this.options.cross = {};
            /*Y轴标识线*/
            var y_line = document.createElement("div");
            y_line.className = "cross-y";
            y_line.style.height = canvasHeight - offsetTop + "px";
            y_line.style.top = offsetTop + "px";
            this.options.cross.y_line = y_line;

            /*X轴标识线*/
            var x_line = document.createElement("div");
            x_line.className = "cross-x";
            x_line.style.width = canvas.width + "px";
            this.options.cross.x_line = x_line;
            /*创建文档碎片*/
            var frag = document.createDocumentFragment();
            if (this.options.crossline) {
                frag.appendChild(x_line);
                frag.appendChild(y_line);
            } else {
                frag.appendChild(y_line);
            }
            document.getElementById(containerId).appendChild(frag);
        }
        var y_line = this.options.cross.y_line;
        if (this.options.cross.y_line) {
            y_line.style.left = w_x + "px";
        }
        var x_line = this.options.cross.x_line;
        if (this.options.cross.x_line) {
            x_line.style.top = w_y + "px";
        }
    }

    Interactive.prototype.showTipsTime = function(cross_w_x, cross_w_y, time_data, index){
        /*将要用到的各种参数*/
        var canvas = this.options.canvas;
        var padding_left = this.options.padding.left;
        var padding_right = this.options.padding.right;
        var offsetTop = this.options.canvas_offset_top;
        var c_1_height = this.options.c_1_height;
        var containerId = this.options.container;
        var map = ['周一', '周二', '周三', '周四','周五', '周六', '周日'];
        var itemData;
        if(index < 0){
            itemData = time_data[0];
        }else if(index > time_data.length-1){
            itemData = time_data[time_data.length-1];
        }else{
            itemData = time_data[index];
        }
        var topText = itemData.dateTime.substring(5)+" "+ itemData.time + " "+
                                map[(new Date(itemData.dateTime)).getDay()]+" 最新价:"+itemData.price+
                                " 成交量:"+ common.format_unit(itemData.volume.toFixed(0), 2)+"(手) 成交额:"+ 
                                common.format_unit(itemData.volume*itemData.price*100, 2) + " 均价:"+ itemData.avg_cost;

        // debugger;
        if(!this.options.webTimeTips){
            var y_left, y_right, x_bottom, x_top;
            var frag = document.createDocumentFragment();
            /*y轴上左边的提示*/
            y_left = document.createElement("div");
            y_left.setAttribute("id", "time_y_left");
            y_left.className = "time-tips-coordinate";
            /*y轴上右边的提示*/
            y_right = document.createElement("div");
            y_right.setAttribute("id", "time_y_right");
            y_right.className = "time-tips-coordinate";
            y_right.style.left = canvas.width - padding_right + "px";
            /*x轴底部的时间提示*/
            x_bottom = document.createElement("div");
            x_bottom.setAttribute("id", "time_x_bottom");
            x_bottom.className = "time-tips-coordinate";
            /*x轴顶部的时间提示*/
            x_top = document.createElement("div");
            x_top.setAttribute("id", "time_x_top");
            x_top.className = "time-tips-top";
            x_top.style.top = offsetTop - 18 + "px";
            x_top.style.left = padding_left + "px";
            this.options.webTimeTips = {};
            this.options.webTimeTips.time_y_left = y_left;
            this.options.webTimeTips.time_y_right = y_right;
            this.options.webTimeTips.time_x_top = x_top;
            this.options.webTimeTips.time_x_bottom = x_bottom;

            frag.appendChild(y_left)
            frag.appendChild(y_right)
            frag.appendChild(x_bottom)
            frag.appendChild(x_top)
            document.getElementById(containerId).appendChild(frag);

            //跟随鼠标变化需要更改的纵坐标上的的提示*/
            y_left.style.top = cross_w_y + "px";
            y_left.innerHTML = itemData.price;
            y_right.style.top = cross_w_y + "px";
            y_right.innerHTML = itemData.percent;
            
            //跟随鼠标变化需要更改的横坐标上的的提示*/
            x_bottom.innerHTML = itemData.time;
            x_bottom.style.left = cross_w_x - x_bottom.clientWidth/2 + "px";
            x_top.innerHTML = topText;
            x_top.style.display = 'block';
        }else{
            var y_left = document.getElementById("time_y_left");
            var y_right = document.getElementById("time_y_right");
            var x_bottom = document.getElementById("time_x_bottom");
            var x_top = document.getElementById("time_x_top");
            //跟随鼠标变化需要更改的纵坐标上的的提示*/
            y_left.style.top = cross_w_y + "px";
            y_left.innerHTML = itemData.price;
            y_left.style.left = padding_left - y_left.clientWidth + 'px';
            y_left.style.display = 'block';
            y_right.style.top = cross_w_y + "px";
            y_right.style.display = 'block';
            y_right.innerHTML = itemData.percent;
            
            //跟随鼠标变化需要更改的横坐标上的的提示*/
            x_bottom.style.left = cross_w_x + "px";
            x_bottom.style.display = 'block';
            x_bottom.innerHTML = itemData.time;
            if(cross_w_x < padding_left + x_bottom.clientWidth/2){
                x_bottom.style.left = padding_left + "px";
            }else if(cross_w_x > canvas.width - padding_right - x_bottom.clientWidth/2){
                x_bottom.style.left = canvas.width - padding_right - x_bottom.clientWidth + "px";
            }else{
                x_bottom.style.left = cross_w_x - x_bottom.clientWidth/2 + "px";
            }
            x_bottom.style.top = c_1_height + offsetTop - x_bottom.clientHeight + "px";
            
            x_top.style.display = 'block';
            x_top.innerHTML = topText;
        }
    };


    Interactive.prototype.markMA = function(canvas, type, datas, start, end, index) {

        var colors = ["#6e9fe9", "#ffba42", "#fe59fe", "#ff7e58"];
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
            markMAContainer.style.top = 5 + "px";
            markMAContainer.style.left = this.options.padding.left + 10 + "px";

            /*创建文档碎片*/
            var frag = document.createDocumentFragment();
            for(i = 0; i < dataObj.length; i++){
                var span = document.createElement('span');
                var temp = dataObj[i].value.length-1;
                span.innerHTML = dataObj[i].name.toUpperCase() + ": " + (dataObj[i].value)[temp].value;
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
                //更改内容
                for (var i = 0; i < dataObj.length; i++) {
                    var span = spans[i];
                    try {
                        span.innerHTML = dataObj[i].name.toUpperCase() + ": " + dataObj[i].value[index].value;
                    } catch (e) {
                        if (dataObj[i].value[index].value == null || dataObj[i].value[index].value == undefined) {
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

    Interactive.prototype.markVMA = function(canvas, volume, obj_5, obj_10) {

        // 绘制移动平均线标识
        // var c_box = canvas.getBoundingClientRect();
        // var dpr = this.options.dpr;
        if (!this.options.mark_v_ma) {
            this.options.mark_v_ma = {};

            // 成交量均线
            var v_div_mark = document.createElement("div");
            v_div_mark.className = "mark-ma";
            v_div_mark.style.left = this.options.padding.left + "px";
            v_div_mark.style.top = this.options.c2_y_top + "px";
            this.options.mark_v_ma.mark_v_ma = v_div_mark;

            /*创建文档碎片*/
            var v_frag = document.createDocumentFragment();

            // 成交量5日均线
            var v_volume = document.createElement('span');
            v_volume.className = "span-m30";
            v_volume.style.position = "absolute";
            v_volume.style.left = "10px";
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
            v_ma_5.className = "span-m20";
            v_ma_5.style.position = "absolute";
            v_ma_5.style.left = "160px";
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
            v_ma_10.className = "span-m5";
            v_ma_10.style.position = "absolute";
            // v_ma_10.style.left = this.options.padding.left + this.options.drawWidth * 1/3 - 50 + "px";
            v_ma_10.style.left = "310px";
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
            markTContainer.style.top = this.options.c3_y_top + 5 + "px";
            markTContainer.style.left = this.options.padding.left + 10 + "px";

            /*创建文档碎片*/
            var frag = document.createDocumentFragment();
            for(i = 0; i < dataObj.length; i++){
                var span = document.createElement('span');
                var temp = dataObj[i].value.length-1;
                span.innerHTML = dataObj[i].name.toUpperCase() + ": " + (dataObj[i].value)[temp].value;
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
                        span.innerHTML = dataObj[i].name.toUpperCase() + ": " + dataObj[i].value[index].value;
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
    Interactive.prototype.showTip = function(canvas, x, obj) {
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
            frag.appendChild(tipsLine.call(this, "height", "最高"));
            frag.appendChild(tipsLine.call(this, "low", "最低"));
            frag.appendChild(tipsLine.call(this, "close", "收盘"));
            frag.appendChild(tipsLine.call(this, "percent", "涨跌幅"));
            frag.appendChild(tipsLine.call(this, "priceChange", "涨跌额"));
            frag.appendChild(tipsLine.call(this, "count", "成交量"));
            // frag.appendChild(tipsLine.call(this, "count", "成交金额"));
            // frag.appendChild(tipsLine.call(this, "count", "振幅"));
            // frag.appendChild(tipsLine.call(this, "count", "换手率"));
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

            tip_obj.close.innerText = obj.close;
            tip_obj.open.innerText = obj.open;
            tip_obj.height.innerText = obj.highest;
            tip_obj.low.innerText = obj.lowest;
            tip_obj.percent.innerText = obj.percent + '%';
            tip_obj.count.innerText = common.format_unit(volume);
            tip_obj.priceChange.innerText = obj.priceChange;
            tip_obj.date_data.innerHTML = obj.date_time;
            // tip_obj.time.innerText = obj.date_time.replace(/-/g, "/");

        }



        if (x <= (canvas.width / this.options.dpr / 2)) {
            div_tip.style.left = (canvas.width - this.options.padding.right) / this.options.dpr - this.options.tip.div_tip_width - 3 + "px";
        } else if (x >= (canvas.width / this.options.dpr / 2)) {
            div_tip.style.left = this.options.padding.left / this.options.dpr + "px";
        } else {}

        // if(x <= (div_tip.clientWidth/2 + this.options.padding_left/this.options.dpr)){
        //     div_tip.style.left = this.options.padding_left/this.options.dpr + "px";
        // }else if(x >= (canvas.width/this.options.dpr - div_tip.clientWidth/2)){
        //     div_tip.style.left = canvas.width/this.options.dpr - div_tip.clientWidth + "px";
        // }else{
        //     div_tip.style.left = x - div_tip.clientWidth/2 + "px";
        // }
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

        if(this.options.webTimeTips){
            var time_y_left = this.options.webTimeTips.time_y_left;
            if(time_y_left){
                time_y_left.style.display = 'block';
            }
            var time_y_right = this.options.webTimeTips.time_y_right;
            if(time_y_right){
                time_y_right.style.display = 'block';
            }
            var time_x_bottom = this.options.webTimeTips.time_x_bottom;
            if(time_x_bottom){
                time_x_bottom.style.display = 'block';
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
            this.options.markMAContainer.innerHTML = this.options[this.options.markUPTType].defaultMaHtml;
                }

        if(this.options.markTContainer){
            this.options.markTContainer.innerHTML = this.options[this.options.markTType].defaultTHtml;
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

        if(this.options.webTimeTips){
            var time_y_left = this.options.webTimeTips.time_y_left;
            if(time_y_left){
                time_y_left.style.display = 'none';
            }
            var time_y_right = this.options.webTimeTips.time_y_right;
            if(time_y_right){
                time_y_right.style.display = 'none';
            }
            var time_x_bottom = this.options.webTimeTips.time_x_bottom;
            if(time_x_bottom){
                time_x_bottom.style.display = 'none';
            }
        }

    }

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
