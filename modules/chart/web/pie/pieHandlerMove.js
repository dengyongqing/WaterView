/**
 * 添加交互效果
 * @param  {[type]} pie [description]
 * @param  {[type]} x   [description]
 * @param  {[type]} y   [description]
 * @return {[type]}     [description]
 */
module.exports = function(pie, x, y, inPie) {
    var container = this.container;
    if (!this.options.tips) { //构造出要显示的
        var tips = document.createElement("div");
        tips.className = 'chart_line_tips';
        tips.style.fontSize = "12px";
        tips.style.display = "none";
        var disc = document.createElement("span");
        disc.className = "chart_line_tips_color";
        disc.style.backgroundColor = pie.color;
        var name = document.createElement("span");
        name.innerHTML = pie.name;
        var value = document.createElement("div");
        value.innerHTML = pie.tip;

        tips.appendChild(disc);
        tips.appendChild(name);
        tips.appendChild(value);
        container.appendChild(tips);
        tips.style.top = y + "px";
        tips.style.left = x + "px";
        this.options.tips = tips;
    } else {
        var tips = this.options.tips;
        if (!inPie) {
            tips.style.display = "none";
        } else {
            tips.style.display = "block";
        }
        
        tips.children[0].style.backgroundColor = pie.color;
        tips.children[1].innerHTML = pie.name;
        tips.children[2].innerHTML = pie.tip;

        if (Math.cos(pie.middle) >= 0) {
            tips.style.top = y - tips.clientHeight - 10 + "px";
            tips.style.left = x + 10 + "px";
        } else {
        	tips.style.top = y - tips.clientHeight - 10  + "px";
            tips.style.left = x - tips.clientWidth - 10 + "px";
        }
    }


}
