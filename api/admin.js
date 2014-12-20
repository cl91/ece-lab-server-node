var db = require('redis').createClient()

exports.new = function(req, res) {
    var name = req.query.name;
    var pass = req.query.pass;
    if (!name || !pass) {
	res.status(400).send('Need admin name and password')
	return
    }
    db.sismember('admins', name, function(err, reply) {
	if (reply == 1) {
	    res.status(400).send('Admin ' + name + ' exists')
	    return
	}

	db.sismember('users', name, function(err, reply) {
	    if (reply == 0) {
		db.sadd('users', name)
		db.hset('user:'+name, 'pass', pass)
	    }
	})

	db.sadd('admins', name, function(err, reply) {
	    if (reply == 1) {
		res.send('Admin ' + name + ' added')
	    } else {
		res.send('Failed to add admin ' + name + ': ' + err)
	    }
	})
    })
}

exports.del = function(req, res) {
    var name = req.query.name;
    if (!name) {
	res.status(400).send('Need admin name')
	return
    }
    db.sismember('admins', name, function(err, reply) {
	if (reply == 0) {
	    res.status(400).send('Admin ' + name + ' does not exist')
	    return
	}

	db.srem('admins', name, function(err, reply) {
	    if (reply == 1) {
		res.send('Admin ' + name + ' deleted')
	    } else {
		res.send('Failed to delete admin ' + name + ': ' + err)
	    }
	})
    })
}

exports.get = function(req, res) {
    function write_admin_info(name, admins, i, n) {
	db.smembers(name+':courses', function(err, reply) {
	    var courses = reply ? reply : []
	    admins[i] = { 'name' : name, 'courses' : courses }
	    if (i == n-1) {
		res.send(JSON.stringify(admins))
	    }
	})
    }

    var admins = [];

    db.smembers('admins', function(err, reply) {
	if (err) {
	    res.send('Db access failed: ' + err)
	    return
	}
	for (var i = 0; i < reply.length; i++) {
	    write_admin_info(reply[i], admins, i, reply.length)
	}
    })
}

exports.auth = function(req, res, failed, success) {
    var user = res.locals.user
    db.sismember('superadmins', user, function(err, reply) {
	if (reply == 1) {
	    success(req, res)
	} else {
	    failed(req, res)
	}
    })
}
