const express = require('express');
const router = express.Router();
const { validateRequestBody, validateUser, validateUserUpdate } = require('../validation');
const { isAuthenticated } = require("../middleware/authenticate");

const userContoller = require('../controllers/users');

router.get('/', userContoller.getAllUsers);

router.get('/:id', userContoller.getSingleUser);

router.get('/:id/tasks', userContoller.getUserTasks);

router.get('/:id/projects', userContoller.getUserProjects);

router.post('/', isAuthenticated, validateRequestBody, validateUser, userContoller.createUser);

router.put('/:id', isAuthenticated, validateRequestBody, validateUserUpdate, userContoller.updateUser);

router.delete('/:id', isAuthenticated, userContoller.deleteUser);

module.exports = router;