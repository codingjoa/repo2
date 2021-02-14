import React from 'react';
import { Route } from 'react-router-dom';
import ChangeMyPassword from './ChangeMyPassword/Main';
import LessonDetails from './LessonDetails/Main';
import LessonList from './LessonList/Main';
import LessonStudentDetails from './LessonStudentDetails/Main';
import Study from './Study';
export default () => (
  <>
    <Route exact path="/account/password">
      <ChangeMyPassword />
    </Route>
    <Route exact path="/lesson/detail/:quarterID/:lessonMonth">
      <LessonDetails />
    </Route>
    <Route exact path="/">
      <LessonList />
    </Route>
    <Route exact path="/lesson/detail/:quarterID/:lessonMonth/student/:studentID">
      <LessonStudentDetails />
    </Route>
    <Route exact path="/lesson/detail/:quarterID/:lessonMonth/study/:weekNum">
      <Study />
    </Route>
  </>
);
