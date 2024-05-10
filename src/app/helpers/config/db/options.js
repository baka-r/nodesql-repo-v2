const commonPoolOptions = {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000
};

exports.dbConfig = {
    development: {
        host: process.env.DEV_DB_HOST,
        username: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB_NAME,
        dialect: 'mysql',
        pool: commonPoolOptions
    },
    production: {
        host: process.env.PRO_DB_HOST,
        port: process.env.PRO_DB_PORT,
        username: process.env.PRO_DB_USER,
        password: process.env.PRO_DB_PASSWORD,
        database: process.env.PRO_DB_NAME,
        dialect: 'mysql',
        pool: commonPoolOptions
    }
};