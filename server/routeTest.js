const router = require('express').Router();
const fetchStudents = require('./db/fetchStudents');

const fetchQuarters = require('./db/fetchQuarters');
const addQuarter = require('./db/addQuarter');
const editQuarter = require('./db/editQuarter');
const deleteQuarter = require('./db/deleteQuarter');
const passwordReset = require('./db/passwordReset');

const fetchTeachers = require('./db/fetchTeachers');
const addTeacher = require('./db/addTeacher');
const editTeacher = require('./db/editTeacher');
const deleteTeacher = require('./db/deleteTeacher');

const fetchRetractableLessonCharge = require('./db/fetchRetractableLessonCharge');
const fetchRetractableBilling = require('./db/fetchRetractableBilling');
const fetchAvailableLessonCharge = require('./db/fetchAvailableLessonCharge');
const fetchAvailableBilling = require('./db/fetchAvailableBilling');
const isAvailableLesson = require('./db/isAvailableLesson');
const addLesson = require('./db/addLesson');

const isRetractableLessonCharge = require('./db/isRetractableLessonCharge');
const isRetractableBilling = require('./db/isRetractableBilling');
const isAvailableLessonCharge = require('./db/isAvailableLessonCharge');
const isAvailableBilling = require('./db/isAvailableBilling');
const addLessonCharge = require('./db/addLessonCharge');
const addBilling = require('./db/addBilling');
const deleteLessonCharge = require('./db/deleteLessonCharge');
const deleteBilling = require('./db/deleteBilling');

const isCanBeClosedLesson = require('./db/isCanBeClosedLesson');
const closeLesson = require('./db/closeLesson');
const fetchLessonsOwn = require('./db/fetchLessonsOwn');
const editBillingTypes = require('./db/editBillingTypes');


router.get('/fetch', fetchStudents);

router.get('/quarter', fetchQuarters);
router.post('/quarter', addQuarter);
router.put('/quarter/:quarterID', editQuarter);
router.delete('/quarter/:quarterID', deleteQuarter);

router.get('/teacher', fetchTeachers);
router.post('/teacher',
  addTeacher,
  passwordReset
);
router.put('/teacher/:teacherID', editTeacher);
router.delete('/teacher/:teacherID', deleteTeacher);

router.get('/lessonCharge/retractable', fetchRetractableLessonCharge);
router.get('/billing/retractable/', fetchRetractableBilling);

router.get('/lessonCharge/available', fetchAvailableLessonCharge);
router.get('/billing/available/', fetchAvailableBilling);
router.post('/lesson/:quarterID',
  isAvailableLesson,
  addLesson
);
router.post('/lessonCharge/:quarterID/:lessonMonth/:teacherID',
  isAvailableLessonCharge,
  addLessonCharge
);
router.post('/billing/:studentID/:lessonMonth/:quarterID',
  isAvailableBilling,
  addBilling
);
router.delete('/lessonCharge/:quarterID/:lessonMonth',
  isRetractableLessonCharge,
  deleteLessonCharge
);
router.delete('/billing/:studentID/:lessonMonth',
  isRetractableBilling,
  deleteBilling
);

router.put('/lesson/:quarterID/:lessonMonth',
//  isCanBeClosedLesson,
  closeLesson
);
router.get('/lesson', fetchLessonsOwn);
router.patch('/billing', editBillingTypes);






module.exports = router;
