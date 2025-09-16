// swagger.js
require('dotenv').config();
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: { title: 'Glocation Projects API', version: '1.0.0' },
    servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
    components: {
      schemas: {
        Project: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Network Implementation' },
            description: { type: 'string', example: 'Deploy in Caldas' },
            status: { type: 'string', enum: ['IN_PROGRESS','FINALIZED'], example: 'IN_PROGRESS' },
            startDate: { type: 'string', format: 'date', example: '2025-09-20' },
            endDate: { type: 'string', format: 'date', example: '2025-12-15' },
          },
          required: ['name','description','startDate','endDate']
        },
        ProjectCreate: {
          allOf: [
            { $ref: '#/components/schemas/Project' },
            { type: 'object', required: ['name','description','startDate','endDate'] }
          ]
        },
        ProjectUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['IN_PROGRESS','FINALIZED'] },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' }
          }
        }
      }
    }
  },
  apis: ['./routes/projectRoutes.js'], // tus anotaciones @swagger en rutas
};

module.exports = swaggerJsdoc(options);
