const express = require('express')
const router = express.Router()

const { Todo } = require('../../models')

// Create: 新增 Todo 的頁面
router.get('/create', (req, res) => {
	res.render('create')
})

router.post('/', async (req, res) => {
	const UserId = req.user.id
	const { name } = req.body
	try {
		await Todo.create({ name, UserId })
		res.redirect('/')
	} catch (error) {
		console.log(error)
		res.render('error')
	}
})

// Read: detail page
router.get('/:id', async (req, res) => {
	const { id } = req.params
	const UserId = req.user.id
	try {
		const todo = await Todo.findOne({ where: { id, UserId }, raw: true })
		res.render('detail', { todo })
	} catch (error) {
		console.log(error)
		res.render('error')
	}
})

// Update: edit page
router.get('/:id/edit', async (req, res) => {
	const UserId = req.user.id
	const { id } = req.params

	try {
		const todo = await Todo.findOne({ where: { id, UserId }, raw: true })
		res.render('edit', { todo })
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
		// update 會把所有符合條件的都更新，為了避免意外情況還是用以下方法
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
