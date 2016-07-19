/*绘制分时图*/
var ChartTime = require('chart/mobile/chart_time');
/*绘制K线图*/
var ChartK = require('chart/mobile/chart_k');
/*绘制折线图*/
var ChartLine = require('chart/mobile/chart_line');
/*绘制季度柱状图*/
var ChartLine = require('chart/web/bar-quarter');
/*加载样式文件*/
require('css/style.css');

window.EmchartsMobileTime = ChartTime;
window.EmchartsMobileK = ChartK;
window.EmchartsMobileLine = ChartLine;
window.EmchartsWebBarQuarter = ChartBarQuarter
