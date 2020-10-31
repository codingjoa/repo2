import React from 'react';
import Typography from '@material-ui/core/Typography';
import Page from '../../Templates/Page';

export default ({ list }) => {
  return (
    <>
      <Typography variant="subtitle1">
        계산 결과
      </Typography>
      <Page>
        {list && list.map(({teacherName, lessonProceed, lessonRefund}) => <>
          {teacherName} 선생님 딤당 수업 ...개 반
          <Typography variant="subtitle2">
            입금했던 수업료 
          </Typography>
          <Typography variant="h5" color="primary">
            {lessonProceed}원
          </Typography>
          <Typography variant="subtitle2">
            환급/이월된 수업료 
          </Typography>
          <Typography variant="h5" color="secondary">
            {lessonRefund}원
          </Typography>
        </>)}
      </Page>
    </>
  );
}
