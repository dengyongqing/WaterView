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

/*绘制web利率折线图*/
var EmchartsWebLineRate = require('chart/web/line-rate');
/*绘制web季度柱状图*/
var EmchartsWebBarQuarter = require('chart/web/bar-quarter');
/*绘制web季度折线图*/
var EmchartsWebLineQuarter = require('chart/web/line-quarter');
/*绘制web折线图*/
var EmchartsWebLine = require('chart/web/line');
/*绘制web分时图*/
var EmchartsWebTime = require('chart/web/time');
/*绘制web的K线图*/
var EmchartsWebK = require('chart/web/k');
/*绘制web柱状图*/
var ChartWebBar = require('chart/web/bar/bar');
/*绘制web分组柱状图*/
var ChartWebGroupBar = require('chart/web/bar/group-bar');

/*加载样式文件*/
require('css/style.css');

// 手机分时图
window.EmchartsMobileTime = EmchartsMobileTime;
// 手机K线图
window.EmchartsMobileK = EmchartsMobileK;
// 手机折线图
window.EmchartsMobiLine = EmchartsMobiLine;
// 手机柱状图
window.ChartMobiBar = ChartMobiBar;
// 手机分组柱状图
window.ChartMobiGroupBar = ChartMobiGroupBar;

// web季度柱状图
window.EmchartsWebBarQuarter = EmchartsWebBarQuarter;
// web季度折线图
window.EmchartsWebLineQuarter = EmchartsWebLineQuarter;
// web利率折线图
window.EmchartsWebLineRate = EmchartsWebLineRate;
// web折线图
window.EmchartsWebLine = EmchartsWebLine;
// web行情分时图
window.EmchartsWebTime = EmchartsWebTime;
// web行情K线图
window.EmchartsWebK = EmchartsWebK;
// web柱状图
window.ChartWebBar = ChartWebBar;
// web分组柱状图
window.ChartWebGroupBar = ChartWebGroupBar;
