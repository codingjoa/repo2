import React from 'react';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
function onlyNumber(value) {
  const validateValue = value;
  let newValue = 0;
  // 음수 => 0으로 만드는 코드
  if(/^-\d/.test(validateValue)) newValue = 0
  // input value로 들어온 문자열을 숫자로 바꾸는 코드
  else if(/^\d/.test(validateValue)) newValue = validateValue - 0;
  // 소수점 제거 코드
  newValue = Math.floor(newValue);
  return `${newValue}`;
}

export default ({
  billingScholarshipCodeTag,
  useHandlar,
  useHandlarCheckbox,
  values
}) => {
  return (
  <>
    <Box
      alignItems="center"
      display="flex"
      m={1}
    >
      <Box
        ml={1}
      >
        <Typography
          variant="subtitle2"
        >
          전액장학
        </Typography>
        <Checkbox {...billingScholarshipCodeTag} />
      </Box>
      <Box
        ml={1}
      >
        <Typography
          variant="subtitle2"
        >
          특수
        </Typography>
        <Checkbox {...useHandlarCheckbox('billingTaxCode')} />
      </Box>
      <Box
        flexGrow={1}
      >
        <TextField
          disabled={billingScholarshipCodeTag.checked === 1}
          fullWidth
          label="납입한 수업료"
          size="small"
          type="number"
          variant="outlined"
          {...useHandlar('billingPrice', onlyNumber)}
        />
      </Box>
    </Box>
    <Box
      m={1}
    >
      <TextField
        fullWidth
        label="그룹 여부"
        select
        size="small"
        variant="outlined"
        {...useHandlar('billingGroup')}
      >
        <MenuItem value={0} key={0}>
          개인 레슨
        </MenuItem>
        <MenuItem value={1} key={1}>
          그룹 레슨(2~4인)
        </MenuItem>
        <MenuItem value={2} key={2}>
          그룹 레슨(5~6인)
        </MenuItem>
      </TextField>
    </Box>
    <Box
      m={1}
    >
      <TextField
        fullWidth
        label="결제 수단"
        select
        size="small"
        variant="outlined"
        {...useHandlar('billingPayment')}
      >
        <MenuItem value={0} key={0}>
          현금(계좌이체)
        </MenuItem>
        <MenuItem value={1} key={1}>
          카드(신용/체크)
        </MenuItem>
      </TextField>
    </Box>
  </>
  );
}
