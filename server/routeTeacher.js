const router = require('express').Router();
const fetchLessons = require('./db/fetchLessons');
const fetchLessonInfo = require('./db/fetchLessonInfo');
const fetchStudyForLesson = require('./db/fetchStudyForLesson');
const isEditableLesson = require('./db/isEditableLesson');
const editStudyForLesson = require('./db/editStudyForLesson');
const fetchStudentForLesson = require('./db/fetchStudentForLesson');
const isOwnLesson = require('./db/isOwnLesson');

router.get('/lesson/', fetchLessons);
router.get('/lesson/:quarterID/:lessonMonth', fetchLessonInfo);
router.get('/lesson/:quarterID/:lessonMonth/study/:weekNum', fetchStudyForLesson);
router.patch('/lesson/:quarterID/:lessonMonth/study/:weekNum',
  isEditableLesson,
  editStudyForLesson
);
router.get('/lesson/:quarterID/:lessonMonth/students',
//  isOwnLesson,
  fetchStudentForLesson
);

module.exports = router;
