import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Form from './Form';

export default () => {
  const location = useLocation();
  const history = useHistory();
  const {
    quarterID,
    lessonMonth,
    refundBilling
  } = location?.state ?? {};
  const goNext = p => {
    history.push({
      pathname: '/admin/lessonEnd/review',
      state: {
        quarterID,
        lessonMonth,
        p
      }
    });
  };
  return (
    <>
      {quarterID && lessonMonth && refundBilling && 
        <Form list={refundBilling} callback={goNext}/>
      }
    </>
  );

}
