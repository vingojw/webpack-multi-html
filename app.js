
var webpack = require('webpack');
var config = require('./webpack.dev.conf');
var webpackDevServer = require('webpack-dev-server');
var compiler = webpack(config);
console.log(111);
compiler.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
  htmlPluginData.html += 'The magic footer';
  callback();
});

var compiler = webpack(config);
var server = new webpackDevServer(compiler, {
    hot: true,
    historyApiFallback: false,
    // noInfo: true,
    stats: { 
        colors: true  // 用颜色标识
    }
});
server.listen(9000);