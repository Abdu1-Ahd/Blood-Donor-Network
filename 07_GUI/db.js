const oracledb = require('oracledb');
require('dotenv').config();

// Ensure output is in JSON format (not array-based)
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function initDbPool() {
    try {
        // Enable Thick mode for older Oracle DB versions (e.g., 11g XE)
        oracledb.initOracleClient();
        await oracledb.createPool({
            user: process.env.DB_USER || 'system',
            password: process.env.DB_PASS || 'oracle',
            connectString: process.env.DB_HOST || 'localhost:1521/XE',
            poolMin: 2,
            poolMax: 10,
            poolIncrement: 1
        });
        console.log('Oracle DB connection pool initialized.');
    } catch (err) {
        console.error('initDbPool error:', err);
        throw err;
    }
}

async function getConnection() {
    try {
        const connection = await oracledb.getConnection();
        return connection;
    } catch (err) {
        console.error('getConnection error:', err);
        throw err;
    }
}

module.exports = {
    initDbPool,
    getConnection
};
