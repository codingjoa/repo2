import React from 'react';
import General from './TextField';

export default function Main({initialDate}) {
  return (
    <>
      <h1>학생 추가</h1>
      <General
        name=""
        birthday=""
        gender=""
        phone=""
        email=""
        address=""
      />
    </>
  );
}
