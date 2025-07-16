const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'News API',
            version: '1.0.0',
            description: 'API documentation for the News Application',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}/api`, // Use the port from .env
                description: 'Development server',
            },
        ],
        // Add security schemes if needed (e.g., for JWT)
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: "Enter JWT token with 'Bearer <token>' format",
                },
            },
        },
        // You can define schemas here for request/response bodies if not using JSDoc in controllers
    },
    apis: ['./routes/*.js'], // Scan all files in the routes directory for JSDoc definitions
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;