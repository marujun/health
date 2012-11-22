/**
 * Created with JetBrains WebStorm.
 * User: mrj
 * Date: 12-11-15
 * Time: 下午1:29
 * To change this template use File | Settings | File Templates.
 */

var ParticipantProvider = require('../config/participantProvider.js').participantProvider;
var participantProvider = new ParticipantProvider;
var TestProvider = require('../config/testProvider.js').testProvider;
var testProvider = new TestProvider;
var WikiProvider = require('../config/wikiProvider.js').wikiProvider;
var wikiProvider = new WikiProvider;
//var keywords={$in: [2,4,6]};
var keywords = {$regex:".*?" + "钱" + ".*"};
console.time('计时器1');
//participantProvider.find({ 'personal.name':keywords},{limit:10,skip:10},function(err,result){
//    if(err){console.log('search err:',err); }
//    console.timeEnd('计时器1');console.time('计时器2');
//    participantProvider.count({ 'personal.name':keywords},function(err,count){
//        console.log('共查询到'+count+'条记录');
//        console.timeEnd('计时器2');
//    });
//    console.log("the search result is :"+JSON.stringify(result));
//    if(result.length>0){
//        for(var i=0;i<result.length;i++){
//            console.log((i+1)+" : ",result[i].personal.name);
//        }
//    }
//});
//testProvider.find({ 'name':keywords},{limit:10,skip:10},function(err,result){
//    if(err){console.log('search err:',err); }
//    console.timeEnd('计时器1');
//    console.time('计时器2');
//    testProvider.count({},function(err,count){
//        console.log('共查询到'+count+'条记录');
//        console.timeEnd('计时器2');
//    });
//});

testProvider.count({}, function (err, count) {
    console.log('test文档中共查询到' + count + '条记录');
});

wikiProvider.count({}, function (err, count) {
    console.log('wiki文档中共查询到' + count + '条记录');
});


