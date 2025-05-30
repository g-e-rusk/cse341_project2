const express = require('express');
const router = express.Router();
const { validateRequestBody, validateTask, validateTaskUpdate } = require('../validation');
const { isAuthenticated } = require("../middleware/authenticate");

const taskContoller = require('../controllers/tasks');

router.get('/', taskContoller.getAllTasks);

router.get('/:id', taskContoller.getSingleTask);

router.get('/user/:id', taskContoller.getTaskByUser);

router.post('/', isAuthenticated, validateRequestBody, validateTask, taskContoller.createTask);

router.put('/:id', isAuthenticated, validateRequestBody, validateTaskUpdate, taskContoller.updateTask);

router.delete('/:id', isAuthenticated, taskContoller.deleteTask);

module.exports = router;