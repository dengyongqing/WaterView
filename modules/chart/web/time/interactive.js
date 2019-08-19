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

    // 鼠标十字标识线(webTime)
    Interactive.prototype.crossTime = function(canvas, w_x, w_y) {
        var offsetTop = this.options.canvas_offset_top;
        var canvasHeight = this.options.canvas.height;
        var containerId = this.options.container;
        var padding_left = this.options.padding.left;
        var padding_right = this.options.padding.right;

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
            x_line.style.width = canvas.width - padding_left - padding_right + "px";
            x_line.style.left = padding_left + "px";
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
            frag.appendChild(y_line);
            frag.appendChild(x_line);
            frag.appendChild(point);
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
        var point = this.options.cross.point;
        if (point) {
            var p_w = this.options.point_width;
            point.style.left = w_x - p_w / 2 + "px";
            point.style.top = w_y - p_w / 2 + "px";
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
        var code = this.options.code;
        var map = ['周日','周一', '周二', '周三', '周四','周五', '周六' ];
        var itemData;
        if(index < 0){
            itemData = time_data[0];
        }else if(index > time_data.length-1){
            itemData = time_data[time_data.length-1];
        }else{
            itemData = time_data[index];
        }
        this.options.lastItemData = time_data[time_data.length-1];
        // 成交额
        var volumeCount, volumeNum;
        if(code.charAt(code.length-1) != 7 && code.charAt(code.length-1) != 5){
            volumeNum = changeUnit(itemData.volume, "手");
            volumeCount = changeUnit(itemData.volume*itemData.price*100, "元");
        }else{
            volumeNum = changeUnit(itemData.volume, "股");
            volumeCount = changeUnit(itemData.volume*itemData.price, "元");
        }

        var topText = itemData.dateTime.substring(5)+" "+ itemData.time + " "+
                                map[(new Date(itemData.dateTime)).getDay()]+" 最新价:"+itemData.price+
                                " 成交量:"+ volumeNum+/*" 成交额:"+ 
                                volumeCount +*/ " 均价:"+ itemData.avg_cost;

        if(!this.options.webTimeTips){
            this.options.time_data = time_data;
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
            y_left.style.display = "block";
            y_left.innerHTML = itemData.price;
            y_left.style.left = padding_left - y_left.clientWidth + 'px';
            y_left.style.top = cross_w_y + "px";
            y_left.style.display = "none";
            y_right.style.top = cross_w_y + "px";
            y_right.innerHTML = (itemData.up ? "+" : "-") + itemData.percent+"%";
            
            //跟随鼠标变化需要更改的横坐标上的的提示*/
            x_bottom.style.display = "block";
            x_bottom.innerHTML = itemData.time;
            x_bottom.style.left = cross_w_x  + "px";
            x_bottom.style.top = c_1_height + offsetTop - x_bottom.clientHeight + "px";
            x_bottom.style.display = "none";
            x_top.innerHTML = topText;
            x_top.style.display = 'block';
        }else{
            var y_left = this.options.webTimeTips.time_y_left;
            var y_right = this.options.webTimeTips.time_y_right;
            var x_bottom = this.options.webTimeTips.time_x_bottom;
            var x_top = this.options.webTimeTips.time_x_top;
            //跟随鼠标变化需要更改的纵坐标上的的提示*/
            y_left.style.top = cross_w_y + "px";
            y_left.innerHTML = itemData.price;
            y_left.style.left = padding_left - y_left.clientWidth + 'px';
            y_left.style.display = 'block';
            y_right.style.top = cross_w_y + "px";
            y_right.style.display = 'block';
            if(itemData.percent === "0.00"){
                y_right.innerHTML =  itemData.percent+"%";
            }else{
                y_right.innerHTML = (itemData.up ? "+" : "-") + itemData.percent+"%";
            }
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
            // debugger;
            var code = this.options.code;
            var itemData = this.options.lastItemData;
            var map = ['周日','周一', '周二', '周三', '周四','周五', '周六' ];
            var time_x_top = this.options.webTimeTips.time_x_top;
            var volumeCount, volumeNum;
            if (code.charAt(code.length - 1) != 7 && code.charAt(code.length - 1) != 5) {
                volumeNum = changeUnit(itemData.volume, "手");
                volumeCount = changeUnit(itemData.volume * itemData.price * 100, "元");
            } else {
                volumeNum = changeUnit(itemData.volume, "股");
                volumeCount = changeUnit(itemData.volume * itemData.price, "元");
            }

            var topText = itemData.dateTime.substring(5) + " " + itemData.time + " " +
                map[(new Date(itemData.dateTime)).getDay()] + " 最新价:" + itemData.price +
                " 成交量:" + volumeNum + /*" 成交额:" +
                volumeCount +*/ " 均价:" + itemData.avg_cost;
            }
            time_x_top.innerHTML = topText;

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
