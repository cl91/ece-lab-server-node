var db = require('redis').createClient();

exports.handler = function(req, res){
    var name = req.query.name
    var pass = req.query.pass
    if (!name || !pass) {
	res.status(400).send('Name and password required')
	return
    }

    db.sismember('users', name, function(err, reply) {
	if (err) {
	    res.status(500).send('Db access error: ' + err)
	    return
	}
	if (reply == 0) {
	    res.status(401).send('Invalid user name: ' + name)
	    return
	}
	db.hget('user:'+name, 'pass', function(err, reply) {
	    if (err) {
		res.status(500).send('Db access error: ' + err)
		return
	    }
	    if (reply != pass) {
		res.status(401).send('Invalid password: ' + name)
		return
	    }
	    var randomstring = require("randomstring").generate()
	    db.hset('user:'+name, 'auth', randomstring)
	    db.hset('auth', randomstring, name)
	    res.cookie('auth', randomstring)
	    var reply_obj = { auth : randomstring }
	    db.hget('user:'+name, 'type', function(err, reply) {
		if (reply) {
		    reply_obj.type = reply
		}
		res.send(JSON.stringify(reply_obj))
	    })
	})
    })
}

exports.middleware = function(req, res, next) {
    if (!(req.path.lastIndexOf('/api') === 0) || (req.path.lastIndexOf('/api/auth') === 0)) {
	return next()
    }

    var db = require('redis').createClient();

    var auth = req.query.auth
    if (!auth && req.cookies.auth) {
	auth = req.cookies.auth
    }
    db.hget('auth', auth, function(err, user) {
	if (user) {
	    db.hget('user:'+user, 'auth', function(err, reply) {
		if (reply && reply == auth) {
		    res.locals.user = user
		    next()
		} else {
		    var err = new Error('Invalid authentication token')
		    err.status = 401
		    return next(err)
		}
	    })
	} else {
	    next()
	}
    })
}
