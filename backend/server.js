
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const articleRoutes = require('./src/routes/articleRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const errorHandler = require('./src/exception/errorHandler');
const logger = require('./logging/logger');
const crawlData = require('./src/jobs/newsCrawlerJob');
const connectDB = require('./src/config/db');
const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);

if (process.env.NODE_ENV !== 'production') {

    app.use(process.env.SWAGGER_URL || '/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    logger.info(`Swagger docs available at ${process.env.SWAGGER_URL || '/api-docs'}`);
}

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

app.use(errorHandler);
//newsCrawlerJob.start();

const PORT = process.env.PORT;

const startServer = async () => {
    try {
        await connectDB();
        await crawlData.startCrawl();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));
    } catch (err) {
        console.error('Không thể khởi động server:', err);
    }
};

startServer();