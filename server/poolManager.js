const mariadb = require('mariadb');
const config = require('./poolConfig');
const pool = mariadb.createPool(config);

function transaction(queries, err) {
  // not stable
  pool.getConnection()
  .then(conn => {
    conn.beginTransaction()
    .then(() => {
      try {
        queries(conn);
      }
      catch(e) {
        throw e;
      }
      conn.commit();
    })
  })
  .catch(e => {
    conn.rollback();
    //err && err instanceof Function && err(e);
  });
}

module.exports = { pool, transaction };

async function end() {
  pool.end();
}
