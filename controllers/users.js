const mongodb = require('../database/database');
// const { ObjectId } = require('mongodb');

const getAllUsers = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const users = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('users')
            .find()
            .toArray();
        
        console.log("Retrieved", users.length, "users");
        
        if (users.length === 0) {
            return res.status(200).json([]);
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ 
            message: "Failed to retrieve users",
            error: error.message 
        });
    }
};

const getSingleUser = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const userId = req.params.id;
        const result = await mongodb.getDatabase().db('taskManagement').collection('users').findOne({ _id: userId });
            if (!result) {
                return res.status(404).json({message: 'User not found'});
            }
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
};

const getUserTasks = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const userId = req.params.id;
        const tasks = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('tasks')
            .find({ assignedTo: userId })
            .toArray();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getUserProjects = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const userId = req.params.id;
        const projects = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('projects')
            .find({ teamMembers: userId })
            .toArray();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message });
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
        console.error('Error creating user:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                error: 'User with this ID already exists'
            });
        }
        res.status(500).json({
            error: 'Internal server error'
        });
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