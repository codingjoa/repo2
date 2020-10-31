import React from 'react';
import { Route } from 'react-router-dom';
import LessonTab from '../Contents/LessonTab/Main';

export default function() {
  return (
    <Route path="/lesson/detail/:quarterID/:lessonMonth">
      <LessonTab />
    </Route>
  );
}
