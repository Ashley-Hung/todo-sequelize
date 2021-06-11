const express = require('express')
const router = express.Router()

const { Todo } = require('../../models')

router.get('/', async (req, res) => {
	const UserId = req.user.id

	try {
		const todos = await Todo.findAll({ raw: true, nest: true, where: { UserId } })
		res.render('index', { todos })
	} catch (error) {
		console.log(error)
		return res.render('error')
	}
})

module.exports = router
