const express = require('express');
const router = express.Router();

const taskContoller = require('../controllers/tasks');

router.get('/', taskContoller.getAllTasks);

router.get('/:id', taskContoller.getSingleTask);

// router.get('/user/:userId', taskContoller.getTaskByUser);

// router.post('/', taskContoller.createTask);

// router.put('/:id', taskContoller.updateTask);

// router.delete('/:id', taskContoller.deleteSingleTask);

// router.delete(':/project/:projectId', taskContoller.deleteAllTasks);

module.exports = router;