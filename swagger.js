const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'API - Geri Rusk, Project 2 - CSE 341',
        description: 'CRUD Operations API',
    },
    host: 'cse341-project2-h740.onrender.com',
    schemes: ['https'],
};

const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js'];

//Generate swagger.json
swaggerAutogen(outputFile, endpointFiles, doc);