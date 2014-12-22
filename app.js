var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./api/auth').middleware);
app.use(require('./api/api'));

app.use(require('./redirect'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not found')
    err.status = 404
    next(err)
})

// display errors
app.use(function(err, req, res, next) {
    res.status(err.status)
    res.send('<!DOCTYPE html><html><body>'
	     + err.message + '</body></html>')
})

module.exports = app
