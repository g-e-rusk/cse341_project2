const mongodb = require('../database/database');
// const { ObjectId } = require('mongodb');

const getAllUsers = async (req, res) => {
    //#swagger.tags=['Users']
    const result = await mongodb.getDatabase().db('taskManagement').collection('users').find();
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts);
    });
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
            const tasks = await mongodb.getDatabase().db('taskManagement').collection('tasks').find({ userId: userId }).toArray();
    
            if (tasks.length === 0) {
                return res.status(200).json([]); 
            }
            
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(tasks);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };


// const getUserProjects = async (req, res) => {
    //#swagger.tags=['Users']

// };

// const createUser = async(req, res) => {
//     //#swagger.tags=['Users']
//     const contact = {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         favoriteColor: req.body.favoriteColor,
//         birthday: req.body.birthday
//     };
//     const response = await mongodb.getDatabase().db('taskManagement').collection('users').insertOne(contact);
//     if (response.acknowledged) {
//         res.status(201).send('Contact created successfully.');
//     } else {
//         res.status(500).json(response.error || 'Some error occured while creating the contact.');
//     }
// };

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

module.exports = { getAllUsers, getSingleUser, getUserTasks };