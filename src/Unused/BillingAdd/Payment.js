import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Page from '../../Templates/Page';
import { Context } from './Context';
function Payment({ payment, setPayment }) {
  const { handlePayment } = React.useContext(Context);
  return (
    <>
      카드로 결제함<Checkbox onChange={handlePayment} />
    </>
  );
}
function Group({ group, setGroup }) {
  const { pickedGroup, handleGroup } = React.useContext(Context);
  return (
    <>
      <FormControl component="fieldset">
        <FormLabel component="legend">그룹 여부</FormLabel>
        <RadioGroup value={pickedGroup} onChange={handleGroup}>
          <FormControlLabel value={0} control={<Radio />} label="개인" />
          <FormControlLabel value={1} control={<Radio />} label="그룹(2인 이상)" />
          <FormControlLabel value={2} control={<Radio />} label="그룹(5인 이상)" />
        </RadioGroup>
      </FormControl>
    </>
  );
}

export default () => {
  return (
    <>
      <Typography variant="subtitle1">
        등록 구분
      </Typography>
      <Page>
        <Payment />
        <Group />
      </Page>
    </>
  );
}
