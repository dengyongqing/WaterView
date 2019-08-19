/**
 * 进行整数处理，2 --> 02
 */

function fixed(str, len){
	debugger;
	var i = 0;
	str = str.toString();
	var result = str;
	for(i = 0; i < len-str.length; i++){
		result = '0'+result;
	}

	return result;
}

module.exports = fixed;