简单的webpack多页打包

script和css文件夹里面的命名都要和html保持一致，并且只能为一层。
每个html都会注入vendors.js 和 vendors.css
common文件夹中是公共的片段

如果想在html里面引入图片，需要

```
<img src="<%= require('url-loader?limit=8192&name=imgs/[name]-[hash].[ext]!./images/index.png')%>.">
```

参考：
[https://github.com/vhtml/webpack-MultiPage-static](https://github.com/vhtml/webpack-MultiPage-static)