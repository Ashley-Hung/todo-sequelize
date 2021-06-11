const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const { User } = require('../models')

module.exports = app => {
	app.use(passport.initialize())
	app.use(passport.session())

	// 設定本地登入策略
	passport.use(
		new LocalStrategy(
			{ usernameField: 'email', passReqToCallback: true },
			(req, email, password, done) => {
				User.findOne({ where: { email } })
					.then(user => {
						if (!user) {
							return done(null, false, req.flash('warning_msg', 'That email is not registered!'))
						}

						const isMatch = bcrypt.compareSync(password, user.password)
						if (!isMatch) {
							return done(null, false, req.flash('warning_msg', 'Email or Password is incorrect!'))
						}

						return done(null, user)
					})
					.catch(err => {
						done(err, false)
					})
			}
		)
	)

	// Facebook
	passport.use(
		new FacebookStrategy(
			{
				clientID: process.env.FACEBOOK_ID,
				clientSecret: process.env.FACEBOOK_SECRET,
				callbackURL: process.env.FACEBOOK_CALLBACK,
				profileFields: ['email', 'displayName']
			},
			(accessToken, refreshToken, profile, done) => {
				const { name, email } = profile._json

				User.findOne({ where: { email } }).then(user => {
					if (user) return done(null, user)

					const randomPassword = Math.random().toString(36).slice(-8)
					bcrypt
						.genSalt(10)
						.then(salt => bcrypt.hash(randomPassword, salt))
						.then(hash => User.create({ name, email, password: hash }))
						.then(user => done(null, user))
						.catch(err => done(err, false))
				})
			}
		)
	)

	// 設定序列化與反序列化
	passport.serializeUser((user, done) => {
		done(null, user.id)
	})

	passport.deserializeUser((id, done) => {
		User.findByPk(id)
			.then(user => {
				user = user.toJSON() // 將 user object 轉成 plain object
				done(null, user)
			})
			.catch(err => done(err, null))
	})
}
