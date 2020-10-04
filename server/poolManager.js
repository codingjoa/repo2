const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'ky',
  database: 'ky',
  password: '1234',
  connectionLimit: 5
});

module.exports = { pool };

async function end() {
  pool.end();
}
