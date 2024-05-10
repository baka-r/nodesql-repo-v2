const Sequelize = require('sequelize');
const mysql2 = require('mysql2');

let { dbConfig } = require('../../helpers/config/db/options');

dbConfig = process?.env?.NODE_ENV === "development" ?
    dbConfig?.development :
    dbConfig?.production;


exports.sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectModule: mysql2,
    pool: dbConfig.pool
}
);

exports.connectToDb = async () => {
    try {
        await exports.sequelize.authenticate();
        console.log(`Connected to ${dbConfig.database} Db`);
        return true;
    } catch (error) {
        console.error(`Error while connecting to ${dbConfig.database} Db:`, error.message);
        return false;
    }
};