exports.route = function(app) {
    app.post('/new', function(req, res){
	var name = req.query.name;
	if (!name) {
	    res.status(400).send('Need admin name')
	    return
	}
	res.send('admin name' + name);
    })

    app.post('/get', function(req, res){
	res.send('admin get');
    })
}
