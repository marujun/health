/**
 * Created with JetBrains WebStorm.
 * User: mrj
 * Date: 12-11-16
 * Time: 下午6:46
 * To change this template use File | Settings | File Templates.
 */
var ParticipantProvider=require('../config/participantProvider.js').participantProvider;
var participantProvider=new ParticipantProvider;
var TestProvider=require('../config/testProvider.js').testProvider;
var testProvider=new TestProvider;
var task=require('./task.js');
var ObjectID=require('mongodb').ObjectID;
var random=function(input){return require('./random.js').random(input)};

//task.startTasks([], {}, insertUser, 0, 200003, function(){
//     participantProvider.count({}, function (err, count) {console.log('数据库一共有'+count+'条记录');});
//});
function insertUser(param, otherData, current, callback){
//    var user={campaign:new ObjectID(),product_no:new ObjectID(),serial_no:new ObjectID(),upline_no:new ObjectID(),upline_name:new ObjectID(),name:new ObjectID(),birthday:new ObjectID(),user_id:new ObjectID(),gender:new ObjectID(),height:new ObjectID(),mobile:new ObjectID(),email:new ObjectID(),city_id:new ObjectID(),address:new ObjectID(),note:new ObjectID()};
    var user={  "campaign" : "健康大使", "product_no" : "1", "serial_no" : "1001", "upline_no" : "01", "upline_name" : "fred" , "name" : "abc_"+current, "birthday" : "1990-02-13", "user_id" : "3209391884736264632", "gender" : "男", "height" : "50", "mobile" : "18398765423", "email" : "witmob@qq.com", "city_id" : "台北市", "address" : "安立路d2-1001", "note" : "賀寶芙健康大使"  };
    var message={activity:{campaign:user.campaign,product_no:user.product_no,serial_no:user.serial_no,upline_no:user.upline_no,upline_name:user.upline_name},
        personal:{name:user.name,birthday:user.birthday,user_id:user.user_id,gender:user.gender,height:user.height,mobile:user.mobile,email:user.email,city_id:user.city_id,address:user.address,note:user.note}};
    console.log('insert user message',JSON.stringify(message));
    participantProvider.insert(message,{},function(err,result){
        if(err){console.log('insert err:',err);}
        if(result){console.log('insert success'+current);}
        setTimeout(function(){callback();},0.01)
    });
}

console.time('计时器1');
task.startTasks([], {}, addTestUser, 0, 10000000, function(){
    console.timeEnd('计时器1');
    testProvider.count({}, function (err, count) {console.log('数据库一共有'+count+'条记录');});
});

function addTestUser(param, otherData, current, callback){
//    var user={name:random('name')};
    var user={name:random('name'),age:random('age'),gender:random('gender'),birthday:random('date'),mobile:random('phone'),note:random(3000)};
//    console.log('user: ',JSON.stringify(user));
    testProvider.insert(user,{},function(err,result){
        if(err){console.log('insert err:',err);}
        if(result){console.log('insert success'+current);}
        setTimeout(function(){callback();},0.01);
    });
}

//for(var i=0;i<3000;i++){
//    var tmp=[];
//    for(var j=0;j<1000;j++){
//        var user={name:random('name')};
//        tmp.push(user);
//    }
//    testProvider.insert(tmp,{},function(err,result){
//        if(err){console.log('insert err:',err);}
//        if(result){console.log('insert success: '+i);}
//    });
//    if(i==9999){testProvider.count({}, function (err, count) {console.log('数据库一共有'+count+'条记录');});}
//}
function addForTestUser(current){
//    var user={name:random('name')};
    var user={name:random('name'),age:random('age'),gender:random('gender'),birthday:random('date'),mobile:random('phone'),note:random(3000)};
    console.log('user: ',user);
    testProvider.insert(user,{},function(err,result){
        if(err){console.log('insert err:',err);}
        if(result){console.log('insert success'+current);}
    });
}