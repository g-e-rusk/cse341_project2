const mongodb = require('../database/database');
const { checkResourceExists, handleErrorResponse } = require('../utils');

const getAllUsers = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const users = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('users')
            .find({})
            .toArray();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    } catch (error) {
        handleErrorResponse(error, res, 'User');
    }
};

const getSingleUser = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const userId = req.params.id;
        const user = await checkResourceExists('users', userId, 'User');
        res.status(200).json(user);
    } catch (error) {
        handleErrorResponse(error, res, 'User');
    }
};

const getUserTasks = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const userId = req.params.id;
        
        // First check if user exists
        await checkResourceExists('users', userId, 'User');
        
        // If user exists, get their tasks
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

const getUserProjects = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const userId = req.params.id;
        
        // First check if user exists
        await checkResourceExists('users', userId, 'User');
        
        // If user exists, get their projects
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

const createUser = async (req, res) => {
    //#swagger.tags=['Users']  
    try {
        const user = {
            _id: req.body._id,
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        };
        
        const response = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('users')
            .insertOne(user);
        
        if (response.acknowledged) {
            res.status(201).json({
                message: 'User created successfully',
                taskId: response.insertedId || req.body._id
            });
        } else {
            res.status(500).json({
                error: 'Failed to create user'
            });
        }
        
    } catch (error) {
        handleErrorResponse(error, res, 'User');
    }
};

// const updateUser = async(req, res) => {
//     //#swagger.tags=['Users']
//     const userId = new ObjectId(req.params.id);
//     const contact = {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         favoriteColor: req.body.favoriteColor,
//         birthday: req.body.birthday
//     };
//     const response = await mongodb.getDatabase().db('taskManagement').collection('users').replaceOne({ _id: userId }, contact);
//     if (response.modifiedCount > 0) {
//         res.status(204).end();
//     } else {
//         res.status(500).json(response.error || 'Some error occured while updating the contact.');
//     }
// };

// const deleteUser = async(req, res) => {
//     //#swagger.tags=['Users']
//     const userId = new ObjectId(req.params.id);
//     const response = await mongodb.getDatabase().db('taskManagement').collection('users').deleteOne({ _id: userId });
//     if (response.deletedCount > 0) {
//         res.status(204).end();
//     } else {
//         res.status(500).json(response.error || 'Some error occured while deleting the contact.');
//     }
// };

module.exports = { getAllUsers, getSingleUser, getUserTasks, getUserProjects,createUser };