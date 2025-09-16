const express = require("express");
const app = express();
require("dotenv").config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const cors = require('cors');


app.use(express.json());
app.use('/api-docs.json', (_req, res) => res.json(swaggerSpec)); 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); 

app.use(cors({
  origin: 'http://localhost:3001', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const port = process.env.PORT || 5000;

//Projects routes
app.use('/api/projects', require("./routes/projectRoutes"));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});