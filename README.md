简单的webpack多页打包

script和css文件夹里面的命名都要和html保持一致，并且只能为一层。
每个html都会注入vendors.js 和 vendors.css
貌似还不能在html里面直接`<img src="../images/a.png"/>` 这样压缩后会报错。
参考：
[https://github.com/vhtml/webpack-MultiPage-static](https://github.com/vhtml/webpack-MultiPage-static)