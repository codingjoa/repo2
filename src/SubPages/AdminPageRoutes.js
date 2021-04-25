import React from 'react';
import { Route } from 'react-router-dom';
import BillingAdd from './BillingAdd/Main';
import BillingEditor from './BillingEditor/Main';
import BillingList from './BillingList/Main';
import Calculator from './Calculator/Main';
import DeductionsEditor from './DeductionsEditor/Main';
import LessonChargeRegister from './LessonChargeRegister/Main';
import LessonDetailsAdmin from './LessonDetailsAdmin/Main';
import LessonRegister from './LessonRegister/Main';
import ManageLessons from './ManageLessons/Main';
import QuarterList from './QuarterList/Main';
import StudentAdd from './StudentAdd/Main';
import StudentDetails from './StudentDetails/Main';
import StudentList from './StudentList/Main';
import TeacherAdd from './TeacherAdd/Main';
import TeacherList from './TeacherList/Main';
export default () => (
  <>
    <Route exact path="/test/billing/:studentID/:lessonMonth">
      <BillingEditor />
    </Route>
    <Route exact path="/test/billing/:studentID">
      <BillingAdd />
    </Route>
    <Route exact path="/admin/billing">
      <BillingList />
    </Route>
    <Route exact path="/admin/calculator">
      <Calculator />
    </Route>
    <Route exact path="/admin/settle">
      <DeductionsEditor />
    </Route>
    <Route exact path="/admin/lessonCharge/:quarterID">
      <LessonChargeRegister />
    </Route>
    <Route exact path="/admin/lesson/detail/:quarterID/:lessonMonth">
      <LessonDetailsAdmin />
    </Route>
    <Route exact path="/admin/lesson">
      <ManageLessons />
    </Route>
    <Route exact path="/admin/lesson/add/:quarterID">
      <LessonRegister />
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
