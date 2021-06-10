const express = require('express')
const router = express.Router()

const { Todo } = require('../../models')

// Create: 新增 Todo 的頁面
router.get('/create', (req, res) => {
	res.render('create')
})

router.post('/', (req, res) => {
	const UserId = req.user.id
	const { name } = req.body
	return Todo.create({ name, UserId }) // 要把使用者 id 一起存入
		.then(() => res.redirect('/'))
		.catch(error => console.log(error))
})

// Read: detail page
router.get('/:id', (req, res) => {
	const { id } = req.params
	return Todo.findByPk(id)
		.then(todo => res.render('detail', { todo: todo.toJSON() }))
		.catch(error => console.log(error))
})

// Update: edit page
router.get('/:id/edit', async (req, res) => {
	const UserId = req.user.id
	const { id } = req.params

	try {
		const todo = await Todo.findOne({ where: { id, UserId } })
		res.render('edit', { todo: todo.toJSON() })
	} catch (error) {
		console.log(error)
	}
})

// Update
router.put('/:id', async (req, res) => {
	const UserId = req.user.id
	const { id } = req.params
	const { name, isDone } = req.body

	try {
		const todo = await Todo.findOne({ where: { id, UserId } })
		if (todo) {
			todo.name = name
			todo.isDone = isDone === 'on'
		}
		await todo.save()
		res.redirect(`/todos/${id}`)
	} catch (err) {
		console.log(error)
	}
})

// Delete
router.delete('/:id', async (req, res) => {
	const UserId = req.user.id
	const { id } = req.params

	try {
		const todo = await Todo.findOne({ where: { id, UserId } })
		if (todo) await todo.destroy()
		res.redirect('/')
	} catch (error) {
		console.log(error)
	}
})

module.exports = router
