const mariadb = require('mariadb');
const config = require('./poolManager.config.js');
const pool = mariadb.createPool(config);
module.exports = { pool };
