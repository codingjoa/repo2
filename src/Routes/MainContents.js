import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import { Root } from '../NavigationBar/Root';
import LessonView from '../Contents/LessonView/Main';
import LessonInfo from '../Contents/LessonInfo/Main';
import StudentList from '../Contents/StudentList/Main';
import Quarters from '../Contents/Quarters/Main';
import Teachers from '../Contents/Teachers/Main';

import Page from '../Templates/Page';
import Study from '../@codingjoa/Study';

export default function MainContents() {
  const { auth } = useContext(Root);
  return (
  <>
    <Route exact path="/">
      <LessonView />
    </Route>
    <Route exact path="/students">
      <StudentList />
    </Route>
    <Route exact path="/quarters">
      <Quarters />
    </Route>
    <Route exact path="/teachers">
      <Teachers />
    </Route>
    <Route exact path="/lesson/:quarterID/:lessonMonth">
      <Page>
        <LessonInfo />
      </Page>
    </Route>
    <Route exact path="/lesson/:quarterID/:lessonMonth/study/:weekNum">
      <Page>
        <Study />
      </Page>
    </Route>
  </>
  );
}
