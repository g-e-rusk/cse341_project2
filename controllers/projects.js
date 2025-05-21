const mongodb = require('../database/database');
// const { ObjectId } = require('mongodb');

const getAllProjects = async (req, res) => {
    //#swagger.tags=['Projects']
    const result = await mongodb.getDatabase().db('taskManagement').collection('projects').find();
    result.toArray().then((projects) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(projects);
    });
};

const getSingleProject = async (req, res) => {
    //#swagger.tags=['Projects']
    try {
        const projectId = req.params.id;
        const result = await mongodb.getDatabase().db('taskManagement').collection('projects').findOne({ _id: projectId });

        if (!result) {
            return res.status(404).json({message: 'Project not found'});
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getTasksInProject = async (req, res) => {
    //#swagger.tags=['Tasks']
    try {
        const projectId = req.params.id;
        const tasks = await mongodb.getDatabase().db('taskManagement').collection('tasks').find({ projectId: projectId }).toArray();

        if (tasks.length === 0) {
            return res.status(200).json([]); 
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// const getProjectByUser = async (req, res) => {
//     //#swagger.tags=['Projects']

// };

// const createProject = async(req, res) => {
//     //#swagger.tags=['Projects']
//     const project = {
//         _id: req.body._id,
//         name: req.body.name,
//         description: req.body.description,
//         teamMembers: [req.body.teamMembers]
//     };
//     const response = await mongodb.getDatabase().db('taskManagement').collection('projects').insertOne(project);
//     if (response.acknowledged) {
//         res.status(201).send('Project created successfully.');
//     } else {
//         res.status(500).json(response.error || 'Some error occured while creating the contact.');
//     }
// };

// const updateProject = async(req, res) => {
//     //#swagger.tags=['Projects']
//     const userId = new ObjectId(req.params.id);
//     const contact = {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         favoriteColor: req.body.favoriteColor,
//         birthday: req.body.birthday
//     };
//     const response = await mongodb.getDatabase().db('taskManagement').collection('projects').replaceOne({ _id: userId }, contact);
//     if (response.modifiedCount > 0) {
//         res.status(204).end();
//     } else {
//         res.status(500).json(response.error || 'Some error occured while updating the contact.');
//     }
// };

// const deleteProject = async(req, res) => {
//     //#swagger.tags=['Projects']
//     const userId = new ObjectId(req.params.id);
//     const response = await mongodb.getDatabase().db('taskManagement').collection('projects').deleteOne({ _id: userId });
//     if (response.deletedCount > 0) {
//         res.status(204).end();
//     } else {
//         res.status(500).json(response.error || 'Some error occured while deleting the contact.');
//     }
// };

module.exports = { getAllProjects, getSingleProject, getTasksInProject };