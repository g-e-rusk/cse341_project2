const express = require('express');
const router = express.Router();
const { validateRequestBody, validateTask } = require('../validation');

const taskContoller = require('../controllers/tasks');

router.get('/', taskContoller.getAllTasks);

router.get('/:id', taskContoller.getSingleTask);

router.get('/user/:id', taskContoller.getTaskByUser);

router.post('/', validateRequestBody, validateTask, taskContoller.createTask);

// router.put('/:id', taskContoller.updateTask);

// router.delete('/:id', taskContoller.deleteSingleTask);

// router.delete(':/project/:id', taskContoller.deleteAllTasks);

module.exports = router;