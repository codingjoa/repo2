const router = require('express').Router();


/* @codingjoa
   기능 별 함수
*/
const addBilling = require('./addBilling');
const addLesson = require('./addLesson');
const addQuarter = require('./addQuarter');
const addRefund = require('./addRefund');
const addStudent = require('./addStudent');
const addTeacher = require('./addTeacher');
const authorization = require('./authorization');
const calculateProceeds = require('./calculateProceeds');
const closeLesson = require('./closeLesson');
const closeQuarter = require('./closeQuarter');
const closeStudent = require('./closeStudent');
const closeTeacher = require('./closeTeacher');
const deleteBilling = require('./deleteBilling');
const editQuarter = require('./editQuarter');
const editStudent = require('./editStudent');
const editStudentUniqueness = require('./editStudentUniqueness');
const editStudyForLesson = require('./editStudyForLesson');
const editTeacher = require('./editTeacher');
const fetchAvailableLesson = require('./fetchAvailableLesson');
const fetchAvailableQuarter = require('./fetchAvailableQuarter');
const fetchBilling = require('./fetchBilling');
const fetchEndedLessons = require('./fetchEndedLessons');
const fetchLessonDetails = require('./fetchLessonDetails');
const fetchLessonDetailsAdmin = require('./fetchLessonDetailsAdmin');
const fetchLessons = require('./fetchLessons');
const fetchLessonsOwn = require('./fetchLessonsOwn');
const fetchQuarters = require('./fetchQuarters');
const fetchRegisteredBilling = require('./fetchRegisteredBilling');
const fetchStudyForLesson = require('./fetchStudyForLesson');
const fetchStudentForLesson = require('./fetchStudentForLesson');
const fetchStudents = require('./fetchStudents');
const fetchStudentDetails = require('./fetchStudentDetails');
const fetchTeachers = require('./fetchTeachers');
const getAuthorizationInfo = require('./getAuthorizationInfo');
const isAuthorized = require('./isAuthorized');
const isAvailableLesson = require('./isAvailableLesson');
const isAvailableBilling = require('./isAvailableBilling');
const isCanBeClosedQuarter = require('./isCanBeClosedQuarter');
const isCanBeClosedTeacher = require('./isCanBeClosedTeacher');
const isCanBeClosedStudent = require('./isCanBeClosedStudent');
const isCanBeClosedLesson = require('./isCanBeClosedLesson');
const isEditableLesson = require('./isEditableLesson');
const isMaster = require('./isMaster');
const isOwnLesson = require('./isOwnLesson');
const isRetractableBilling = require('./isRetractableBilling');
const passwordCertification = require('./passwordCertification');
const passwordChange = require('./passwordChange');
const passwordModified = require('./passwordModified');
const passwordReset = require('./passwordReset');
const unauthorization = require('./unauthorization');


/* @codingjoa
   라우팅
*/
router.use('/teacher',
  isAuthorized
);
router.get('/teacher/lesson',
  fetchLessons
);
router.use('/teacher/lesson/:quarterID/:lessonMonth',
  isOwnLesson
);
router.get('/teacher/lesson/:quarterID/:lessonMonth',
  fetchLessonDetails
);
router.get('/teacher/lesson/:quarterID/:lessonMonth/study/:weekNum',
  fetchStudyForLesson
);
router.patch('/teacher/lesson/:quarterID/:lessonMonth/study/:weekNum',
  isEditableLesson,
  editStudyForLesson
);
router.get('/teacher/lesson/:quarterID/:lessonMonth/student',
  fetchStudentForLesson
);
router.get('/teacher/lesson/:quarterID/:lessonMonth/student/:studentID',
  fetchStudentDetails
);
router.put('/teacher/lesson/:quarterID/:lessonMonth/student/:studentID',
  isEditableLesson,
  editStudent
);
router.patch('/teacher/lesson/:quarterID/:lessonMonth/student/:studentID',
  isEditableLesson,
  editStudentUniqueness
);

router.patch('/account/edit',
  passwordCertification,
  passwordChange,
  passwordModified
);
/* @codingjoa
   계정
*/
router.get('/auth',
  isAuthorized,
  getAuthorizationInfo
);
router.post('/auth',
  passwordCertification,
  authorization
);
router.delete('/auth',
  isAuthorized,
  unauthorization
);

router.use('/admin',
  isAuthorized,
  isMaster
);
router.get('/admin/student',
  fetchStudents
);
router.post('/admin/student',
  addStudent
);
router.put('/admin/student/:studentID',
  editStudent
);
router.patch('/admin/student/:studentID',
  editStudentUniqueness
);
router.delete('/admin/student/:studentID',
  isCanBeClosedStudent,
  closeStudent
);
router.get('/admin/student/:studentID',
  fetchStudentDetails
);

router.get('/admin/quarter',
  fetchQuarters
);
router.post('/admin/quarter',
  addQuarter
);
router.put('/admin/quarter/:quarterID',
  editQuarter
);
router.delete('/admin/quarter/:quarterID',
  isCanBeClosedQuarter,
  closeQuarter
);

router.get('/admin/teacher',
  fetchTeachers
);
router.post('/admin/teacher',
  addTeacher,
  passwordReset
);
router.put('/admin/teacher/:teacherID',
  editTeacher
);
router.delete('/admin/teacher/:teacherID',
  isCanBeClosedTeacher,
  closeTeacher
);
router.patch('/admin/teacher/:teacherID',
  passwordReset,
  passwordModified
);

router.get('/admin/lesson/available',
  fetchAvailableLesson
);
router.post('/admin/lesson/:quarterID/:teacherID/:studySize',
  isAvailableLesson,
  addLesson
);
router.post('/admin/lesson/refund/:quarterID/:lessonMonth',
//  isCanBeClosedLesson,
  addRefund
);
router.get('/admin/lesson/details/:quarterID/:lessonMonth',
  fetchLessonDetailsAdmin
);
router.get('/admin/lesson/ended/:lessonMonth',
  fetchEndedLessons
);
router.put('/admin/lesson/:quarterID/:lessonMonth',
//  isCanBeClosedLesson,
  closeLesson
);
router.get('/admin/lesson',
  fetchLessonsOwn
);




router.get('/admin/billing/all/:lessonMonth',
  fetchBilling
);
router.get('/admin/billing/registered/:lessonMonth',
  fetchRegisteredBilling
);
router.get('/admin/billing/available/quarter/:lessonMonth',
  fetchAvailableQuarter
);
router.post('/admin/billing/:lessonMonth',
  isAvailableBilling,
  addBilling
);
router.delete('/admin/billing/:studentID/:lessonMonth',
  isRetractableBilling,
  deleteBilling
);

router.get('/admin/calculator/proceed/:lessonMonth/:lastMonth',
  calculateProceeds
);


module.exports = router;
