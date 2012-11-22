var ParticipantProvider = require('../config/participantProvider.js').participantProvider;
var participantProvider = new ParticipantProvider;
var fs=require('fs');

exports.index = function (req, res) {
    res.render('insert', { title:'Express' });
};
exports.ui = function (req, res) {
    res.render('ui', { title:'Express' });
};

exports.list = function (req, res) {
    console.log('------------list--------------');
    var skip = 0, limit = 10, count = 10;
    participantProvider.count({}, function (err, result) {
        if (err) {
            console.log('find error!', err);
        }
        if (result) {
            count = result;
            console.log('the collection has ' + count + ' data');
        }
        participantProvider.find({}, {skip:skip, limit:limit}, function (err, result) {
            if (err) {console.log('find error!', err);}
            var pages = Math.ceil(count / limit);
            res.render('list', { status:'success', users:result, pages:pages})
        });
    });
};
exports.userPage = function (req, res) {
    var data = req.body;
    var skip = (parseInt(data.page) - 1) * parseInt(data.limit);
    console.log('skip: ' + skip + '  data:  ', data);
    var findText = {};
    if (data.title == 'search') {
        findText = { 'personal.name':{$regex:".*?" + data.words + ".*"}};
    }
    participantProvider.find(findText, {skip:skip, limit:data.limit}, function (err, result) {
        if (err) {console.log('find error!', err.message);}
        console.log('find success' + JSON.stringify(result));
        res.send({ status:'success', users:result, err:err})
    });
};
exports.search = function (req, res) {
    var data = req.body;
    var skip = (parseInt(data.page) - 1) * parseInt(data.limit);
    var keywords = { 'personal.name':{$regex:".*?" + data.words + ".*"}};
    console.log('keywords: ', keywords);
    console.time('计时器1');
    participantProvider.find(keywords, {skip:skip, limit:data.limit}, function (err, result) {
        if (err) {
            console.log('search err:', err);
        }
        participantProvider.count(keywords, function (err, count) {
            console.timeEnd('计时器1');
            res.send({ status:'success', users:result, err:err, pages:Math.ceil(count / data.limit)});
            console.log('共查询到' + count + '条记录');
        });
    });
};

exports.createUser = function (req, res) {
    var user = req.body.user;
    var message = {activity:{campaign:user.campaign, product_no:user.product_no, serial_no:user.serial_no, upline_no:user.upline_no, upline_name:user.upline_name},
        personal:{name:user.name, birthday:user.birthday, user_id:user.user_id, gender:user.gender, height:user.height, mobile:user.mobile, email:user.email, city_id:user.city_id, address:user.address, note:user.note}};
    console.log('insert user message', JSON.stringify(message));
    participantProvider.insert(message, {}, function (err, result) {
        if (err) {
            console.log('insert error!', err.message);
        }
        else {
            console.log('insert success');
        }
        res.redirect("/admin/user/list");
    });
};


exports.upload=function(req,res){
//    console.log(req.headers);
    var tmp_path = req.files.uploadFile.path; // 获得文件的临时路径
    var target_path = './public/upload/' +req.files.uploadFile.name;// 指定文件上传后的目录
    fs.rename(tmp_path, target_path, function(err) { // 移动文件
        if (err) throw err;
        fs.unlink(tmp_path, function() {// 删除临时文件夹文件,
            if (err) throw err;
            res.end();
        });
    });
};