const express = require('express');
const router = express.Router();
const { validateRequestBody, validateTask, validateTaskUpdate } = require('../validation');

const taskContoller = require('../controllers/tasks');

router.get('/', taskContoller.getAllTasks);

router.get('/:id', taskContoller.getSingleTask);

router.get('/user/:id', taskContoller.getTaskByUser);

router.post('/', validateRequestBody, validateTask, taskContoller.createTask);

router.put('/:id', validateRequestBody, validateTaskUpdate, taskContoller.updateTask);

router.delete('/:id', taskContoller.deleteTask);

module.exports = router;