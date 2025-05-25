const express = require('express');
const router = express.Router();
const { validateRequestBody, validateUser, validateUserUpdate } = require('../validation');

const userContoller = require('../controllers/users');

router.get('/', userContoller.getAllUsers);

router.get('/:id', userContoller.getSingleUser);

router.get('/:id/tasks', userContoller.getUserTasks);

router.get('/:id/projects', userContoller.getUserProjects);

router.post('/', validateRequestBody, validateUser, userContoller.createUser);

router.put('/:id', validateRequestBody, validateUserUpdate, userContoller.updateUser);

router.delete('/:id', userContoller.deleteUser);

module.exports = router;