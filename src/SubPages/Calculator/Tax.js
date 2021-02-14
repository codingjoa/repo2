import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Typography';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Page from '../../Templates/Page';

export default ({
  수업료합계,
  수업료환불합계,
  선생님월급,
  선생님소득세,
  선생님4대보험료,
  회사부담4대보험료,
  원장님월급,
  손익금,
  canbeClosedLesson
}) => (
  <Page>
    {canbeClosedLesson>0 &&
      <Typography
        variant="caption"
        color="error"
      >
        경고! 완료되지 않은 수업이 {canbeClosedLesson}개 있어 수업료 및 소득세 결과가 정확하지 않을 수 있습니다.<br />
        수업을 모두 마감해 주시기 바랍니다.
      </Typography>
    }
    <TableContainer
      component={Paper}
    >
      <Table
        size="small"
      >
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={2}
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
              colSpan={2}
              align="right"
            >
              수업료 합계 ①
            </TableCell>
            <TableCell>
              {수업료합계}원
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              colSpan={2}
              align="right"
            >
              수업료 환불 합계 ②
            </TableCell>
            <TableCell>
              {수업료환불합계}원
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              rowSpan={3}
              align="right"
            >
              선생님
            </TableCell>
            <TableCell
              align="right"
            >
              월급 ③
            </TableCell>
            <TableCell>
              {선생님월급}원
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              align="right"
            >
              소득세 ④
            </TableCell>
            <TableCell>
              {선생님소득세}원
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              align="right"
            >
              4대보험료 ⑤
            </TableCell>
            <TableCell>
              {선생님4대보험료}원
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              colSpan={2}
              align="right"
            >
              회사부담 4대보험료 ⑥
            </TableCell>
            <TableCell>
              {회사부담4대보험료}원
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              colSpan={2}
              align="right"
            >
              원장님 월급 ⑦
            </TableCell>
            <TableCell>
              {원장님월급}원
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              colSpan={2}
              align="right"
            >
              손익금 결과 (①-②-③-④-⑤-⑥-⑦) ⑧
            </TableCell>
            <TableCell>
              <Typography
                color="secondary"
              >
                {손익금}원
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Page>
)
