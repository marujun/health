var Code = require('mongodb').Code;

var ParticipantProvider = require('../config/participantProvider.js').participantProvider;
var participantProvider = new ParticipantProvider;
var TestProvider = require('../config/testProvider.js').testProvider;
var testProvider = new TestProvider;

// Map function
var map = function () {
    var a=this.name.substring(0,1);
    emit(a, {count:1}); //map时姓相同的为一组传给reduce，传的值中key为name中的姓
};

// Reduce function
var reduce = function (key, values) {
    var x = 0;
    values.forEach(function (v) {
        x += v.count;
    });
    return {count:x};
};

//finalize function
function finalize(key,rval){
    return comment(rval);
}
//scope
function comment(input){
    if(input.count>100){
        input.comment="该姓人数较多！"
    }
    return input;
}
console.time('计时器1');
console.log('统计中......');
testProvider.mapReduce(map, reduce, { out:{replace:'tempCollection'},scope:{comment:new Code(comment.toString())},finalize:finalize, verbose:true}, function (err, collection, stats) {
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
