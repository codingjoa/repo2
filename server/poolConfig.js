const isDev = process.env.DEV ?? 0;

const host = 'localhost';
const user = 'ky';
const database = isDev ? 'ky' : 'v1';
const password = '1234';
const connectionLimit = 5;

module.exports = {
  host,
  user,
  database,
  password,
  connectionLimit
};
