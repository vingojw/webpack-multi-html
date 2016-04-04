简单的webpack多页打包

script和css文件夹里面的命名都要和html保持一致，并且只能为一层。
每个html都会注入vendors.js 和 vendors.css
common文件夹中是公共的片段，片段里面貌似不可引用图片

如果想在html里面引入图片，需要
```
<img src="require('./images/index.png')">
```

参考：
[https://github.com/vhtml/webpack-MultiPage-static](https://github.com/vhtml/webpack-MultiPage-static)