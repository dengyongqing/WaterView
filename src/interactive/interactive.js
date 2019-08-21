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
 * }
 *
 */

// 拓展，合并，复制
var extend = require('tools/extend2');
// 工具模块
var common = require('tools/common'); 
// 主题
var theme = require('theme/default');

var Interactive = (function() {

	// 构造函数
    function Interactive(options) {
        this.defaultoptions = theme.interactive;
        this.options = extend(this.defaultoptions, options);
        // this.options = extend(true,this.options,this.defaultoptions, options);
    }

  	// 鼠标十字标识线
	Interactive.prototype.cross = function(canvas,w_x,w_y){
	    var c_box = canvas.getBoundingClientRect();
	    var dpr = this.options.dpr;

		if(!this.options.cross){
	        this.options.cross = {};
			/*Y轴标识线*/
	        var y_line = document.createElement("div");
	        y_line.className = "cross-y";
	        if(this.options.showV){
	        	y_line.style.height = (this.options.canvas.height/dpr) + "px";
	        }else{

	        	y_line.style.height = (this.options.c_1_height + this.options.canvas_offset_top)/dpr + "px";
	        }
	        
	        y_line.style.top = "0px";
	        this.options.cross.y_line = y_line;

	        /*X轴标识线*/
	        var x_line = document.createElement("div");
	        x_line.className = "cross-x";
	        x_line.style.width = canvas.width/dpr + "px";
	        this.options.cross.x_line = x_line;

	        /*X轴和Y轴标示线相交点*/
	        var point = document.createElement("div");
	        point.className = "cross-p";
	        point.style.width = point.style.height = this.options.point_width + "px";
	        point.style.borderRadius = point.style.width;
	        point.style.backgroundColor = this.options.point_color;
	        this.options.cross.point = point;
	        /*创建文档碎片*/
	        var frag = document.createDocumentFragment();
	        
	        // if(this.options.type == "TL"){
	        if(this.options.crossline){
	        	frag.appendChild(x_line);
	        	frag.appendChild(y_line);
	        	frag.appendChild(point);
	        }else{
	        	frag.appendChild(y_line);
	        }
	     	document.getElementById(this.options.container).appendChild(frag);
	     }
	     	var y_line = this.options.cross.y_line;
		 	if(y_line){
		 		y_line.style.left = w_x + "px";
		 	}
		 	var x_line = this.options.cross.x_line;
		 	if(x_line){
		 		x_line.style.top = w_y + "px";
		 	}
		 	var point = this.options.cross.point;
		 	if(point){
		 		var p_w = this.options.point_width;
		 		point.style.left = w_x - p_w/2 + "px";
		 		point.style.top = w_y - p_w/2 + "px";
		 	}
	}

	// 绘制移动平均线标识
	Interactive.prototype.markMA = function (canvas,obj_5,obj_10,obj_20){
	    // var c_box = canvas.getBoundingClientRect();
	    // var dpr = this.options.dpr;
	    if(!this.options.mark_ma){
	        this.options.mark_ma = {};
	        var div_mark = document.createElement("div"); 
	        div_mark.className = "mark-ma";
	        div_mark.style.top = -1 + "px";
	        this.options.mark_ma.mark_ma = div_mark;
	        
	        /*创建文档碎片*/
	        var frag = document.createDocumentFragment();

	        /*5日均线*/
	        var ma_5_data = document.createElement('span');
	        ma_5_data.className = "span-m5";
	        if(obj_5){
	            ma_5_data.innerText = "MA5:" + (obj_5.value/1).toFixed(this.options.pricedigit);
	        }else{
	        	if(this.default_m5){
	        		ma_5_data.innerText = "MA5:" +  (this.default_m5.value/1).toFixed(this.options.pricedigit);
	        	}else{
	        		ma_5_data.innerText = "MA5: -";
	        	}
	        }
	        this.options.mark_ma.ma_5_data = ma_5_data;
	       
	        /*10日均线*/
	        var ma_10_data = document.createElement('span');
	        ma_10_data.id = "ma_10_data";
	        ma_10_data.className = "span-m10";
	        if(obj_10){
	            ma_10_data.innerText = "MA10:" + (obj_10.value/1).toFixed(this.options.pricedigit);
	        }else{
	        	if(this.default_m10){
					ma_10_data.innerText = "MA10:" + (this.default_m10.value/1).toFixed(this.options.pricedigit);
	        	}else{
	        		ma_10_data.innerText = "MA10: -";
	        	}
	        }
	        this.options.mark_ma.ma_10_data = ma_10_data;

	        /*20日均线*/
	        var ma_20_data = document.createElement('span');
	        ma_20_data.id = "ma_20_data";
	        ma_20_data.className = "span-m20";
	        if(obj_20){
	            ma_20_data.innerText = "MA20:" +  (obj_20.value/1).toFixed(this.options.pricedigit);
	        }else{
	        	if(this.default_m20){
	        		ma_20_data.innerText = "MA20:" + (this.default_m20.value/1).toFixed(this.options.pricedigit);
	        	}else{
	        		ma_20_data.innerText = "MA20: -";
	        	}
	        }
	        this.options.mark_ma.ma_20_data = ma_20_data;

	        frag.appendChild(ma_5_data);
	        frag.appendChild(ma_10_data);
	        frag.appendChild(ma_20_data);
	        div_mark.appendChild(frag);
	        document.getElementById(this.options.container).appendChild(div_mark);

	        if(document.body.clientWidth <= 320){
	        	ma_5_data.style.fontSize = "10px";
	        	ma_10_data.style.fontSize = "10px";
	        	ma_20_data.style.fontSize = "10px";
	        }
	        // div_tip.style.left = w_pos.x - 300 + "px";
	    }else{
	        var div_mark = this.options.mark_ma.mark_ma; 
	        if(obj_5){
	           this.options.mark_ma.ma_5_data.innerText = "MA5:" + (obj_5.value/1).toFixed(this.options.pricedigit);
	        }else{
	        	if(this.default_m5){
	        		this.options.mark_ma.ma_5_data.innerText = "MA5:" + (this.default_m5.value/1).toFixed(this.options.pricedigit);
	        	}else{
	        		this.options.mark_ma.ma_5_data.innerText = "MA5: -";
	        	}
	        }

	        if(obj_10){
	            this.options.mark_ma.ma_10_data.innerText = "MA10:" + (obj_10.value/1).toFixed(this.options.pricedigit);
	        }else{
	        	if(this.default_m10){
					this.options.mark_ma.ma_10_data.innerText = "MA10:" + (this.default_m10.value/1).toFixed(this.options.pricedigit);
	        	}else{
	        		this.options.mark_ma.ma_10_data.innerText = "MA10: -";
	        	}
	        }

	        if(obj_20){
	            this.options.mark_ma.ma_20_data.innerText = "MA20:" +  (obj_20.value/1).toFixed(this.options.pricedigit);
	        }else{
	        	if(this.default_m20){
	        		this.options.mark_ma.ma_20_data.innerText = "MA20:" + (this.default_m20.value/1).toFixed(this.options.pricedigit);;
	        	}else{
	        		this.options.mark_ma.ma_20_data.innerText = "MA20: -";
	        	}
	        }
	        
	    }
	    
	}
	// 缩放
	Interactive.prototype.scale = function(canvas){
		/*K线图表右下角相对于父容器的位置*/
	    var w_pos = common.canvasToWindow.apply(this,[canvas,canvas.width,this.options.c_1_height]);
		if(!this.options.scale){
			this.options.scale = {};
			/*创建外部包裹元素*/
			var scale_div = document.createElement("div"); 
			scale_div.className = "scale-div";
			scale_div.style.right = "20px";
			scale_div.style.top = (this.options.c_1_height+this.options.canvas_offset_top)/this.options.dpr - 40 + "px";
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
	Interactive.prototype.showTip = function(canvas,x,obj){
		// var c_box = canvas.getBoundingClientRect();
	    var type = (this.options.type).toUpperCase();
	    if(!this.options.tip){
	        this.options.tip = {};
	        // 创建外部包裹元素
	        var div_tip = document.createElement("div"); 
	        div_tip.className = "show-tip";

	        this.options.tip.tip = div_tip;
	        
	        // 创建文档碎片
	        var frag = document.createDocumentFragment();

	        // 创建收盘价格
	        var close_data = document.createElement('span');
	        close_data.className = "span-price";
	        this.options.tip.close = close_data;
	       
	        // 创建百分比
	        var percent = document.createElement('span');
	        this.options.tip.percent = percent;
	        
	        // 创建股数
	        var count = document.createElement('span');
	        this.options.tip.count = count;
	        
	        // 创建时间
	        var time = document.createElement('span');
	        this.options.tip.time = time;

	        var tip_line_1 = document.createElement("div");
	        tip_line_1.className = "tip-line-1";
	        tip_line_1.appendChild(close_data);
	        tip_line_1.appendChild(percent);

	        var tip_line_2 = document.createElement("div");
	        tip_line_2.className = "tip-line-2";
	        tip_line_2.appendChild(count);
	        tip_line_2.appendChild(time);
	        
	        frag.appendChild(tip_line_1);
	        frag.appendChild(tip_line_2);
	        div_tip.appendChild(frag);
	        document.getElementById(this.options.container).appendChild(div_tip);

	        var volume = Math.round(obj.volume);
	        if(type == "DK" || type == "WK" || type == "MK" || type == "M5K"
	         || type == "M15K" || type == "M30K" || type == "M60K"){
	            close_data.innerText = obj.close;
	            percent.innerText = obj.percent+'%';
            	count.innerText = common.translate(volume);
	            time.innerText = obj.data_time;
	            div_tip.style.top = - div_tip.clientHeight + "px";

	            var c1 = "span-k-c1";
	            var c2 = "span-k-c2";
	        }else if(type == "T1" || type == "T2" || type == "T3" || type == "T4" || type == "T5"){
	            close_data.innerText = obj.price;
	            percent.innerText = obj.percent+'%';
            	count.innerText = common.translate(volume);
	            time.innerText = obj.time;
	            div_tip.style.top = - div_tip.clientHeight + "px";
	            div_tip.className = div_tip.className + " " + "time-tip" 

	            var c1 = "span-time-c1";
	            var c2 = "span-time-c2";
	        }

	        close_data.className = close_data.className + " " + c1;
            percent.className = percent.className + " " + c2;
            count.className = count.className + " " + c1;
            time.className = time.className + " " + c2;

	    }else{
	        var tip_obj = this.options.tip;
	        var div_tip = this.options.tip.tip;
	        var volume = Math.round(obj.volume);
	       
	        if(type == "DK" || type == "WK" || type == "MK" || type == "M5K"
	         || type == "M15K" || type == "M30K" || type == "M60K"){
	            tip_obj.close.innerText = obj.close;
	            tip_obj.percent.innerText = obj.percent+'%';
	            tip_obj.count.innerText = common.translate(volume);
	            tip_obj.time.innerText = obj.data_time.replace(/-/g,"/");
	        }else if(type == "T1" || type == "T2" || type == "T3" || type == "T4" || type == "T5"){
	            tip_obj.close.innerText = obj.price;
	            tip_obj.percent.innerText = obj.percent+'%';

	            tip_obj.count.innerText = common.translate(volume);
	            tip_obj.time.innerText = obj.time;
	        }
	    }

	    if(obj && obj.up){
	        div_tip.style.backgroundColor = this.options.up_color;
	    }else if(obj && !obj.up){
	        div_tip.style.backgroundColor = this.options.down_color;
	    }

	    // if((c_box.left + div_tip.clientWidth/2) >= x){
	    if(x <= (div_tip.clientWidth/2 + this.options.padding_left/this.options.dpr)){
	        div_tip.style.left = this.options.padding_left/this.options.dpr + "px";
	    }else if(x >= (canvas.width/this.options.dpr - div_tip.clientWidth/2)){
	        div_tip.style.left = canvas.width/this.options.dpr - div_tip.clientWidth + "px";
	    }else{
	        div_tip.style.left = x - div_tip.clientWidth/2 + "px";
	    }
	}

	// 标记上榜日
	Interactive.prototype.markPoint = function(x,date,canvas,scale_count){
		if(scale_count >= 0){
			// K线图表右下角相对于父容器的位置
		    var c1_pos = common.canvasToWindow.apply(this,[canvas,canvas.width,this.options.c_1_height]);
		    // 上榜日标记的横坐标
		   	var p_pos = common.canvasToWindow.apply(this,[canvas,x,this.options.c_1_height]);

			// 创建外部包裹元素
			var markPoint = document.createElement("div"); 

			markPoint.className = "mark-point";
			var imgUrl = this.options.markPoint.imgUrl;
			// 上榜日标识宽度
			var imgWidth = this.options.markPoint.width == undefined ? 15 : this.options.markPoint.width + "px";
			// 上榜日标识高度
			var imgHeight = this.options.markPoint.height == undefined ? 15 : this.options.markPoint.height + "px";
			if(imgUrl){
				markPoint.style.background = "url(" + imgUrl + ") no-repeat center center/" + imgWidth + " " + imgHeight + " #cccccc";
				markPoint.style.background = "url(" + imgUrl + ") no-repeat center center/" + imgWidth + " " + imgHeight + " #cccccc";
			}

			if(this.options.markPoint.width && this.options.markPoint.height){
				markPoint.style.width = imgWidth;
				markPoint.style.height = imgHeight;
			}else{
				markPoint.style.width = imgWidth;
				markPoint.style.height = imgHeight;
				// markPoint.style.borderRadius = "5px";
			}
			markPoint.setAttribute("data-point",date);
			if(!this.options.pointsContainer){
				var pointsContainer = document.createElement("div");
				this.options.pointsContainer = pointsContainer;
				document.getElementById(this.options.container).appendChild(this.options.pointsContainer);
			}
			this.options.pointsContainer.appendChild(markPoint);
			// 定位上榜日标识点的位置
			markPoint.style.left = p_pos.x - markPoint.clientWidth/2 + "px";
			markPoint.style.top = c1_pos.y - 30 + "px";

		}
		
	}

	// 显示交互效果
	Interactive.prototype.show = function(){
		
		if(this.options.cross){
            var x_line = this.options.cross.x_line;
            if(x_line){
            	x_line.style.display = "block";
            }
            var y_line = this.options.cross.y_line;
            if(y_line){
            	y_line.style.display = "block";
            }
            var point = this.options.cross.point;
            if(point){
            	point.style.display = "block";
            }
        }

        if(this.options.tip){
            var tip = this.options.tip.tip;
            if(tip){
            	tip.style.display = "block";
            }
            
        }
        
	}

	// 隐藏交互效果
	Interactive.prototype.hide = function(){
		if(this.options.cross){
            var x_line = this.options.cross.x_line;
            if(x_line){
            	x_line.style.display = "none";
            }
            var y_line = this.options.cross.y_line;
            if(y_line){
            	y_line.style.display = "none";
            }
            var point = this.options.cross.point;
            if(point){
            	point.style.display = "none";
            }
        }

        if(this.options.mark_ma){
            var ma_5_data = this.options.mark_ma.ma_5_data;
            if(ma_5_data){
            	if(this.default_m5){
	        		ma_5_data.innerText = "MA5:" + (this.default_m5.value/1).toFixed(this.options.pricedigit);
	        	}else{
	        		ma_5_data.innerText = "MA5: -";
	        	}
            }
            var ma_10_data = this.options.mark_ma.ma_10_data;
            if(ma_10_data){
            	if(this.default_m10){
	        		ma_10_data.innerText = "MA10:" + (this.default_m10.value/1).toFixed(this.options.pricedigit);
	        	}else{
	        		ma_10_data.innerText = "MA10: -";
	        	}
            }
            var ma_20_data = this.options.mark_ma.ma_20_data;
            if(ma_20_data){
            	if(this.default_m20){
	        		ma_20_data.innerText = "MA20:" + (this.default_m20.value/1).toFixed(this.options.pricedigit);
	        	}else{
	        		ma_20_data.innerText = "MA20: -";
	        	}
            }

        }

        if(this.options.tip){
            var tip = this.options.tip.tip;
            if(tip){
            	tip.style.display = "none";
            }
            
        }

	}

	// 显示loading效果
	Interactive.prototype.showLoading = function(){

		if(this.options.loading){
			this.options.loading.style.display = "block";
		}else{
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
	Interactive.prototype.hideLoading = function(){
		this.options.loading.style.display = "none";
	}

	// 暂无数据
	Interactive.prototype.showNoData = function(){

		if(this.options.noData){
			this.options.noData.style.display = "block";
		}else{
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
