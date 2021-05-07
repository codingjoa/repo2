const router = require('express').Router();


/* @codingjoa
   기능 별 함수
*/
const addBilling = require('./addBilling'); // 1.5 Patch
const addBillingMiddle = require('./addBillingMiddle'); // 1.5 or later
const addLesson = require('./addLesson'); // 1.5 Patch
const addQuarter = require('./addQuarter');
const addStudent = require('./addStudent');
const addTeacher = require('./addTeacher');
const authorization = require('./authorization');
const closeLesson = require('./closeLesson');
const closeQuarter = require('./closeQuarter');
const closeStudent = require('./closeStudent');
const closeTeacher = require('./closeTeacher'); // Dev
const deleteBilling = require('./deleteBilling');
const deleteLesson = require('./deleteLesson');
const deleteQuarterStudent = require('./deleteQuarterStudent'); // 1.5 or later
const editBilling = require('./editBilling'); // 1.5 or later
const editBillingMiddle = require('./editBillingMiddle'); // 1.5 or later
const editQuarter = require('./editQuarter');
const editQuarterCoach = require('./editQuarterCoach'); // 1.5 or later
const editQuarterStudents = require('./editQuarterStudents'); // 1.5 or later
const editStudent = require('./editStudent');
const editStudentUniqueness = require('./editStudentUniqueness');
const editStudyForLesson = require('./editStudyForLesson');
const editTeacher = require('./editTeacher');
const fetchAvailableBillingRange = require('./fetchAvailableBillingRange'); // 1.5 or later
const fetchAvailableLesson = require('./fetchAvailableLesson');
const fetchBilling = require('./fetchBilling'); // 1.5 Patch
const fetchBillingRefunds = require('./fetchBillingRefunds'); // 1.5 Patch
const fetchIndependentStudents = require('./fetchIndependentStudents'); // 1.5 or later
const fetchLessonDetails = require('./fetchLessonDetails');
const fetchLessonDetailsAdmin = require('./fetchLessonDetailsAdmin');
const fetchLessons = require('./fetchLessons');
const fetchLessonsOwn = require('./fetchLessonsOwn');
const fetchMyQuarters = require('./fetchMyQuarters'); // 1.5 or later
const fetchQuarters = require('./fetchQuarters');
const fetchRecentBilling = require('./fetchRecentBilling'); // 1.5 or later
const fetchStudyForLesson = require('./fetchStudyForLesson');
const fetchStudentForLesson = require('./fetchStudentForLesson');
const fetchStudents = require('./fetchStudents');
const fetchStudentDetails = require('./fetchStudentDetails');
const fetchStudentUnpaids = require('./fetchStudentUnpaids');
const fetchTeachers = require('./fetchTeachers');
const fetchTeacherProceeds = require('./fetchTeacherProceeds');
const fetchWaitLessons = require('./fetchWaitLessons'); // 1.5 or later
const getAuthorizationInfo = require('./getAuthorizationInfo');
const isAuthorized = require('./isAuthorized');
const isCanBeClosedQuarter = require('./isCanBeClosedQuarter');
const isCanBeClosedTeacher = require('./isCanBeClosedTeacher');
const isCanBeClosedStudent = require('./isCanBeClosedStudent');
const isCanBeClosedLesson = require('./isCanBeClosedLesson');
const isEditableLesson = require('./isEditableLesson');
const isMaster = require('./isMaster');
const isOwnLesson = require('./isOwnLesson');
const isOwnQuarter = require('./isOwnQuarter');
const isOwnStudent = require('./isOwnStudent');
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
router.get('/teacher/quarter',
  fetchMyQuarters
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
router.get('/teacher/students',
  fetchIndependentStudents
);
router.post('/teacher/students/:quarterID',
  isOwnQuarter,
  editQuarterStudents
);
router.delete('/teacher/student/:studentID/quarter',
  isOwnStudent,
  deleteQuarterStudent
);
router.post('/teacher/student/:quarterID',
  isOwnQuarter,
  addStudent
);
router.put('/teacher/student/:studentID',
  isOwnStudent,
  editStudent
);
router.patch('/teacher/student/:studentID',
  isOwnStudent,
  editStudentUniqueness
);
/*
router.post('/teacher/students/:quarterID',
  이 학생의 반이 내 담당 반인지 확인하는 절차,
  editQuarterstudents
);
*/

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
router.get('/admin/student/unpaid',
  fetchStudentUnpaids
);
router.post('/admin/student',
  addStudent
);
router.post('/admin/students/:quarterID',
  editQuarterStudents
);
router.delete('/admin/student/:studentID/quarter',
  deleteQuarterStudent
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
router.patch('/admin/quarter/:quarterID',
  editQuarterCoach
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
router.post('/admin/lesson/:quarterID',
  addLesson
);
router.get('/admin/lesson/details/:quarterID/:lessonMonth',
  fetchLessonDetailsAdmin
);
router.get('/admin/lesson/wait/:lessonMonth',
  fetchWaitLessons
);
router.put('/admin/lesson/:quarterID/:lessonMonth',
//  isCanBeClosedLesson,
  closeLesson
);
router.delete('/admin/lesson/:quarterID/:lessonMonth',
  deleteLesson
);
router.get('/admin/lesson',
  fetchLessonsOwn
);

router.get('/admin/billing/refunds/:lessonMonth',
  fetchBillingRefunds
);
router.post('/admin/billing/:studentID',
  addBilling
);
router.get('/admin/billing/:studentID/available',
  fetchAvailableBillingRange
);
router.get('/admin/billing/:studentID/recent',
  fetchRecentBilling
);
router.get('/admin/billing/:studentID/:lessonMonth',
  fetchBilling
);
router.put('/admin/billing/:studentID/:lessonMonth',
  editBilling
);
router.patch('/admin/billing/:studentID/:lessonMonth',
  editBillingMiddle
);
router.delete('/admin/billing/:studentID/:lessonMonth',
  isRetractableBilling,
  deleteBilling
);
router.post('/admin/billing/:studentID/:lessonMonth/middle',
  addBillingMiddle
);

router.get('/admin/calculator/proceed/:lessonMonth',
  fetchTeacherProceeds
);

module.exports = router;
