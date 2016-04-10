var fs = require('fs');
var reg = /\/\*([\s\S]+?)\*\//g;

var dirList = fs.readdirSync(__dirname+'/../');
var docCfg = [];

dirList.forEach(function(fileName){
	if(fileName.slice(-3)=='.js'){
		createDoc(fileName);
		docCfg.push(fileName)
	}
});

//生成配置
fs.writeFile(__dirname+'/config.js', 'config='+JSON.stringify(docCfg), function (err) {
  if (err) throw err;
  console.log('config.js saved!'); //文件被保存
});

//生成文档
function createDoc(fileName){
	var s,sr=[] ;
	fs.readFile(__dirname+'/../'+fileName, function (err, data) {
	  if (err) throw err;
	  while(s=reg.exec(data)){
	  	var ss = s[1].split(/\r?\n/)[0];
	  	sr.push({title:ss.trim(),content:s[1]});
	  };
	  fs.writeFile(__dirname+'/'+fileName, fileName.slice(0,-3)+'='+JSON.stringify(sr), function (err) {
	    if (err) throw err;
	    console.log(fileName + ' saved!'); //文件被保存
	  });
	});
}