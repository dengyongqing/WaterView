/*绘制手机分时图*/
var ChartTime = require('chart/mobile/chart_time');
/*绘制手机K线图*/
var ChartK = require('chart/mobile/chart_k');
/*绘制手机折线图*/
var ChartLine = require('chart/mobile/chart_line');
/*绘制利率折线图*/
var ChartLineRate = require('chart/web/line-rate');
/*绘制季度柱状图*/
var ChartBarQuarter = require('chart/web/bar-quarter');
/*绘制季度折线图*/
var ChartLineQuarter = require('chart/web/line-quarter');
/*绘制web折线图*/
var ChartLine = require('chart/web/line');
/*绘制web分时图*/
var ChartWebTime = require('chart/web/time');
/*绘制web的K线图*/
var ChartWebK = require('chart/web/k');

/*加载样式文件*/
require('css/style.css');

window.EmchartsMobileTime = ChartTime;
window.EmchartsMobileK = ChartK;
window.EmchartsWebBarQuarter = ChartBarQuarter;
window.EmchartsWebLineQuarter = ChartLineQuarter;
window.EmchartsWebLineRate = ChartLineRate;
window.EmchartsWebLine = ChartLine;
window.EmchartsWebTime = ChartWebTime;
window.EmchartsWebK = ChartWebK;
