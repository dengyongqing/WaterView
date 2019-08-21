function XYF(num){
	if(isNaN(num)){
		return num;
	}else{
		var result = Math.floor(num);
		return result + 0.5;
	}
}

module.exports = XYF;