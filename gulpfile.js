var gulp = require('gulp');
var gutil = require('gulp-util');
var ftp = require('gulp-ftp');
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

gulp.task('test', ['webpack'], function (){
    gulp.run('ftp');
});

gulp.task("webpack", function(callback) {
    console.info('webpack开始');
  var myConfig = Object.create(webpackConfig);
  webpack(
    myConfig
  , function(err, stats) {
    console.info('webpack结束');
    callback();
  });
});

gulp.task('ftp', function () {
    return gulp.src('./{sample,bundle}/**')
        .pipe(ftp({
            host: '172.16.58.153',
            port: 21,
            user: 'localtest',
            pass: 'localtest'
        }))
        .pipe(gutil.noop());
});