module.exports = function (req, res, next) {
    if (req.path == '/') {
	res.redirect('login.html')
    } else {
	next()
    }
}
