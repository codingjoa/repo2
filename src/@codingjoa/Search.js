import React, { useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';


export default function Search({ setSearchKeyword }) {
  const keyword = useRef();
  return (
    <>
      <Grid container>
        <Grid item xs={8}>
          <TextField fullWidth margin="none" label="검색" type="text" inputRef={keyword} name="search" /><br/>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={e => setSearchKeyword(keyword.current?.value ?? '')}
            endIcon={<SearchIcon />}
          >
            검색
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
