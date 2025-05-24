const express = require('express');
const router = express.Router();

const projectContoller = require('../controllers/projects');

router.get('/', projectContoller.getAllProjects);

router.get('/:id', projectContoller.getSingleProject);

router.get('/:id/tasks', projectContoller.getTasksInProject);

router.get('/user/:id', projectContoller.getProjectByUser);

router.post('/', projectContoller.createProject);

// router.put('/:id', projectContoller.updateProject);

// router.delete('/:id', projectContoller.deleteProject);

module.exports = router;