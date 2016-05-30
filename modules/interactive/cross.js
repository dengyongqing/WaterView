/*鼠标十字标识线*/
function Cross(canvas,w_x,w_y){
    var c_box = canvas.getBoundingClientRect();
    var dpr = this.options.dpr;

    if(!this.options.cross){
        this.options.cross = {};
        /*Y轴标识线*/
        var y_line = document.createElement("div");
        y_line.className = "cross-y";
        y_line.style.height = c_box.height + "px";
        y_line.style.top = c_box.top + "px";
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
        frag.appendChild(y_line);
        if(this.options.type == "TL"){
            frag.appendChild(x_line);
            frag.appendChild(point);
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

module.exports = Cross;