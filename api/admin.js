var db = require('redis').createClient()

exports.new = function(req, res) {
    var name = req.query.name;
    var pass = req.query.pass;
    var fullname = req.query.fullname
    if (!name || !pass) {
	res.status(400).send('Need admin name and password')
	return
    }
    db.hget('user:'+name, 'type', function(err, reply) {
	if (!reply || reply == 'admin') {
	    db.sismember('admins', name, function(err, reply) {
		if (reply == 1) {
		    res.status(400).send('Admin ' + name + ' exists')
		    return
		}
		
		db.sismember('users', name, function(err, reply) {
		    if (reply == 0) {
			db.sadd('users', name)
			db.hset('user:'+name, 'pass', pass)
			db.hset('user:'+name, 'type', 'admin')
			if (fullname) {
			    db.hset('user:'+name, 'fullname', fullname)
			}
		    }
		})
		
		db.sadd('admins', name, function(err, reply) {
		    if (reply == 1) {
			res.send('Admin ' + name + ' added')
		    } else {
			res.status(501).send('Failed to add admin ' + name + ': ' + err)
		    }
		})
	    })
	} else if (reply) {
	    res.status(400).send('User ' + name + ' exists')
	}
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
		db.srem('users', name)
		db.del('user:'+name)
		db.del('user:'+name+':courses')
		res.send('Admin ' + name + ' deleted')
	    } else {
		res.send('Failed to delete admin ' + name + ': ' + err)
	    }
	})
    })
}

exports.get = function(req, res) {
    function write_admin_info(name, admins, i, n) {
	db.smembers('user:'+name+':courses', function(err, reply) {
	    var courses = reply ? reply : []
	    admins[i] = { 'name' : name, 'courses' : courses }
	    db.hget('user:'+name, 'fullname', function(err, reply) {
		if (reply) {
		    admins[i].fullname = reply
		}
		if (i == n-1) {
		    res.send(JSON.stringify(admins))
		}
	    })
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
