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

module.exports = { getAllProjects, getSingleProject, getTasksInProject, getProjectByUser, createProject };