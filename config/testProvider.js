/**
 * Created with JetBrains WebStorm.
 * User: mrj
 * Date: 12-11-20
 * Time: 上午11:34
 * To change this template use File | Settings | File Templates.
 */
var DataProvider = require('./DataProvider.js').DataProvider,
    util = require('util');

var testProvider = function() {
    console.log("new  testProvider");
    this.collectionName = "tests";
};

util.inherits(testProvider, DataProvider);

exports.testProvider = testProvider;