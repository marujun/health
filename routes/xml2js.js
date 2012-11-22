/**
 * Created with JetBrains WebStorm.
 * User: mrj
 * Date: 12-11-21
 * Time: 下午6:59
 * To change this template use File | Settings | File Templates.
 */
var fs = require("fs");
var xml2js = require('xml2js');

var parser = new xml2js.Parser({explicitArray:false});


fs.readFile("../public/test.xml",  function(err, data) {
    parser.parseString(data, function (err, result) {
        if(err){console.log('convert error :  ',err)}else{console.log("convert success!")}
        console.log(JSON.stringify(result));
    });
});