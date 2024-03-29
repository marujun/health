
/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , fs = require("fs");
var app = express();
app.use(express.limit('800mb'));
app.engine('html', require('ejs').renderFile);

app.configure(function(){
    app.set('port', process.env.PORT || 3001);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/ui', routes.ui);
app.post('/upload',routes.upload);
app.post('/admin/user/create', routes.createUser);
app.post('/search', routes.search);
app.get('/admin/user/list', routes.list);
app.post('/admin/user/getUserByPage', routes.userPage);


http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});