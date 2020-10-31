import React from 'react';
import { Context } from './Context';
import Month from './Month';
import Payment from './Payment';
import Price from './Price';

export default ({ available }) => {
  return (
    <>
      <Month available={available} />
      <Payment />
      <Price />
    </>
  );
}
