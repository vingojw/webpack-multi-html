var path = require('path');
//var glob = require('glob');//https://github.com/isaacs/node-glob  获取文件列表
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');//提取单独的css
var HtmlWebpackPlugin = require('html-webpack-plugin');//webpack中生成HTML的插件
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

var production = process.env.PRODUCTION == 'production';

// package.json 里面的   "wb": "set PRODUCTION=production&& webpack --progress --hide-modules"
//                                                      ^注意不能有空格
//            如果写成了 "wb": "set PRODUCTION=production && webpack --progress --hide-modules"
//                                                       ^那么获取到的process.env.PRODUCTION 为 "production ",后面会带空格
// console.log(process.env.PRODUCTION.length);
// console.log('production'.length);


//获取entry
var getCfgEntry = function(){
    var entryO = {};
    foreachFolder('./src/scripts/',function(list){
        for(var i = 0,item; item = list[i++];){
            entryO[item[0].slice(0,-3)] = item[2];
        }
    });
    return entryO;
    /*entryO 看起来就是这样
        {
            a: './src/scripts/a.js',
            b: './src/scripts/b.js',
            index: './src/scripts/index.js'
        }
    */
}();
var chunks = Object.keys(getCfgEntry);
var config = {
  entry: getCfgEntry,
  output: {
    path: './build',
    publicPath: './',
    filename: 'script/[name].js', // 最后的链接就是  publicPath + filename的结果  比如 ""./script/vendors.js?8ea677fd05e1a89a1235""
    chunkFilename: 'script/[id].chunk.js' // 最后的链接就是  publicPath + chunkFilename的结果
  },
  module: {
    loaders: [ //加载器
        {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style', 'css')
        }, {
            test: /\.html$/,
            loader: "html"
        }, {
            test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader?name=fonts/[name].[ext]'
        }, {
            test: /\.(png|jpe?g|gif)$/,
            loader: 'url-loader?limit=4096&name=imgs/[name]-[hash].[ext]'
        }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({ //载入jq,这样就不用每个里面都require了，直接使用  $
        $: 'jquery'
    }),
    new CommonsChunkPlugin({
        name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
        chunks: chunks, //chunks 看起来就是这样 ["a", "b", "index"],
        minChunks: chunks.length // 提取所有entry共同依赖的模块 ， 这里 chunks.length的意思是 比如每个页面里面都使用了$的时候 jQuery才会被打包到 vendos.js里面。
    }),
    new ExtractTextPlugin('styles/[name].css'),//单独使用link标签加载css并设置路径，相对于output配置中的publickPath
    new webpack.HotModuleReplacementPlugin(), //热加载
  ],
  devServer: {
    contentBase:'./build',
    publicPath:'http://localhost:8080/',
    proxy: {
        "*": "http://localhost:54999"  //开发的时候接口转发
    },
    inline: true,
    hot: true
  }
}


//是否压缩代码
if(production){

    config.plugins.push(new UglifyJsPlugin({ //压缩代码
        compress: {
            warnings: false
        },
        mangle: {
            except: ['$super', '$', 'exports', 'require'] //排除关键字
        }
    }));
    //config.plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false } }));
}


//为每个页面配置html
foreachFolder('./src/',function(list){
    for(var i = 0,item; item = list[i++];){
        if(item[0].slice(-5)=='.html'){
            var name = item[0].slice(0,-5);
            config.plugins.push(new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
                favicon: './src/images/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
                filename: './' + name + '.html', //生成的html存放路径，相对于path
                template: './src/' + name + '.html', //html模板路径
                inject: true, //js插入的位置，true/'head'/'body'/false
                hash: true, //为静态资源生成hash值
                chunks: ['vendors', name],//需要引入的chunk，不配置就会引入所有页面的资源
                minify: { //压缩HTML文件
                    removeComments: true, //移除HTML中的注释
                    collapseWhitespace: false, //删除空白符与换行符
                    ignoreCustomFragments:[
                        /\{\{[\s\S]*?\}\}/g  //不处理 {{}} 里面的 内容
                    ]
                }
            }));
        }
    }
});


module.exports = config;

//循环文件夹内的文件
function foreachFolder(path, cb){
    var folder_exists = fs.existsSync(path);
    var fileList = [];
    if(folder_exists == true)
    {
       var dirList = fs.readdirSync(path);
       dirList.forEach(function(fileName){
            fileList.push([fileName, path , path+fileName]);
       });
    };
    /*
        最后fileList 看起来就是这样
        [ [ 'a.js', './src/scripts/', './src/scripts/a.js' ],
          [ 'b.js', './src/scripts/', './src/scripts/b.js' ],
          [ 'index.js', './src/scripts/', './src/scripts/index.js' ] ]
     */
    return cb(fileList);
}