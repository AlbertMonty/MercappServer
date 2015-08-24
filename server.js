var express = require('express')
  , http = require('http')
  , path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');

var secret = '63?gdº93!6dg36dºb36%Vv57V%c$%/(!V497';

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());


app.use(function(error,req,res,next){
  error.location ="ERROR_JSON_PARSE";
  error.code = 400;
  next(error);
});


app.use(bodyParser.urlencoded({extended: false}));
app.secret = secret;
app.Promise = require('bluebird');
app.Promise.defer =  function () {
    var resolve, reject;
    var promise = new app.Promise(function() {
        resolve = arguments[0];
        reject = arguments[1];
    });
    return {
        resolve: resolve,
        reject: reject,
        promise: promise
    };
}
var db = require('./models')(app);
app.db = db;

db.initPromise.then(function() {
  var rest = require('./rest.js')(app);

  var port = process.env.OPENSHIFT_NODEJS_PORT || app.get('port');
  var ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

  http.createServer(app).listen(port, ip, function () {
    console.log("Express server listening on " + ip + ":" + port);
  })
}).catch(function(err){
    throw err;
    //console.log("Error initializing database: " + err);
}).done();