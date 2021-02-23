import React from 'react';
import { Route } from 'react-router-dom';
import BillingList from './BillingList/Main';
import Calculator from './Calculator/Main';
import DeductionsEditor from './DeductionsEditor/Main';
import LessonChargeList from './LessonChargeList/Main';
import LessonChargeRegister from './LessonChargeRegister/Main';
import LessonDetailsAdmin from './LessonDetailsAdmin/Main';
import LessonEndedList from './LessonEndedList/Main';
import LessonEndRefund from './LessonEndRefund/Main';
import LessonEndReview from './LessonEndReview/Main';
import LessonListAdmin from './LessonListAdmin/Main';
import QuarterList from './QuarterList/Main';
import StudentAdd from './StudentAdd/Main';
import StudentDetails from './StudentDetails/Main';
import StudentList from './StudentList/Main';
import TeacherAdd from './TeacherAdd/Main';
import TeacherList from './TeacherList/Main';
export default () => (
  <>
    <Route exact path="/admin/billing">
      <BillingList />
    </Route>
    <Route exact path="/admin/calculator">
      <Calculator />
    </Route>
    <Route exact path="/admin/settle">
      <DeductionsEditor />
    </Route>
    <Route exact path="/admin/lessonCharge">
      <LessonChargeList />
    </Route>
    <Route exact path="/admin/lessonCharge/add/:quarterID">
      <LessonChargeRegister />
    </Route>
    <Route exact path="/admin/lesson/detail/:quarterID/:lessonMonth">
      <LessonDetailsAdmin />
    </Route>
    <Route exact path="/admin/lessonEnded">
      <LessonEndedList />
    </Route>
    <Route exact path="/admin/lessonEnd/refundReason">
      <LessonEndRefund />
    </Route>
    <Route exact path="/admin/lessonEnd/review">
      <LessonEndReview />
    </Route>
    <Route exact path="/admin/lesson">
      <LessonListAdmin />
    </Route>
    <Route exact path="/admin/quarter">
      <QuarterList />
    </Route>
    <Route exact path="/admin/student/add">
      <StudentAdd />
    </Route>
    <Route exact path="/admin/student/detail/:studentID">
      <StudentDetails />
    </Route>
    <Route exact path="/admin/student">
      <StudentList />
    </Route>
    <Route exact path="/admin/teacher/add">
      <TeacherAdd />
    </Route>
    <Route exact path="/admin/teacher">
      <TeacherList />
    </Route>
  </>
);
