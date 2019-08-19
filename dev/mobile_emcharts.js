/*绘制手机分时图*/
var EmchartsMobileTime = require('chart/mobile/chart_time');
/*绘制手机K线图*/
var EmchartsMobileK = require('chart/mobile/chart_k');
/*绘制手机折线图*/
var EmchartsMobiLine = require('chart/mobile/chart_line');
/*绘制手机柱状图*/
var ChartMobiBar = require('chart/mobile/bar/bar');
/*绘制手机分组柱状图*/
var ChartMobiGroupBar = require('chart/mobile/bar/group-bar');
/*绘制web折线图*/
var EmchartsWebLine = require('chart/web/line');

/*加载样式文件*/
require('css/style.css');

// 手机分时图
window.EmchartsMobileTime = EmchartsMobileTime;
// 手机K线图
window.EmchartsMobileK = EmchartsMobileK;
// 手机折线图
// window.EmchartsMobiLine = EmchartsMobiLine;
window.EmchartsMobiLine = EmchartsWebLine;
// 手机柱状图
window.ChartMobiBar = ChartMobiBar;
// 手机分组柱状图
window.ChartMobiGroupBar = ChartMobiGroupBar;


