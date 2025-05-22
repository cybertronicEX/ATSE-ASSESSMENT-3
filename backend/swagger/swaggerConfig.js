// swagger/swaggerConfig.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "ATSE Assessment 3 API",
            version: "1.0.0",
            description: "Documentation for ATSE Assessment 3 backend",
        },

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./routes/*.js", "./controllers/*.js"], // Adjust this if your routes are elsewhere
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
