import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Formik } from 'formik';

import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

function dateOnly(origin) {
  const localeString = new Date(Date.parse(origin)).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  return /^(\d+). (\d+). (\d+)/.test(localeString) ?
    `${RegExp.$1}-${RegExp.$2.length<2 ? `0${RegExp.$2}` : RegExp.$2}-${RegExp.$3.length<2 ? `0${RegExp.$3}` : RegExp.$3}`
  : ''; 
}

export default function StudentFormik({ trySending, name, birthday, gender, phone, email, address }) {
  return (
    <Formik
      initialValues={
        { name: name ?? '', birthday: dateOnly(birthday) ?? '', gender: gender ? `${gender}` :  '', phone: phone ?? '', email: email ?? '', address: address ?? '' }
      }
      validate={
        values => {
        const errors = {};
!values.name && (errors.name = '이름을 입력하세요.');
!(values.gender === '0' || values.gender === '1') && (errors.gender = '성별을 선택하세요.');
!values.birthday && (errors.birthday = '생년월일을 입력하세요.');
!/^\d{1,}/.test(values.phone) && (errors.phone = '- 없이 입력.');
//!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)    && (errors.email = '올바른 이메일 주소를 입력하세요.');
!values.address && (errors.address = '주소를 입력하세요.');
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
trySending(values);
          //alert(JSON.stringify(values, null, 2));
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
        error={errors.name && touched.name}
        autoComplete="no"
        type="text"
        label="이름"
        name="name"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.name}
        helperText={errors.name && touched.name && errors.name}
      />
      <TextField
        fullWidth
        error={errors.birthday && touched.birthday}
        autoComplete="no"
        type="date"
        label="생년월일"
        name="birthday"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.birthday}
        helperText={errors.birthday && touched.birthday && errors.birthday}
      />
      <FormControl component="fieldset" error={errors.gender && touched.gender}>
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
        <FormHelperText>{errors.gender && touched.gender}</FormHelperText>
      </FormControl>
      <TextField
        fullWidth
        error={errors.phone && touched.phone}
        autoComplete="no"
        type="text"
        label="전화번호"
        name="phone"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.phone}
        helperText={errors.phone && touched.phone && errors.phone}
      />
      <TextField
        fullWidth
        error={errors.email && touched.email}
        autoComplete="no"
        type="email"
        label="이메일"
        name="email"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.email}
        helperText={errors.email && touched.email && errors.email}
      />
      <TextField
        fullWidth
        error={errors.address && touched.address}
        autoComplete="no"
        type="text"
        label="주소"
        name="address"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.address}
        helperText={errors.address && touched.address && errors.address}
      />
      <TextField type="submit"></TextField>
      </form>
    </>
  );

}
