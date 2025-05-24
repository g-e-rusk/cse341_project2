/* eslint-disable no-useless-catch */
const mongodb = require('./database/database');

const isValidId = (id) => {
    return typeof id === 'string' && id.trim().length > 0;
};

const checkResourceExists = async (collection, id, resourceType) => {
    try {

        if (!isValidId(id)) {
            throw new Error(`${resourceType} not found`);
        }

        const resource = await mongodb
            .getDatabase()
            .db('taskManagement')
            .collection(collection)
            .findOne({ _id: id });
 
        if (!resource) {
            throw new Error(`${resourceType} not found`);
        }
        return resource;
    } catch (error) {
        if (error.name === 'BSONError' || error.message.includes('BSON')) {
          throw new Error(`${resourceType} not found`);  
        }
        throw error;
    }
};


const handleErrorResponse = (error, res, resourceType = 'Resource') => {
    console.error("Error:", error);

    if (error.message === `${resourceType} not found`) {
        return res.status(404).json({ message: `${resourceType} not found`});
    }

    if (error.name === 'BSONError' || error.message.includes('BSON')) {
        return res.status(404).json({ message: `${resourceType} not found` });
    }

    if (error.code === 11000) {
        return res.status(409).json({ message: `${resourceType} already exists` });
    }

    res.status(500).json({ message: 'Internal server error' });
};

module.exports = { checkResourceExists, handleErrorResponse, isValidId };