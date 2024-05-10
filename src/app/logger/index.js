const buildDevLogger = require('./dev-Logger');
const buildProdLogger = require('./prod-Logger');

let logger;
if (process.env.NODE_ENV === 'development') {
    logger = buildDevLogger();
} else {
    logger = buildProdLogger();
}

module.exports = logger;
