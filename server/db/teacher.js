

node -e "
const { on, EventEmitter } = require('events');
//const { pool } = re

function keyFilter(raw, allowed) {
  const filtered = Object.keys(raw)
  .filter(key =>
    allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = raw[key];
    return obj;
  }, {});
}

const obj = {  };
keyFilter(['id', 'name', 'password', 'account', 'op']);

"

const ee = new EventEmitter();
(() => {
  (async () => {
    for await (const [ value ] of on(ee, 'add'))
      pool.query();
      console.log(value);
  })();
  (async () => {
    for await (const [ value ] of on(ee, 'bar'))
      console.log(value);
  })();

})();
ee.emit('foo', 1);
ee.emit('bar', 3);
ee.emit('foo', 'discord');
ee.emit('foo', 11);
ee.emit('bar', 5);
"

.on('add', (pool, {}) => {
  

})
.on('del', (pool, id) => {})


'insert into teacher( teacherName, teacherAccount, teacherPassword, teacherOp ) values ( :teacherName, :teacherAccount, :teacherPassword, :teacherOp )'

{ id,  }
1002,
  '임시명',
  'temp',
  '1234',
  1
);
insert into quarter(
  teacherID
) values (
  1002
);
