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

const updateUser = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const userId = req.params.id;
        await checkResourceExists('users', userId, 'User');

        const updateData = {};
        if (req.body.name !== undefined) updateData.name = req.body.name;
        if (req.body.email !== undefined) updateData.email = req.body.email;
        if (req.body.role !== undefined) updateData.role = req.body.role.toLowerCase();
        
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                error: 'At least one field must be provided for update'
            });
        }
        
        const result = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('users')
            .updateOne({ _id: userId }, { $set: updateData });
        
        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: 'User updated successfully',
                userId: userId
            });
        } else {
            res.status(200).json({
                message: 'No changes made to user',
                userId: userId
            });
        }
        
    } catch (error) {
        handleErrorResponse(error, res, 'User');
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const userId = req.params.id;
        
        // Check if user exists
        await checkResourceExists('users', userId, 'User');
        
        // Delete the user directly
        const result = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('users')
            .deleteOne({ _id: userId });
        
        if (result.deletedCount > 0) {
            res.status(204).send(); // 204 No Content for successful deletion
        } else {
            res.status(500).json({
                error: 'Failed to delete user'
            });
        }
        
    } catch (error) {
        handleErrorResponse(error, res, 'User');
    }
};


module.exports = { getAllUsers, getSingleUser, getUserTasks, getUserProjects, createUser, updateUser, deleteUser };