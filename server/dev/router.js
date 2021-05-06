const router = require('express').Router();

const isAuthorized = require('../v1/isAuthorized');
const isMaster = require('../v1/isMaster');
const fetchProceeds = require('./fetchProceeds');
const fetchProceedsFromTo = require('./fetchProceedsFromTo');
const fetchDeductions = require('./fetchDeductions');
const addProceeds = require('./addProceeds');
const addDeductions = require('./addDeductions');

router.use('/teacher',
  isAuthorized
);
router.use('/admin',
  isAuthorized,
  isMaster
);

// 정산
router.get('/admin/settlement/proceeds/:lessonMonth',
  fetchProceeds
);
router.get('/admin/settlement/proceeds/:lessonMonth/:lastMonth',
  fetchProceedsFromTo
);
router.post('/admin/settlement/proceeds/:lessonMonth',
  addProceeds
);
router.get('/admin/settlement/deductions/:lessonMonth',
  fetchDeductions
);
router.post('/admin/settlement/deductions/:lessonMonth',
  addDeductions
);
module.exports = router;
