const { format, createLogger, transports, addColors } = require('winston');
const { timestamp, combine, printf, errors, colorize } = format;
const path = require("path");

const logPath = path.resolve(process.env.LOG_PATH);

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define colors for each log level
const customColors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
};

// Tell winston to use your custom colors
addColors(customColors);

function buildDevLogger() {
    const logFormat = printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} ${level}: ${stack || message}`;
    });

    return createLogger({
        levels: levels, // Ensure you have the right levels defined if you're customizing them
        format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            errors({ stack: true }),
            logFormat
        ),
        transports: [
            new transports.Console({
                level: 'info',
                format: combine(
                    colorize({
                        all: true, // Colorize the entire output
                        colors: customColors // Apply your custom colors
                    }),
                    logFormat
                )
            }),
            new transports.File({
                level: 'info',
                filename: logPath
            }),
        ],
    });
}

module.exports = buildDevLogger;
