import React from 'react';
import { Root } from '../BaseForm/Root';
import { Route } from 'react-router-dom';

import BillingList from '../Contents/BillingList/Main';
import Calculator from '../Contents/Calculator/Main';
import ChangeMyPassword from '../Contents/ChangeMyPassword/Main';
import LessonChargeList from '../Contents/LessonChargeList/Main';
import LessonChargeRegister from '../Contents/LessonChargeRegister/Main';
import LessonDetails from '../Contents/LessonDetails/Main';
import LessonDetailsAdmin from '../Contents/LessonDetailsAdmin/Main';
import LessonEndRefund from '../Contents/LessonEndRefund/Main';
import LessonEndReview from '../Contents/LessonEndReview/Main';
import LessonList from '../Contents/LessonList/Main';
import LessonListAdmin from '../Contents/LessonListAdmin/Main';
import LessonStudentDetails from '../Contents/LessonStudentDetails/Main';
import QuarterList from '../Contents/QuarterList/Main';
import StudentAdd from '../Contents/StudentAdd/Main';
import StudentDetails from '../Contents/StudentDetails/Main';
import StudentList from '../Contents/StudentList/Main';
import Study from '../@codingjoa/Study';
import TeacherAdd from '../Contents/TeacherAdd/Main';
import TeacherList from '../Contents/TeacherList/Main';

export default function MainContents() {
  const { auth } = React.useContext(Root);
  return (
  <>
    <Route exact path="/">
      <LessonList />
    </Route>

    <Route exact path="/account/password">
      <ChangeMyPassword />
    </Route>
    <Route exact path="/admin/student">
      <StudentList />
    </Route>
    <Route exact path="/admin/student/detail/:studentID">
      <StudentDetails />
    </Route>
    <Route exact path="/admin/teacher">
      <TeacherList />
    </Route>
    <Route exact path="/admin/teacher/add">
      <TeacherAdd />
    </Route>
    <Route exact path="/admin/quarter">
      <QuarterList />
    </Route>
    <Route exact path="/admin/billing">
      <BillingList />
    </Route>
    <Route exact path="/admin/lessonCharge">
      <LessonChargeList />
    </Route>
    <Route exact path="/admin/lesson">
      <LessonListAdmin />
    </Route>

    <Route exact path="/admin/lessonCharge/add/:quarterID">
      <LessonChargeRegister />
    </Route>
    <Route exact path="/admin/lesson/detail/:quarterID/:lessonMonth">
      <LessonDetailsAdmin />
    </Route>
    <Route exact path="/admin/lessonEnd/refundReason">
      <LessonEndRefund />
    </Route>
    <Route exact path="/admin/lessonEnd/review">
      <LessonEndReview />
    </Route>
    <Route exact path="/admin/student/add">
      <StudentAdd />
    </Route>
    <Route exact path="/admin/calculator">
      <Calculator />
    </Route>




    <Route exact path="/admin/student/detail/:studentID">

    </Route>
    <Route exact path="/lesson/detail/:quarterID/:lessonMonth">
      <LessonDetails />
    </Route>
    <Route exact path="/lesson/detail/:quarterID/:lessonMonth/study/:weekNum">
      <Study />
    </Route>
    <Route exact path="/lesson/detail/:quarterID/:lessonMonth/student/:studentID">
      <LessonStudentDetails />
    </Route>


  </>
  );
}
