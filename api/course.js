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
	db.sadd('courses', name)
	db.sadd(user+':courses', name)
	res.send('Added course ' + name)
    })
}

exports['get'] = function(req, res) {
    var user = res.locals.user
    db.smembers(user+':courses', function(err, reply) {
	if (reply) {
	    var arr = []
	    for (var i = 0; i < reply.length; i++) {
		var course = reply[i]
		var obj = { name : course }
		db.smembers('course:'+course+':aliases', function(err, r) {
		    if (r) {
			obj.aliases = r
		    } else {
			obj.aliases = []
		    }
		    arr[i-1] = obj	// FUCK JAVASCRIPT! FUCK NODE.JS! FUCK CALLBACK HELL!
		    if (i == reply.length) {
			res.send(JSON.stringify(arr))
		    }
		})
	    }
	} else {
	    res.send(JSON.stringify([]))
	}
    })
}

exports['new-alias'] = function(req, res) {
    var name = req.query.name
    if (!name) {
	res.status(400).send('Need alias course name')
	return
    }
    var user = res.locals.user
    var course = req.params.param
    if (!course) {
	res.status(400).send('Need course name')
	return
    }
    db.sismember('courses', name, function(err, reply) {
	if (reply == 1) {
	    res.status(400).send('Course ' + name + ' exists')
	} else {
	    db.sadd('courses', name)
	    db.sadd('course:'+course+':aliases', name)
	    db.set('course:'+name+':aliased-to', course)
	    res.send('Added alias ' + name + ' for course ' + course)
	}
    })
}

exports['del-alias'] = function(req, res) {
    var name = req.query.name
    if (!name) {
	res.status(400).send('Need alias course name')
	return
    }
    var user = res.locals.user
    var course = req.params.param
    if (!course) {
	res.status(400).send('Need course name')
	return
    }
    db.sismember('course:'+course+':aliases', name, function(err, reply) {
	if (reply == 0) {
	    res.status(400).send('Course ' + name + ' is not an alias course')
	} else {
	    db.srem('courses', name)
	    db.srem('course:'+course+':aliases', name)
	    db.del('course:'+name+':aliased-to')
	    res.send('Deleted alias ' + name + ' for course ' + course)
	}
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
	    db.hset('user:'+name, 'type', 'marker')
	    db.sadd('user:'+name+':courses', course)
	}
    })
    db.sadd('course:'+course+':markers', name, function(err, reply) {
	if (reply == 1) {
	    db.hset('user:'+name, 'type', 'marker')
	    res.send('Added marker ' + name + ' for course ' + course)
	} else {
	    res.status(500).send('Failed to add marker ' + marker + ' for course ' + course)
	}
    })
}

// TODO: add validation
function is_valid_lab(lab) {
    return true
}

exports['edit-lab'] = function(req, res) {
    var course = req.params.param
    if (!course) {
	res.status(400).send('Need course name')
	return
    }

    var id = req.query.id
    if (!id || parseInt(id) == NaN) {
	res.status(400).send('Invalid lab id')
	return
    }
    id = parseInt(id)

    if (!req.body) {
	res.status(400).send('Empty JSON body')
	return
    }

    var lab = req.body
    if (!is_valid_lab(lab)) {
	res.status(400).send('Invalid JSON body')
	return
    }

    db.sadd('course:'+course+':labs', id, function(err, reply) {
	if (reply == 1) {
	    db.set('course:'+course+':lab:'+id, JSON.stringify(lab), function(err, reply) {
		if (reply == 'OK') {
		    res.send('Successfully added lab ' + id + ' for course ' + course)
		} else {
		    res.status(500).send('Failed to add lab ' + id + ' for course ' + course
					 + ': ' + err)
		}
	    })
	} else if (reply == 0) {
	    db.set('course:'+course+':lab:'+id, JSON.stringify(lab), function(err, reply) {
		if (reply == 'OK') {
		    res.send('Successfully edited lab ' + id + ' for course ' + course)
		} else {
		    res.status(500).send('Failed to edit lab ' + id + ' for course ' + course
					 + ': ' + err)
		}
	    })
	} else {
	    res.status(500).send('Failed to add lab ' + id + ' for course ' + course)
	}
    })
}

exports['get-labs'] = function(req, res) {
    var course = req.params.param
    if (!course) {
	res.status(400).send('Need course name')
	return
    }

    var ret = {}
    var success = true
    db.smembers('course:'+course+':labs', function(err, reply) {
	if (reply) {
	    ret.ids = reply
	    ret.labs = []
	    for (var i = 0; i < reply.length; i++) {
		var id = reply[i]
		db.get('course:'+course+':lab:'+id, function(err, r) {
		    if (r) {
			ret.labs[id] = JSON.parse(r)
		    } else if (err) {
			success = false
		    }
		    if (success && (i == reply.length)) {
			res.send(JSON.stringify(ret))
			return
		    }
		    if (!success) {
			res.status(500).send('Failed to get labs for ' + course + ': ' + err)
		    }
		})
	    }
	} else {
	    res.status(500).send('Failed to get labs for ' + course + ': ' + err)
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
