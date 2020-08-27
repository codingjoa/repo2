const db = require('./db');

db.plak.list().then(console.log, console.error).then(db.end, db.end);
