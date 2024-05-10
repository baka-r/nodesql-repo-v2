const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');
const express = require('express');

const routePrefix = process.env.ROUTENAME || '';

const app = express();

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: process.env.SWAGGERDOCNAME || 'API Documentation',
        version: process.env.SWAGGERVERSION || '1.0.0',
        description: 'API documentation for your service.',
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    servers: [
        {
            url: '/',
        },
    ],
};

const specs = swaggerJsdoc({ swaggerDefinition, apis: ['./src/app/swagger/v1/*.js','./src/app/swagger/v2/*.js'] });

const modifySwaggerUi = (req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        const modifiedBody = body.replace(/baseURLChange/g, routePrefix);
        originalSend.call(this, modifiedBody);
    };
    next();
};

if (process.env.CLIENT_HOST === 'localhost' || process.env.CLIENT_HOST === 'production' || process.env.CLIENT_HOST === 'development') {
    app.use('/api-docs', modifySwaggerUi, swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
} else {
    const swaggerRoute = process.env.ROUTENAME || '';
    app.use('/' + swaggerRoute + '/api-docs', modifySwaggerUi, swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
}

app.use(bodyParser.urlencoded({ extended: true }));

module.exports = app;
