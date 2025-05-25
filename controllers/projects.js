const mongodb = require('../database/database');
const { checkResourceExists, handleErrorResponse } = require('../utils');

const getAllProjects = async (req, res) => {
    //#swagger.tags=['Projects']
    try {
        const projects = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('projects')
            .find({})
            .toArray();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(projects);
    } catch (error) {
        handleErrorResponse(error, res, 'Project');
    }
};

const getSingleProject = async (req, res) => {
    //#swagger.tags=['Projects']
    try {
        const projectId = req.params.id;
        const project = await checkResourceExists('projects', projectId, 'Project');
        res.status(200).json(project);
    } catch (error) {
        handleErrorResponse(error, res, 'Project');
    }
};

const getTasksInProject = async (req, res) => {
    //#swagger.tags=['Projects']
    try {
        const projectId = req.params.id;
        await checkResourceExists('projects', projectId, 'Project');

        const tasks = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('tasks')
            .find({ projectId: projectId }) 
            .toArray();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(tasks);
    } catch (error) {
        handleErrorResponse(error, res, 'Project');
    }
};

const getProjectByUser = async (req, res) => {
    //#swagger.tags=['Users'] 
    try {
        const userId = req.params.id;
        await checkResourceExists('users', userId, 'User');

        const projects = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('projects')
            .find({ teamMembers: userId })
            .toArray();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(projects);
    } catch (error) {
        handleErrorResponse(error, res, 'User');
    }
};

const createProject = async (req, res) => {
    //#swagger.tags=['Projects']  
    try {
        const project = {
            _id: req.body._id,
            name: req.body.name,
            description: req.body.description,
            teamMembers: req.body.teamMembers};
        
        const response = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('projects')
            .insertOne(project);
        
        if (response.acknowledged) {
            res.status(201).json({
                message: 'Project created successfully',
                projectId: response.insertedId || req.body._id
            });
        } else {
            res.status(500).json({
                error: 'Failed to create project'
            });
        }
        
    } catch (error) {
        handleErrorResponse(error, res, 'Project');
    }
};

const updateProject = async (req, res) => {
    //#swagger.tags=['Projects']
    try {
        const projectId = req.params.id;
        await checkResourceExists('projects', projectId, 'Project');
        
        const updateData = {};
        if (req.body.name !== undefined) updateData.name = req.body.name;
        if (req.body.description !== undefined) updateData.description = req.body.description;
        if (req.body.teamMembers !== undefined) updateData.teamMembers = req.body.teamMembers;
        
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                error: 'At least one field must be provided for update'
            });
        }
        
        const result = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('projects')
            .updateOne({ _id: projectId }, { $set: updateData });
        
        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: 'Project updated successfully',
                projectId: projectId
            });
        } else {
            res.status(200).json({
                message: 'No changes made to project',
                projectId: projectId
            });
        }
        
    } catch (error) {
        handleErrorResponse(error, res, 'Project');
    }
};

const deleteProject = async (req, res) => {
    //#swagger.tags=['Projects']
    try {
        const projectId = req.params.id;
        await checkResourceExists('projects', projectId, 'Project');

        const associatedTasks = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('tasks')
            .find({ projectId: projectId })
            .toArray();

        if (associatedTasks.length > 0) {
            return res.status(409).json({
                error: 'Cannot delete project',
                message: `Project has ${associatedTasks.length} associated tasks.  Delete or reassign tasks first.`
            });
        }

        const result = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('projects')
            .deleteOne({ _id: projectId });

        if (result.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json({
                error: 'Failed to delete project'
            });
        }
    } catch (error) {
        handleErrorResponse(error, res, 'Project');
    }
};

module.exports = { getAllProjects, getSingleProject, getTasksInProject, getProjectByUser, createProject, updateProject, deleteProject };