const mongodb = require('../database/database');
// const { ObjectId } = require('mongodb');

const getAllTasks = async (req, res) => {
    //#swagger.tags=['Tasks']
    try {
        const tasks = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection('tasks')
            .find()
            .toArray();
        
        console.log("Retrieved", tasks.length, "tasks");
        
        if (tasks.length === 0) {
            return res.status(200).json([]);
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(tasks);
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ 
            message: "Failed to retrieve tasks",
            error: error.message 
        });
    }
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

const getTaskByUser = async (req, res) => {
//     //#swagger.tags=['Tasks']
try {
        const userId = req.params.id;
        const tasks = await mongodb.getDatabase().db('taskManagement').collection('tasks').find({ assignedTo: userId }).toArray();
        if (tasks.length === 0) {
            return res.status(200).json([]); 
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(tasks);
    } catch (error) {
        console.log("Error:", error)
        res.status(500).json({ message: error.message });
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
        console.error('Error creating task:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                error: 'Task with this ID already exists'
            });
        }
        res.status(500).json({
            error: 'Internal server error'
        });
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