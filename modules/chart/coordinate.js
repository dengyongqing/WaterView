/**
 * 绘制坐标轴
 */

function pointlist(max, min, count, coordinate_max) {
	var result = [];
	var ratio = (max - min) / (count - 1);
	for (var i = 0; i < count; i++) {
		result.push({
			num:  min + i * ratio,
			x: 0,
			y: coordinate_max - (i / (count - 1)) * coordinate_max
		});
	}
	return result;
}

function coordinate(ctx, max, min, count, paddingleft, paddingtop) {
	var pointlist_array = pointlist(max, min, count, ctx.canvas.height);
	for (var i = 0; i < count; i++) {
		ctx.font = "12px Arial";
		if (i < (count - 1) / 2) {
			ctx.fillStyle = '#007F24';
		}
		else if(i > (count - 1) / 2){
			ctx.fillStyle = '#FF0A16';
		}
		else{
			ctx.fillStyle = '#333333';
		}
        //if ( i == 0 ) {
        //	ctx.fillText(pointlist_array[i].num.toFixed(3).toString(), 0, pointlist_array[i].y);
        //}
        //else{
        	ctx.fillText(pointlist_array[i].num.toFixed(3).toString(), 0, pointlist_array[i].y + 5);
        //}
		
		
		ctx.beginPath();

        ctx.moveTo(0, Math.round(pointlist_array[i].y) + 0.5);
        ctx.lineTo(ctx.canvas.width, Math.round(pointlist_array[i].y) + 0.5);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(0,0,0, 0.1)';
        ctx.stroke();
	}
}

module.exports = coordinate;