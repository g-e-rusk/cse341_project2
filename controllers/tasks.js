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

// const updateTask = async(req, res) => {
//     //#swagger.tags=['Tasks']
//     const userId = new ObjectId(req.params.id);
//     const contact = {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         favoriteColor: req.body.favoriteColor,
//         birthday: req.body.birthday
//     };
//     const response = await mongodb.getDatabase().db('taskManagement').collection('tasks').replaceOne({ _id: userId }, contact);
//     if (response.modifiedCount > 0) {
//         res.status(204).end();
//     } else {
//         res.status(500).json(response.error || 'Some error occured while updating the contact.');
//     }
// };

// const deleteSingleTask = async(req, res) => {
//     //#swagger.tags=['Tasks']
//     const userId = new ObjectId(req.params.id);
//     const response = await mongodb.getDatabase().db('taskManagement').collection('tasks').deleteOne({ _id: userId });
//     if (response.deletedCount > 0) {
//         res.status(204).end();
//     } else {
//         res.status(500).json(response.error || 'Some error occured while deleting the contact.');
//     }
// };

// const deleteAllTasks = async (req, res) => {
//     //#swagger.tags=['Tasks']
// };

module.exports = { getAllTasks, getSingleTask, getTaskByUser, createTask };