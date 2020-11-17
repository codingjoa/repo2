const router = require('express').Router();

const isAuthorized = require('../v1/isAuthorized');
const isMaster = require('../v1/isMaster');
router.use('/admin',
  isAuthorized,
  isMaster
);

module.exports = router;
