const mongodb = require('../database/database');
const { checkResourceExists, handleErrorResponse } = require('../utils');

const getAllTasks = async (req, res) => {
    //#swagger.tags=['Tasks']
    try {
        const tasks = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('tasks')
            .find({})
            .toArray();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(tasks);
    } catch (error) {
        handleErrorResponse(error, res, 'Task');
    }
};

const getSingleTask = async (req, res) => {
    //#swagger.tags=['Tasks']
    try {
        const taskId = req.params.id;
        const task = await checkResourceExists('tasks', taskId, 'Task');
        res.status(200).json(task);
    } catch (error) {
        handleErrorResponse(error, res, 'Task');
    }
};

const getTaskByUser = async (req, res) => {
    //#swagger.tags=['Tasks']
    try {
        const userId = req.params.id;
        await checkResourceExists('users', userId, 'User');
        
        const tasks = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('tasks')
            .find({ assignedTo: userId })
            .toArray();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(tasks);
    } catch (error) {
        handleErrorResponse(error, res, 'User');
    }
};

const createTask = async (req, res) => {
    //#swagger.tags=['Tasks']  
    try {
        const task = {
            _id: req.body._id,
            title: req.body.title,
            description: req.body.description,
            projectId: req.body.projectId,
            assignedTo: req.body.assignedTo,
            priority: req.body.priority,
            status: req.body.status,
            dueDate: req.body.dueDate
        };
        
        const response = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('tasks')
            .insertOne(task);
        
        if (response.acknowledged) {
            res.status(201).json({
                message: 'Task created successfully',
                taskId: response.insertedId || req.body._id
            });
        } else {
            res.status(500).json({
                error: 'Failed to create task'
            });
        }
        
    } catch (error) {
        handleErrorResponse(error, res, 'Task');
    }
};

const updateTask = async (req, res) => {
    //#swagger.tags=['Tasks']
    try {
        const taskId = req.params.id;
        await checkResourceExists('tasks', taskId, 'Task');
        
        const updateData = {};
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.description !== undefined) updateData.description = req.body.description;
        if (req.body.assignedTo !== undefined) updateData.assignedTo = req.body.assignedTo;
        if (req.body.status !== undefined) updateData.status = req.body.status.toLowerCase();
        if (req.body.priority !== undefined) updateData.priority = req.body.priority.toLowerCase();
        if (req.body.dueDate !== undefined) updateData.dueDate = req.body.dueDate;
        
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                error: 'At least one field must be provided for update'
            });
        }
        
        const result = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('tasks')
            .updateOne({ _id: taskId }, { $set: updateData });
        
        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: 'Task updated successfully',
                taskId: taskId
            });
        } else {
            res.status(200).json({
                message: 'No changes made to task',
                taskId: taskId
            });
        }
        
    } catch (error) {
        handleErrorResponse(error, res, 'Task');
    }
};

const deleteSingleTask = async (req, res) => {
    //#swagger.tags=['Tasks']
    try {
        const taskId = req.params.id;
        await checkResourceExists('tasks', taskId, 'Task');
        
        const result = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('tasks')
            .deleteOne({ _id: taskId });
        
        if (result.deletedCount > 0) {
            res.status(204).send(); 
        } else {
            res.status(500).json({
                error: 'Failed to delete task'
            });
        }
        
    } catch (error) {
        handleErrorResponse(error, res, 'Task');
    }
};

const deleteAllTasksInProject = async (req, res) => {
    //#swagger.tags=['Tasks']
    try {
        const projectId = req.params.id;
        await checkResourceExists('projects', projectId, 'Project');
        
        const tasksInProject = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('tasks')
            .find({ projectId: projectId })
            .toArray();
        
        if (tasksInProject.length === 0) {
            return res.status(200).json({
                message: 'No tasks found in this project to delete',
                deletedCount: 0
            });
        }
        
        const result = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('tasks')
            .deleteMany({ projectId: projectId });
        
        if (result.deletedCount > 0) {
            res.status(200).json({
                message: `Successfully deleted ${result.deletedCount} tasks from project`,
                deletedCount: result.deletedCount,
                projectId: projectId
            });
        } else {
            res.status(500).json({
                error: 'Failed to delete tasks from project'
            });
        }
        
    } catch (error) {
        handleErrorResponse(error, res, 'Project');
    }
};

module.exports = { getAllTasks, getSingleTask, getTaskByUser, createTask, updateTask, deleteSingleTask, deleteAllTasksInProject };