const mongodb = require('../database/database');
// const { ObjectId } = require('mongodb');

const getAllTasks = async (req, res) => {
    //#swagger.tags=['Tasks']
    const result = await mongodb.getDatabase().db('taskManagement').collection('tasks').find();
    result.toArray().then((tasks) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(tasks);
    });
};

const getSingleTask = async (req, res) => {
    //#swagger.tags=['Tasks']
    try {
    const taskId = req.params.id;
    const result = await mongodb.getDatabase().db('taskManagement').collection('tasks').findOne({ _id: taskId });
        if (!result) {
            return res.status(404).json({message: 'Task not found'});
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// const getTaskByUser = async (req, res) => {
//     //#swagger.tags=['Tasks']
// };

// const createTask = async(req, res) => {
//     //#swagger.tags=['Tasks']
//     const contact = {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         favoriteColor: req.body.favoriteColor,
//         birthday: req.body.birthday
//     };
//     const response = await mongodb.getDatabase().db('taskManagement').collection('tasks').insertOne(contact);
//     if (response.acknowledged) {
//         res.status(201).send('Contact created successfully.');
//     } else {
//         res.status(500).json(response.error || 'Some error occured while creating the contact.');
//     }
// };

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

module.exports = { getAllTasks, getSingleTask };