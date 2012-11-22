/**
 * Created with JetBrains WebStorm.
 * User: mrj
 * Date: 12-11-21
 * Time: 上午10:33
 * To change this template use File | Settings | File Templates.
 */

//ubuntu 安装libxmljs 的时候得先安装sudo apt-get install libxml2-dev

var libxmljs = require("libxmljs");
var xml =  '<?xml version="1.0" encoding="UTF-8"?>' +
    '<roots>' +
    '<child foo="bar">' +
    '<grandchild baz="fizbuzz">grandchild content</grandchild>' +
    '</child>' +
    '<sibling>with content!</sibling>' +
    '</roots>';

var xmlDoc = libxmljs.parseXml(xml);

// xpath queries
var gchild = xmlDoc.get('//grandchild');

console.log(gchild.text());  // prints "grandchild content"

var children = xmlDoc.root().childNodes();
var child = children[0];

console.log(child.attr('foo').value()); // prints "bar"