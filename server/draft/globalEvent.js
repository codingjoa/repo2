const { EventEmitter } = require('events');
const globalEvent = new EventEmitter();
module.exports = globalEvent;
