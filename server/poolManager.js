const mariadb = require('mariadb');
const config = require('./poolManager.config.js');
const pool = mariadb.createPool(config);
const exportObj = {
  Boot,
  pool: null,
  end: null
};
async function Boot() {
  try {
    const pool = await mariadb.createPool(config);
    exportObj.pool = pool;
    exportObj.end = async () => {
      pool.end();
    }
  } catch(err) {
    console.error(err);
    return false;
  }
  return true;
}
module.exports = exportObj;
