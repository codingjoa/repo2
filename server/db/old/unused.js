/*
function keyFilter(raw, allowed) {
  const filtered = Object.keys(raw)
  .filter(key =>
    allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = raw[key];
    return obj;
  }, {});
}
*/

const { on } = require('events');

module.exports = ((pool, ee) => {
  (async () => {
    for await (const [ value ] of on(ee, 'addTeacher')) {
      const r = await pool.query(
        {
          namedPlaceholders: true,
          sql: 'insert into teacher( teacherName, teacherAccount, teacherPassword, teacherOp ) values ( :teacherName, :teacherAccount, :teacherPassword, :teacherOp )'
        },
        value
      );
      ee.emit('fetch', value);
    }
  })();
  (async () => {
    for await (const [ value ] of on(ee, 'listTeacher')) {
      const r = await pool.query('select teacherID, teacherName, teacherCreated, teacherModified from teacher');
      ee.emit('end', null);
    }
  })();
  (async () => {
    for await (const [ value ] of on(ee, 'delete')) {
      const r = await pool.query('select * from teacher');
      console.log(r);
      ee.emit('end', null);
    }
  })();
  (async () => {
    for await (const [ value ] of on(ee, 'newPassword'))
      console.log(value);
  })();
  (async () => {
    for await (const [ value ] of on(ee, 'test'))
      console.log(value+9);
  })();
});

((pool, ee) => {
  (async () => {
    for await (const [ value ] of on(ee, ''))
      pool.end();
  })();
});
