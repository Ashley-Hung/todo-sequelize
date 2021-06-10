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
	try {
		const user = await User.findOne({ where: { email } })
		if (user) {
			console.log('User already exists')
			return res.render('register', { name, email, password, confirmPassword })
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
	res.send('logout')
})

module.exports = router
