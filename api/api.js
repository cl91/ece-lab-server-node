exports.route = function(app) {
    app.namespace('/admin', function(){
	app.post('/new', function(req, res){
	    res.send('admin new');
	});

	app.post('/get', function(req, res){
	    res.send('admin get');
	});
    });
};
