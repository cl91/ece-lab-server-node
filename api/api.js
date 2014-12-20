var express = require('express');
var router = express.Router();

var handler = function(req, res) {
    var api_list = ['admin', 'course', 'student', 'mark', 'auth']
    var api = req.params.api

    if (api_list.indexOf(api) == -1) {
	res.status(400).send('Invalid api request ' + api)
	return
    }

    var obj = require('./' + api)
    if (obj == null) {
	res.status(500).send('No handler for api ' + api)
	return
    }

    var is_function = function(obj) {
	return !!(obj && obj.constructor && obj.call && obj.apply);
    }

    var handler = function(req, res) {
	var ops = req.params.ops
	if (is_function(obj[ops])) {
	    obj[ops](req, res)
	} else if (is_function(obj['handler'])) {
	    obj['handler'](req, res)
	} else {
	    res.status(400).end('Invalid request ' + req.path)
	}
    }
    
    if (obj.auth) {
	obj.auth(req, res, function(req, res) {
	    res.status(403).end('Authentication failed for api ' + api)
	}, handler)
    } else {
	handler(req, res)
    }
}

router.post(['/api/:api/:ops?', '/api/:api/:param/:ops'], handler)

module.exports = router
