import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Formik } from 'formik';

import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

export default function StudentFormik() {
  return (
    <Formik
      initialValues={
        { studentName: '', password: '' }
      }
      validate={
        values => {
/*
        const errors = {};
        if (!values.studentName) {
          errors.studentName = 'Required';
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.studentName = 'Invalid email address';
        }
        return errors;
*/
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {StudentForm}
    </Formik>
  );
}

function StudentForm({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) {
  return (
    <>
      <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        type="text"
        label="이름"
        name="studentName"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.studentName}
        helperText={errors.name && touched.name && errors.name}
      />
      <TextField
        fullWidth
        type="date"
        label="생년월일"
        name="studentBirthday"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.birthday}
        helperText={errors.birthday && touched.birthday && errors.birthday}
      />
      <FormControl component="fieldset">
        <FormLabel component="legend">성별</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender"
          value={values.gender}
          onChange={handleChange}
        >
          <FormControlLabel value="0" control={<Radio />} label="여자" />
          <FormControlLabel value="1" control={<Radio />} label="남자" />
        </RadioGroup>
      </FormControl>
      <TextField
        fullWidth
        type="text"
        label="전화번호"
        name="phone"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.phone}
      />
      <TextField
        fullWidth
        autoComplete="no"
        type="email"
        label="이메일"
        name="phone"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.email}
      />
      <TextField
        fullWidth
        type="text"
        label="주소"
        name="address"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.address}
        helperText={errors.address && touched.address && errors.address}
      />
      <Button
        component="submit"
        style={{ textAlign: 'center' }}
        variant="contained" 
      >
        학생 추가
      </Button>
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
      </form>
    </>
  );

}
