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




// 그외
/*
router.patch('/teacher/lesson/:quarterID/:lessonMonth/student/:studentID/billing/price',
  isEditableLesson,
  editBilling
);
*/



const editQuarterStudents = require('./editQuarterStudents'); // 1.5 or later
router.post('/teacher/students/:quarterID',
  editQuarterStudents
);
const deleteQuarterStudent = require('./deleteQuarterStudent'); // 1.5 or later
router.delete('/teacher/student/:studentID',
  deleteQuarterStudent
);

module.exports = router;
