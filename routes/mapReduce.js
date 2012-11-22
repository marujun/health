var Code = require('mongodb').Code;

var ParticipantProvider = require('../config/participantProvider.js').participantProvider;
var participantProvider = new ParticipantProvider;
var TestProvider = require('../config/testProvider.js').testProvider;
var testProvider = new TestProvider;

// Map function
var map = function () {
    var a=this.name.substring(0,1);
        emit(a, {count:1});
};

// Reduce function
var reduce = function (key, values) {
    var x = 0;
    values.forEach(function (v) {
        x += v.count;
    });
    return {count:x};
};

console.time('计时器1');
console.log('统计中......');
testProvider.mapReduce(map, reduce, { out:{replace:'tempCollection'}, verbose:true}, function (err, collection, stats) {
    if (err) {
        console.log('---------errors: -----------\n', err);
    }else {
        console.log('---------stats: -----------\n', stats);
        console.timeEnd('计时器1');
        collection.find().toArray(function (err, results) {
            console.log('---------results:   '+results.length+' -----------\n');
            results.forEach(function(value){
                console.log(value);
            })
        });
    }
});
