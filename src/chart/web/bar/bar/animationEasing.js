/*缓动函数*/
var animation = {
    fast2slow: function(obj, x2, y2) {
        var x1 = parseInt(obj.style.left);
        var y1 = parseInt(obj.style.top);
        var stepY = (y2 - y1) / 5;
        var stepX = (x2 - x1) / 5;
        if(stepX === 0 && stepY === 0){
            clearTimeout(obj.timer);
            return;
        }else if(stepX === 0){
            stepY = (Math.abs(stepY) <= 1) ? stepY * 1 / Math.abs(stepY) : stepY;
        }else if(stepY === 0){
            stepX = (Math.abs(stepX) <= 1) ? stepX * 1 / Math.abs(stepX) : stepX;
        }else{
            stepY = (Math.abs(stepY) <= 1) ? stepY * 1 / Math.abs(stepY) : stepY;
            stepX = (Math.abs(stepX) <= 1) ? stepX * 1 / Math.abs(stepX) : stepX;
        }
        if (Math.abs(x2 - (x1 + stepX)) <= 1 && Math.abs(y2 - (y1 + stepY)) <= 1) {
            clearTimeout(obj.timer);
            return;
        }

        if (Math.abs(x2 - x1) <= 1) {
            stepX = 0;
        }
        if (Math.abs(y2 - y1) <= 1) {
            stepY = 0;
        }

        obj.style.left = x1 + stepX + "px";
        obj.style.top = y1 + stepY + "px";
        var _this = this;
        // debugger;
        obj.timer = setTimeout(function() {
            _this.fast2slow(obj, x2, y2);
        }, 10);
    }

};

module.exports = animation;
