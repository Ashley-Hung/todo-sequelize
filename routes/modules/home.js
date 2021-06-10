const express = require('express')
const router = express.Router()

const { Todo } = require('../../models')

router.get('/', (req, res) => {
	const UserId = req.user.id
	return Todo.findAll({
		raw: true,
		nest: true,
		where: { UserId }
	})
		.then(todos => {
			return res.render('index', { todos })
		})
		.catch(error => {
			return res.status(422).json(error)
		})
})

module.exports = router
