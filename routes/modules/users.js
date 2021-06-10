const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { User } = require('../../models')
const router = express.Router()

// Login
router.get('/login', (req, res) => {
	res.render('login')
})

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login'
	})
)

// Register
router.get('/register', (req, res) => {
	res.render('register')
})

router.post('/register', async (req, res) => {
	const { name, email, password, confirmPassword } = req.body
	const errors = []
	if (!name || !email || !password || !confirmPassword) {
		errors.push({ message: 'The field cannot be empty' })
	}
	if (password !== confirmPassword) {
		errors.push({ message: '密碼與確認密碼不相符' })
	}
	if (errors.length) {
		return res.render('register', { errors, name, email, password })
	}

	try {
		const user = await User.findOne({ where: { email } })
		if (user) {
			errors.push({ message: 'This Email is Already Registered' })
			return res.render('register', { errors, name, email, password })
		}

		const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
		await User.create({ name, email, password: hash })
		res.redirect('/')
	} catch (error) {
		console.log(error)
	}
})

// Logout
router.get('/logout', (req, res) => {
	req.logout()
	req.flash('success_msg', '你已經成功登出！')
	res.redirect('/users/login')
})

module.exports = router
