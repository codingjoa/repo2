import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Page from '../../Templates/Page';
import Close from './Close';
export default ({
  studentName, studentNameDup,
  studentID, isCanBeClosed,
  quarterName, billingRegSize,
  quarterNameLesson,
  handleClick
}) => (<>
  <tr key={studentID}>
    <td>{studentID}</td>
    <td>{studentNameDup}</td>
    <td>{quarterName}</td>
    <td>{!isCanBeClosed ? `Y(${quarterNameLesson})` : 'N'}</td>
    <td>
      <Button
        component={Link}
        size="small"
        to={`/admin/student/detail/${studentID}`}
        variant="contained"
      >
        인적사항
      </Button>
    </td>
    <td><Close
      id={studentID}
      name={studentName}
      disabled={!isCanBeClosed}
      handleClick={handleClick}
      billingRegSize={billingRegSize}
    /></td>
  </tr>

  {/*<Page>
    <Box display="flex">
      <Box
        flexGrow={1}
        alignSelf="center"
      >
        {studentID}: {studentNameDup}{!isCanBeClosed ? '(수업 예정/진행중)' : null}{quarterName}
      </Box>
      <Box
        alignSelf="center"
      >
        <Button
          variant="contained"
          component={Link}
          to={`/admin/student/detail/${studentID}`}
        >
          상세 보기
        </Button>
      </Box>
      <Box>
        <Close id={studentID} name={studentName} disabled={!isCanBeClosed} handleClick={handleClick} />
      </Box>
    </Box>
  </Page>
  */}
</>);
