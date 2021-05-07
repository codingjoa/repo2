import React from 'react';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
function makeDate(lessonMonth) {
  const lm = new Date(lessonMonth);
  return `${lm.getFullYear()}년 ${lm.getMonth()+1}월`;
}
export default function({
  lessonMonths,
  useHandlarCheckbox
}) {
  const Row = lessonMonth => (
    <Grid
      item
      key={lessonMonth}
      xs={4}
    >
      <Box
        m={1}
      >
        <Checkbox
          {...useHandlarCheckbox(lessonMonth)}
        />
        {makeDate(lessonMonth)}
      </Box>
    </Grid>
  );
  return (
    <Grid
      container
    >
      {lessonMonths instanceof Array ? lessonMonths.map(Row) : null}
    </Grid>
  );
};
