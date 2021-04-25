import React from 'react';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

export default function({
  billingScholarshipCodeTag,
  useHandlar,
  useHandlarCheckbox,
  values
}) {
  const onlyNumberMax = value => {
    const validateValue = value;
    let newValue = 0;
    const maxValue = (values.billingPrice) - 0;
    // 음수 => 0으로 만드는 코드
    if(/^-\d/.test(validateValue)) newValue = 0
    // input value로 들어온 문자열을 숫자로 바꾸는 코드
    else if(/^\d/.test(validateValue)) newValue = validateValue - 0;
    // 소수점 제거 코드
    newValue = Math.floor(newValue);
    if(newValue > maxValue) {
      newValue = maxValue;
    }
    return `${newValue}`;
  }
  return (
    <>
      <Box
        alignItems="center"
        display="flex"
        m={1}
      >
        <Box>
          <Typography
            variant="subtitle2"
          >
            환불
          </Typography>
          <Checkbox {...useHandlarCheckbox('billingRefundRegCode')} />
        </Box>
        <Box
          flexGrow={1}
        >
          <TextField
            disabled={!(values.billingRefundRegCode === 1) || (billingScholarshipCodeTag.checked === 1)}
            fullWidth
            label="환불된 수업료"
            size="small"
            type="number"
            variant="outlined"
            {...useHandlar('billingRefundPrice', onlyNumberMax)}
          />
        </Box>
      </Box>
      <Box
        flexShrink={1}
        m={1}
      >
        <OutlinedInput
          disabled={!(values.billingRefundRegCode === 1) || (billingScholarshipCodeTag.checked === 1)}
          fullWidth
          margin="dense"
          placeholder="환불/이월 사유"
          {...useHandlar('billingRefundReason')}
        />
      </Box>
    </>
  );
}
