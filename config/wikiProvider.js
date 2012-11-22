/**
 * Created with JetBrains WebStorm.
 * User: mrj
 * Date: 12-11-21
 * Time: 下午7:03
 * To change this template use File | Settings | File Templates.
 */
var DataProvider = require('./DataProvider.js').DataProvider,
    util = require('util');

var wikiProvider = function() {
    console.log("new  wikiProvider");
    this.collectionName = "wiki";
};

util.inherits(wikiProvider, DataProvider);

exports.wikiProvider = wikiProvider;