import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Page from '../../Templates/Page';
import { Context } from './Context';
function Manual() {
  const { price, handlePrice } = React.useContext(Context);
  return (
    <>
      <TextField
        variant="outlined"
        type="number"
        value={price}
        onChange={handlePrice}
      />
    </>
  );
}
function Automatic() {
  const { price } = React.useContext(Context);
  return (
    <>
      <Typography variant="h3">
        {price}원
      </Typography>
    </>
  );
}

export default () => {
  const { handleNext } = React.useContext(Context);
  const [ mode, setMode ] = React.useState(1);
  const handleMode = e => {
    setMode(e.target.value - 0)
  };
  return (
    <>
      <Typography variant="subtitle1">
        수업료
      </Typography>
      <Page>
        <FormControl component="fieldset">
          <RadioGroup value={mode} onChange={handleMode}>
            <FormControlLabel disabled value={0} control={<Radio />} label="자동" />
            <FormControlLabel value={1} control={<Radio />} label="직접 입력" />
          </RadioGroup>
        </FormControl>
        {mode === 0 && <Automatic />}
        {mode === 1 && <Manual />}
        <Button onClick={handleNext}>
          등록
        </Button>
      </Page>
    </>
  );
}
