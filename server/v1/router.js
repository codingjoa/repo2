const router = require('express').Router();
const passwordCertification = require('./passwordCertification');
const passwordChange = require('./passwordChange');
const passwordModified = require('./passwordModified');
const authorization = require('./authorization');
const unauthorization = require('./unauthorization');
const isAuthorized = require('./isAuthorized');
const getAuthorizationInfo = require('./getAuthorizationInfo');

const fetchLessons = require('./fetchLessons');
const fetchLessonDetails = require('./fetchLessonDetails');
const fetchStudyForLesson = require('./fetchStudyForLesson');
const isEditableLesson = require('./isEditableLesson');
const editStudyForLesson = require('./editStudyForLesson');

const fetchStudentForLesson = require('./fetchStudentForLesson');
const isOwnLesson = require('./isOwnLesson');

const isMaster = require('./isMaster');
const fetchStudents = require('./fetchStudents');
const fetchStudentDetails = require('./fetchStudentDetails');
const addStudent = require('./addStudent');
const editStudent = require('./editStudent');
const editStudentUniqueness = require('./editStudentUniqueness');
const fetchQuarters = require('./fetchQuarters');
const addQuarter = require('./addQuarter');
const editQuarter = require('./editQuarter');
const passwordReset = require('./passwordReset');
const fetchTeachers = require('./fetchTeachers');
const addTeacher = require('./addTeacher');
const editTeacher = require('./editTeacher');

const isCanBeClosedQuarter = require('./isCanBeClosedQuarter');
const closeQuarter = require('./closeQuarter');
const isCanBeClosedTeacher = require('./isCanBeClosedTeacher');
const closeTeacher = require('./closeTeacher');
const isCanBeClosedStudent = require('./isCanBeClosedStudent');
const closeStudent = require('./closeStudent');

const isCanBeClosedLesson = require('./isCanBeClosedLesson');
const closeLesson = require('./closeLesson');
const fetchLessonsOwn = require('./fetchLessonsOwn');
const fetchLessonDetailsAdmin = require('./fetchLessonDetailsAdmin');
const fetchAvailableLesson = require('./fetchAvailableLesson');
const isAvailableLesson = require('./isAvailableLesson');
const addLesson = require('./addLesson');
const fetchEndedLessons = require('./fetchEndedLessons');

const fetchAvailableQuarter = require('./fetchAvailableQuarter');
const fetchBilling = require('./fetchBilling');
const fetchRegisteredBilling = require('./fetchRegisteredBilling');
const isRetractableBilling = require('./isRetractableBilling');
const isAvailableBilling = require('./isAvailableBilling');
const addBilling = require('./addBilling');
const deleteBilling = require('./deleteBilling');

const addRefund = require('./addRefund');

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
router.post('/admin/lesson/:quarterID/:teacherID',
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


/* @codingjoa
   GET #세션 상태 확인
   POST #로그인
   DELETE #로그아웃
*/

module.exports = router;
