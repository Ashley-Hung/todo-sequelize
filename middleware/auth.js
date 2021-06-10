module.exports = {
	authenticator: (req, res, next) => {
		if (req.isAuthenticated()) return next() // isAuthenticated: passport 提供的函式
		req.flash('warning_msg', '請先登入才能使用！') // key, value
		res.redirect('/users/login')
	}
}
