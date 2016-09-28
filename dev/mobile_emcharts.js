/*绘制分时图*/
var ChartTime = require('chart/mobile/chart_time');
/*绘制K线图*/
var ChartK = require('chart/mobile/chart_k');
/*绘制折线图*/
var ChartLine = require('chart/mobile/chart_line');
/*绘制mobi柱状图*/
var ChartMobiBar = require('chart/mobile/bar/bar');
/*绘制mobi分组柱状图*/
var ChartMobiGroupBar = require('chart/mobile/bar/group-bar');

/*加载样式文件*/
require('css/style.css');

window.EmchartsMobileTime = ChartTime;
window.EmchartsMobileK = ChartK;
window.EmchartsMobileLine = ChartLine;
window.ChartMobiBar = ChartMobiBar;
window.ChartMobiGroupBar = ChartMobiGroupBar;


