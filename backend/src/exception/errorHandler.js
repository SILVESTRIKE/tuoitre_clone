const { ValidationError } = require('express-validation');

function errorHandler(err, req, res, next) {
    // Validation errors
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
            error: 'Validation Error',
            details: err.details,
        });
    }

    // Custom application errors
    if (err.statusCode && err.message) {
        return res.status(err.statusCode).json({
            error: err.message,
            details: err.details || null,
        });
    }

    // JWT errors
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Invalid token',
        });
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Database Validation Error',
            details: err.errors,
        });
    }

    // Not found
    if (err.status === 404) {
        return res.status(404).json({
            error: 'Resource not found',
        });
    }

    // Default to 500 server error
    console.error(err);
    return res.status(500).json({
        error: 'Internal Server Error',
    });
}

module.exports = errorHandler;