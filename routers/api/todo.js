const express = require('express')
const router = express.Router()
const fs = require('fs')

const loadTodos = () => {
    let todoJSON = fs.readFileSync('./db/todo.json')
    let todoList = JSON.parse(todoJSON)
    return todoList
}

const saveTodos = (list) => {
    let todo = JSON.stringify(list, null, 2)
    fs.writeFileSync('./db/todo.json', todo)
}

const todoList = loadTodos()

const isIdExist = (id, list) => {
    return list.some(listItem => listItem.id === id)
}

const handleIdNotFound = (id, response) => {
    let idNotFoundMsg = {
        msg: `There is not id ${id}.`
    }
    response.status(400).json(idNotFoundMsg)
}

const handleIdAndAction = (req, res, actionFunc) => {
    let id = parseInt(req.params.id, 10)
    let isFounded = isIdExist(id, todoList)
    if (isFounded) {
        actionFunc(req, res, id)
    } else {
        handleIdNotFound(id, res)
    }
}

const allTodos = (req, res) => {
    res.json(todoList)
}

const addTodo = (req, res) => {
    let { task } = req.body
    console.log(typeof req.body)
    let length = todoList.length
    let id = length === 0 ? 1 : todoList[length - 1].id + 1
    const newItem = {
        task,
        id,
        done: false,
    }
    todoList.push(newItem)
    saveTodos(todoList)
    res.json(todoList)
}

const sendTodo = (req, res, id) => {
    let todo = todoList.filter(item => item.id === id)
    res.json(todo)
}

const deleteTodo = (req, res, id) => {
    let index = todoList.findIndex(todoItem => todoItem.id === id)
    let item = todoList.splice(index, 1)[0]
    saveTodos(todoList)
    res.json({ item, todoList })
}

const updateTodo = (req, res, id) => {
    let update = req.body
    let item = todoList.find(e => e.id === id)
    Object.entries(update).forEach(entry => {
        let [k, v] = entry
        item[k] = v
    })
    saveTodos(todoList)
    res.json(item)
}


// GET method
// get all the items
router.get('/all', (req, res) => {
    allTodos(req, res)
})
// get id item
router.get('/:id', (req, res) => {
    handleIdAndAction(req, res, sendTodo)
})

// add item
router.post('/add', (req, res) => {
    addTodo(req, res)
})
// POST method
// update item
router.post('/update/:id', (req, res) => {
    handleIdAndAction(req, res, updateTodo)
})
// remove item
router.get('/delete/:id', (req, res) => {
    handleIdAndAction(req, res, deleteTodo)
})

module.exports = router