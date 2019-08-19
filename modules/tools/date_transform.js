/**
 * 日期处理
 * 20121112 ---> 2012-11-12
 */

//转换日期（20121112 -> 2012-11-12）
function transform(str){
    return str.replace(/(\d{4})(\d{2})(\d{2})/g, function(whole,a, b, c){
        return a+"-"+b+"-"+c;
    });
}

module.exports = transform;