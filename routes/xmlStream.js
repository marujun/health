//ubuntu 安装 xml-stream 的时候需要先安装  sudo apt-get install libexpat1-dev

var WikiProvider=require('../config/wikiProvider.js').wikiProvider;
var wikiProvider=new WikiProvider;
var XmlStream = require('xml-stream');
var fs = require("fs");
var path = require('path');

var index=0;
var stream = fs.createReadStream(path.join('/Users/mrj/Downloads/enwiki-latest-pages-articles5.xml'));
var xml = new XmlStream(stream);

//xml.preserve('item', true);
xml.on('startElement: page', function(item) {});

xml.on('endElement: page', function(item) {
    var page=JSON.stringify(item).replace("$","@");
    wikiProvider.insert(page,{},function(err,result){
        if(err){console.log('insert err:',err);console.log(item)}
        if(result){index+=1;console.log('insert success  '+index);}
    });
});