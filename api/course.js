var db = require('redis').createClient()

exports.new = function(req, res) {
    var name = req.query.name
    if (!name) {
	res.status(400).send('Need course name')
	return
    }
    var user = res.locals.user
    db.sismember('courses', name, function(err, reply) {
	if (reply == 1) {
	    res.status(400).send('Course '+ name + ' exists')
	    return
	}
	db.sadd(user+':courses', name)
	res.send('Added course ' + name)
    })
}

exports['new-marker'] = function(req, res) {
    var name = req.query.name
    if (!name) {
	res.status(400).send('Need marker name')
	return
    }
    var user = res.locals.user
    var course = req.params.param
    if (!course) {
	res.status(400).send('Need course name')
	return
    }
    db.sismember('users', name, function(err, reply) {
	if (reply == 0) {
	    db.sadd('users', name)
	    db.hset('user:'+name, 'pass', name)
	    db.sadd('user:'+name+':courses', course)
	}
    })
    db.sadd('course:'+course+':markers', name, function(err, reply) {
	if (reply == 1) {
	    res.send('Added marker ' + name + ' for course ' + course)
	} else {
	    res.status(500).send('Failed to add marker ' + marker + ' for course ' + course)
	}
    })
}

exports.auth = function(req, res, failed, success) {
    var user = res.locals.user
    db.sismember('admins', user, function(err, reply) {
	if (reply == 1) {
	    var param = req.params.param
	    if (param) {
		db.sismember(user+':courses', param, function(err, reply) {
		    if (reply == 1) {
			success(req, res)
		    } else {
			failed(req, res)
		    }
		})
	    } else {
		success(req, res)
	    }
	} else {
	    failed(req, res)
	}
    })
}
