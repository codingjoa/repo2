const router = require('express').Router();

const isAuthorized = require('../v1/isAuthorized');
const isMaster = require('../v1/isMaster');
//const calculateProceeds = require('./calculateProceeds');
const fetchProceeds = require('./fetchProceeds');
const fetchProceedsFromTo = require('./fetchProceedsFromTo');
//const fetchDeductions = require('./fetchDeductions');
const addProceeds = require('./addProceeds');
//const addDeductions = require('./addDeductions');
//const editProceeds = require('./editProceeds');
//const editDeductions = require('./editDeductions');
router.use('/teacher',
  isAuthorized
);
router.use('/admin',
  isAuthorized,
  isMaster
);
//router.get('/admin/calculator/proceed/:lessonMonth/:lastMonth',
//  calculateProceeds
//);
router.get('/admin/settlement/proceeds/:lessonMonth',
  fetchProceeds
);
router.get('/admin/settlement/proceeds/:lessonMonth/:lastMonth',
  fetchProceedsFromTo
);
router.post('/admin/settlement/proceeds/:lessonMonth',
  addProceeds
);
//router.put('/admin/settlement/proceeds/:lessonMonth',
//  editProceeds
//);
//router.get('/admin/settlement/deductions/:lessonMonth',
//  fetchDeductions
//);
//router.post('/admin/settlement/deductions/:lessonMonth',
//  addDeductions
//);
//router.put('/admin/settlement/deductions/:lessonMonth',
//  editDeductions
//);
module.exports = router;
