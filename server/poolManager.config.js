const host = 'localhost';
const port = process.env.MARIADB_PORT ?? 3306;
const user = 'ky';
const database = process.env.MARIADB_NAME ?? 'v1';
const password = '1234';
const connectionLimit = 5;

module.exports = {
  host,
  port,
  user,
  database,
  password,
  connectionLimit
};
