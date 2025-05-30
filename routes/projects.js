const express = require('express');
const router = express.Router();
const { validateRequestBody, validateProject, validateProjectUpdate } = require('../validation');
const { isAuthenticated } = require("../middleware/authenticate");

const projectContoller = require('../controllers/projects');

router.get('/', projectContoller.getAllProjects);

router.get('/:id', projectContoller.getSingleProject);

router.get('/:id/tasks', projectContoller.getTasksInProject);

router.get('/user/:id', projectContoller.getProjectByUser);

router.post('/', isAuthenticated, validateRequestBody, validateProject, projectContoller.createProject);

router.put('/:id', isAuthenticated, validateRequestBody, validateProjectUpdate, projectContoller.updateProject);

router.delete('/:id', isAuthenticated, projectContoller.deleteProject);

module.exports = router;