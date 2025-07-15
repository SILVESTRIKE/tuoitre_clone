const winston = require('winston');
require('dotenv').config(); // Load env variables if not already loaded

const logDir = process.env.LOG_FILE_PATH || './logs/'; // Directory for logs
const logLevel = process.env.LOG_LEVEL || 'info';
const logFileNamePrefix = process.env.LOG_FILE_PATH || 'log_'; // Prefix for log files

// Ensure the log directory exists
const fs = require('fs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Define the log format
const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss' // Format for timestamp in log entries
    }),
    winston.format.errors({ stack: true }), // Log stack trace for errors
    winston.format.colorize(), // Colorize output
    winston.format.printf(
        // Custom format: [Timestamp] [Level] [File:Line] Message
        ({ timestamp, level, message, label, stack }) => {
            let logOutput = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
            if (stack) {
                logOutput += `\n${stack}`;
            }
            return logOutput;
        }
    )
);

// Create the logger instance
const logger = winston.createLogger({
    level: logLevel,
    format: logFormat,
    transports: [
        // Console transport for logging to stdout
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ all: true }), // Colorize console output
                winston.format.printf(
                    ({ timestamp, level, message, stack }) => {
                        let logOutput = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
                        if (stack) {
                            logOutput += `\n${stack}`;
                        }
                        return logOutput;
                    }
                )
            )
        }),

        // File transport for logging to files based on date
        new winston.transports.File({
            filename: `${logFileNamePrefix}${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.log`, // Format: log_YYYYMMDD.log
            format: winston.format.combine(
                winston.format.uncolorize(), // Ensure logs in file are not colorized
                winston.format.printf(
                    ({ timestamp, level, message, stack }) => {
                        let logOutput = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
                        if (stack) {
                            logOutput += `\n${stack}`;
                        }
                        return logOutput;
                    }
                )
            ),
            // Options for file rotation (e.g., max size, max files) could be added here if using a rotation transport
        }),
    ],
});

// Optional: If you want to use Winston with Morgan for HTTP logs
logger.stream = {
    write: function (message) {
        logger.info(message.substring(0, message.lastIndexOf('\n'))); // Log HTTP requests as info
    }
};

module.exports = logger;