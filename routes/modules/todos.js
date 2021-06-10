const express = require('express')
const router = express.Router()

const { Todo } = require('../../models')

// Read: detail page
router.get('/:id', (req, res) => {
	const { id } = req.params
	return Todo.findByPk(id)
		.then(todo => res.render('detail', { todo: todo.toJSON() }))
		.catch(error => console.log(error))
})

module.exports = router
