import React from 'react';
import { useLocation } from 'react-router-dom';
import Form from './Form';
import Complete from './Complete';

export default () => {
  const location = useLocation();
  return (
    <>
      {location.state?.complete ?
        <Complete /> :
        <Form />
      }
    </>
  );
}
