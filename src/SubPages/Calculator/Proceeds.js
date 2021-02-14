import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Typography';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Page from '../../Templates/Page';

export default ({ salary, teacherName, teacherAccount, totalStudent, totalLesson, endedLesson, totalPrice, totalRefundPrice, 수업월수, 분배할돈, 선생돈 }) => (
  <Page>
    <Typography
      variant="h6"
      color="primary"
    >
      {teacherName} 선생님({teacherAccount})
    </Typography>
    <Box
      mt={1}
      mb={1}
    >
    <Grid container>
      <Grid item
       xs={4}
      >
        <Box>
          <Typography
            variant="subtitle2"
            color="primary"
          >
            담당 학생 수
          </Typography>
        </Box>
        <Box>
          {totalStudent}명
        </Box>
      </Grid>
      <Grid item
       xs={4}
      >
        <Box>
          <Typography
            variant="subtitle2"
            color="primary"
          >
            담당 수업 수
          </Typography>
        </Box>
        <Box>
          {endedLesson}/{totalLesson}개 완료
        </Box>
      </Grid>
      <Grid item
       xs={4}
      >
        <Box>
          <Typography
            variant="subtitle2"
            color="primary"
          >
            수업 개월수
          </Typography>
        </Box>
        <Box>
          {수업월수}개월
        </Box>
      </Grid>
    </Grid>
    </Box>

    <TableContainer
      component={Paper}
    >
      <Table
        size="small"
      >
        <TableHead>
          <TableRow>
            <TableCell
              align="right"
            >
              분류
            </TableCell>
            <TableCell>
              금액
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell
              align="right"
            >
              수업료 합계 ①
            </TableCell>
            <TableCell>
              {totalPrice}원
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              align="right"
            >
              수업료 환불 합계 ②
            </TableCell>
            <TableCell>
              {totalRefundPrice}원
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              align="right"
            >
              수익 (①-②또는 200000원) ③
            </TableCell>
            <TableCell>
              {분배할돈}원
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              align="right"
            >
              기본급 ({salary}-⑦) ④
            </TableCell>
            <TableCell>
              <Typography
                color="secondary"
              >
                {선생돈?.기본급}원
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              align="right"
            >
              수당 ((③-{salary})-3.3%) ⑤
            </TableCell>
            <TableCell>
              <Typography
                color="secondary"
              >
                {선생돈?.수당}원
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              align="right"
            >
              소득세 ((③-{salary})-⑤) ⑥
            </TableCell>
            <TableCell>
              {선생돈?.소득세}원
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              align="right"
            >
              4대보험료 ({salary}*4.5%) ⑦
            </TableCell>
            <TableCell>
              {선생돈?.선생부담사대보험료}원
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              align="right"
            >
              실수령액 (④+⑤) ⑧
            </TableCell>
            <TableCell>
              <Typography
                color="secondary"
              >
                {선생돈?.실수령액}원
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Page>
)
