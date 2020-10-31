const dev = {
  host: 'localhost',
  user: 'ky',
  database: 'ky',
  password: '1234',
  connectionLimit: 5
};
const release = {
  host: 'localhost',
  user: 'ky',
  database: 'v1',
  password: '1234',
  connectionLimit: 5
};

module.exports = {
  dev,
  release
};
