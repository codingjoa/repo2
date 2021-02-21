const { pool } = require('../poolManager');
const createTeacherLeavingQuery = (
`create table if not exists teacherLeaving (
  teacherID int unsigned not null,
  teacherJoined timestamp null,
  teacherLeaved timestamp null,
  foreign key (teacherID) references teacher(teacherID) on update cascade
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

async function setup(
  
) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const result = await conn.query(createTeacherLeavingQuery);
    console.log(result);
  } catch(err) {
    console.error(err);
  }
  await conn.rollback();
  await conn.release();
  
}

module.id === require.main.id && (async () => {
  await setup();
  pool.end();
})();
