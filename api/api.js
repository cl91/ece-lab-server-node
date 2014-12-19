exports.route = function(app) {
    var api_list = ['admin', 'course', 'student', 'mark', 'auth']

    for (var i = 0; i < api_list.length; i++) {
	var api_name = api_list[i]
	var obj = require('./' + api_name)
	app.namespace('/'+api_name, function() { obj.route(app) })
    }
}
