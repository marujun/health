/**
 * Created with JetBrains WebStorm.
 * participant: mrj
 * Date: 12-11-15
 * Time: 上午10:01
 * To change this template use File | Settings | File Templates.
 */
var DataProvider = require('./DataProvider.js').DataProvider,
    util = require('util');

var participantProvider = function() {
    console.log("new  participantProvider");
    this.collectionName = "participant";
};

util.inherits(participantProvider, DataProvider);

exports.participantProvider = participantProvider;